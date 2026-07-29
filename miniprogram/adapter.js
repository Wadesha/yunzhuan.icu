/**
 * adapter.js · v43 微信小程序 + h5 双适配层
 *
 * 目标：
 *   - 将浏览器原生 API（localStorage / fetch / window）抽象为统一的 Adapter.storage / Adapter.net
 *   - h5 模式：localStorage + fetch
 *   - 微信小程序：wx.setStorageSync / wx.getStorageSync / wx.request / wx.getSystemInfoSync
 *   - 支付宝小程序：my.setStorageSync / my.getStorageSync / my.httpRequest
 *
 * 使用方式：
 *   - h5：<script src="./adapter.js"></script>
 *   - 微信小程序：在 app.js / Page 中 require('./adapter.js') 后 window.Adapter 不可用，
 *     请改用 module.exports = Adapter;  // 小程序侧通过 getApp().globalData.adapter 访问
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Adapter = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // ---- 运行时探测 ----
  var env = {
    isWxMini: typeof wx !== 'undefined' && !!wx.getSystemInfoSync,
    isMyMini: typeof my !== 'undefined' && !!my.getSystemInfo,
    isH5: typeof window !== 'undefined' && typeof window.document !== 'undefined'
  };

  function safeJSONParse(str, fallback) {
    if (str == null) return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }

  // ============================================================
  // Storage 适配
  // ============================================================
  function createStorage() {
    if (env.isWxMini) {
      return {
        set: function (key, value) {
          try { wx.setStorageSync(key, value); return true; } catch (e) { return false; }
        },
        get: function (key, fallback) {
          try {
            var v = wx.getStorageSync(key);
            return v === '' || v == null ? (fallback !== undefined ? fallback : null) : v;
          } catch (e) { return fallback !== undefined ? fallback : null; }
        },
        remove: function (key) {
          try { wx.removeStorageSync(key); return true; } catch (e) { return false; }
        },
        clear: function () {
          try { wx.clearStorageSync(); return true; } catch (e) { return false; }
        },
        info: function () {
          try { return wx.getStorageInfoSync(); } catch (e) { return null; }
        }
      };
    }
    if (env.isMyMini) {
      return {
        set: function (key, value) {
          try { my.setStorageSync({ key: key, data: value }); return true; } catch (e) { return false; }
        },
        get: function (key, fallback) {
          try {
            var r = my.getStorageSync({ key: key });
            return (r && r.data !== undefined) ? r.data : (fallback !== undefined ? fallback : null);
          } catch (e) { return fallback !== undefined ? fallback : null; }
        },
        remove: function (key) {
          try { my.removeStorageSync({ key: key }); return true; } catch (e) { return false; }
        },
        clear: function () {
          try { my.clearStorageSync(); return true; } catch (e) { return false; }
        },
        info: function () { return null; }
      };
    }
    // h5
    return {
      set: function (key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (e) { return false; }
      },
      get: function (key, fallback) {
        try {
          var raw = localStorage.getItem(key);
          if (raw == null) return fallback !== undefined ? fallback : null;
          return safeJSONParse(raw, fallback !== undefined ? fallback : null);
        } catch (e) { return fallback !== undefined ? fallback : null; }
      },
      remove: function (key) {
        try { localStorage.removeItem(key); return true; } catch (e) { return false; }
      },
      clear: function () {
        try { localStorage.clear(); return true; } catch (e) { return false; }
      },
      info: function () {
        try { return { keys: Object.keys(localStorage), currentSize: localStorage.length }; }
        catch (e) { return null; }
      }
    };
  }

  // ============================================================
  // Network 适配
  // ============================================================
  function createNet() {
    if (env.isWxMini) {
      return {
        request: function (opts) {
          var success = opts && opts.success;
          var fail = opts && opts.fail;
          var complete = opts && opts.complete;
          return wx.request({
            url: opts.url,
            method: (opts.method || 'GET').toUpperCase(),
            data: opts.data,
            header: opts.header || { 'content-type': 'application/json' },
            dataType: opts.dataType || 'json',
            success: function (res) { if (success) success(res); if (complete) complete(res); },
            fail: function (err) { if (fail) fail(err); if (complete) complete(err); }
          });
        },
        upload: function (opts) {
          if (!wx.uploadFile) {
            if (opts.fail) opts.fail({ errMsg: 'uploadFile not supported' });
            return null;
          }
          return wx.uploadFile({
            url: opts.url,
            filePath: opts.filePath,
            name: opts.name || 'file',
            formData: opts.formData,
            success: opts.success,
            fail: opts.fail,
            complete: opts.complete
          });
        }
      };
    }
    if (env.isMyMini) {
      return {
        request: function (opts) {
          return my.httpRequest({
            url: opts.url,
            method: (opts.method || 'GET').toUpperCase(),
            data: opts.data,
            headers: opts.header,
            dataType: opts.dataType || 'json',
            success: opts.success,
            fail: opts.fail,
            complete: opts.complete
          });
        },
        upload: function (opts) {
          if (typeof my.uploadFile !== 'function') {
            if (opts.fail) opts.fail({ errMsg: 'uploadFile not supported' });
            return null;
          }
          return my.uploadFile({
            url: opts.url,
            filePath: opts.filePath,
            fileName: opts.name || 'file',
            formData: opts.formData,
            success: opts.success,
            fail: opts.fail,
            complete: opts.complete
          });
        }
      };
    }
    // h5: 用 fetch + XMLHttpRequest 兼容层
    return {
      request: function (opts) {
        if (typeof fetch === 'function') {
          return fetch(opts.url, {
            method: opts.method || 'GET',
            headers: opts.header || {},
            body: opts.data ? JSON.stringify(opts.data) : undefined
          })
            .then(function (res) {
              var wrapped = {
                statusCode: res.status,
                data: null,
                header: res.headers,
                raw: res
              };
              var ct = res.headers.get('content-type') || '';
              if (ct.indexOf('application/json') >= 0) {
                return res.json().then(function (json) {
                  wrapped.data = json;
                  if (opts.success) opts.success(wrapped);
                  if (opts.complete) opts.complete(wrapped);
                });
              }
              return res.text().then(function (txt) {
                wrapped.data = txt;
                if (opts.success) opts.success(wrapped);
                if (opts.complete) opts.complete(wrapped);
              });
            })
            .catch(function (err) {
              if (opts.fail) opts.fail({ errMsg: err && err.message || 'fetch failed' });
              if (opts.complete) opts.complete({ err: err });
            });
        }
        // XHR fallback
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open((opts.method || 'GET').toUpperCase(), opts.url, true);
          if (opts.header) {
            Object.keys(opts.header).forEach(function (k) {
              try { xhr.setRequestHeader(k, opts.header[k]); } catch (e) {}
            });
          }
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            var wrapped = { statusCode: xhr.status, data: xhr.responseText, header: null };
            try { wrapped.data = JSON.parse(xhr.responseText); } catch (e) {}
            if (opts.success) opts.success(wrapped);
            if (opts.complete) opts.complete(wrapped);
            resolve(wrapped);
          };
          xhr.onerror = function (err) {
            if (opts.fail) opts.fail({ errMsg: 'xhr failed' });
            if (opts.complete) opts.complete({ err: err });
            reject(err);
          };
          xhr.send(opts.data ? JSON.stringify(opts.data) : null);
        });
      },
      upload: function (opts) {
        if (opts.fail) opts.fail({ errMsg: 'upload not implemented in h5 adapter' });
        return null;
      }
    };
  }

  // ============================================================
  // System / UI 适配
  // ============================================================
  function createSystem() {
    return {
      info: function () {
        if (env.isWxMini) {
          try { return wx.getSystemInfoSync(); } catch (e) { return null; }
        }
        if (env.isMyMini) {
          try { return my.getSystemInfo(); } catch (e) { return null; }
        }
        var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
        return {
          platform: 'h5',
          system: ua,
          model: 'browser',
          pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
        };
      },
      showToast: function (opts) {
        if (env.isWxMini) return wx.showToast(opts);
        if (env.isMyMini) return my.showToast(opts);
        // h5 fallback
        if (typeof console !== 'undefined') console.log('[toast]', opts && opts.title);
      },
      setNavigationBarTitle: function (title) {
        if (env.isWxMini && wx.setNavigationBarTitle) wx.setNavigationBarTitle({ title: title });
        else if (env.isMyMini && my.setNavigationBar) my.setNavigationBar({ title: title });
        else if (typeof document !== 'undefined') document.title = title;
      },
      env: env
    };
  }

  return {
    env: env,
    storage: createStorage(),
    net: createNet(),
    system: createSystem(),
    isMiniProgram: env.isWxMini || env.isMyMini,
    version: 'v43.0.0'
  };
});
