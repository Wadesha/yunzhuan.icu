/**
 * utils/api.js
 * 封装 Storage（localStorage 兼容）与 Api（fetch 兼容）
 *  - Storage.get(key) / set(key, val) / remove(key)
 *  - Api.request({ url, method, data }) Promise 风格
 */
'use strict';

const Storage = {
  get(key) {
    try {
      const v = wx.getStorageSync(key);
      if (typeof v === 'string') {
        try { return JSON.parse(v); } catch (e) { return v; }
      }
      return v;
    } catch (e) {
      return null;
    }
  },
  set(key, val) {
    try {
      const s = (typeof val === 'object') ? JSON.stringify(val) : val;
      wx.setStorageSync(key, s);
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(key) {
    try { wx.removeStorageSync(key); return true; } catch (e) { return false; }
  }
};

const Api = {
  /**
   * 模拟 fetch，返回 Promise<{ ok, status, data }>
   * 用法：Api.request({ url: '/api/xxx', method: 'GET', data: {} })
   */
  request(opts) {
    return new Promise((resolve, reject) => {
      const baseUrl = 'https://yunzhuan.icu';
      const fullUrl = /^https?:\/\//.test(opts.url) ? opts.url : (baseUrl + opts.url);
      wx.request({
        url: fullUrl,
        method: opts.method || 'GET',
        data: opts.data || {},
        header: Object.assign({ 'Content-Type': 'application/json' }, opts.header || {}),
        success(res) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: res.data });
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }
};

module.exports = { Storage, Api };
