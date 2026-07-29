/**
 * gesture.js · v46 手势 + 护眼模式 + VIP 主题
 *
 * API:
 *   - window.Gesture.init()                    绑定滑动/捏合/长按
 *   - window.Gesture.on('swipeUp', cb)         上滑 → 下一题（practice.html）
 *   - window.Gesture.on('swipeDown', cb)       下滑 → 上一题
 *   - window.Gesture.on('pinch', cb)           双指捏合 → 字号调节（delta 缩放比例）
 *
 *   - window.CareMode.toggle()                 切换护眼模式
 *   - window.CareMode.enable() / disable()
 *
 *   - window.Theme.set(name)                   切换主题（默认/海洋/森林/紫罗兰）
 *   - window.Theme.get()                       当前主题名
 *   - window.Theme.isVip()                     是否会员（默认 false；可由后端覆盖）
 *   - window.Theme.unlockVip()                 解锁 VIP（调试用）
 */
(function (root) {
  'use strict';

  // ====================================================================
  // 1. Gesture 模块
  // ====================================================================
  var Gesture = (function () {
    var listeners = { swipeUp: [], swipeDown: [], swipeLeft: [], swipeRight: [], pinch: [], longpress: [] };
    var touchState = null;
    var longPressTimer = null;

    function fire(type, payload) {
      (listeners[type] || []).forEach(function (cb) {
        try { cb(payload); } catch (e) { if (console) console.warn('[Gesture] listener error', e); }
      });
    }

    function on(type, cb) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(cb);
    }

    function getXY(t) { return [t.clientX, t.clientY]; }

    function onTouchStart(e) {
      if (e.touches.length === 1) {
        touchState = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTime: Date.now(),
          moved: false,
          initialDistance: 0
        };
        // 长按检测
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(function () {
          if (touchState && !touchState.moved) {
            fire('longpress', { x: touchState.startX, y: touchState.startY });
          }
        }, 600);
      } else if (e.touches.length === 2) {
        touchState = {
          startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          startY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          startTime: Date.now(),
          moved: false,
          initialDistance: Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          )
        };
        clearTimeout(longPressTimer);
      }
    }

    function onTouchMove(e) {
      if (!touchState) return;
      touchState.moved = true;
      clearTimeout(longPressTimer);

      if (e.touches.length === 2 && touchState.initialDistance > 0) {
        var d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        var scale = d / touchState.initialDistance;
        fire('pinch', { scale: scale, delta: scale - 1 });
        touchState.initialDistance = d;
      }
    }

    function onTouchEnd(e) {
      clearTimeout(longPressTimer);
      if (!touchState) return;
      if (touchState.initialDistance && touchState.initialDistance > 0) {
        // 此前是双指，结束时不发 swipe
        touchState = null;
        return;
      }
      var t = e.changedTouches[0];
      if (!t) { touchState = null; return; }
      var dx = t.clientX - touchState.startX;
      var dy = t.clientY - touchState.startY;
      var dt = Date.now() - touchState.startTime;
      var absX = Math.abs(dx);
      var absY = Math.abs(dy);
      if (dt < 600 && (absX > 50 || absY > 50)) {
        if (absY > absX) {
          if (dy < 0) fire('swipeUp', { dx: dx, dy: dy });
          else fire('swipeDown', { dx: dx, dy: dy });
        } else {
          if (dx < 0) fire('swipeLeft', { dx: dx, dy: dy });
          else fire('swipeRight', { dx: dx, dy: dy });
        }
      }
      touchState = null;
    }

    function init() {
      var target = document.body || document.documentElement;
      if (!target) return;
      target.addEventListener('touchstart', onTouchStart, { passive: true });
      target.addEventListener('touchmove', onTouchMove, { passive: true });
      target.addEventListener('touchend', onTouchEnd, { passive: true });
      target.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // 默认绑定 practice.html 的上滑/下滑 → 题目切换
      if (root.PracticeEngine) {
        on('swipeUp', function () { try { root.PracticeEngine.goNext(); } catch (e) {} });
        on('swipeDown', function () { try { root.PracticeEngine.goPrev(); } catch (e) {} });
      }
    }

    return { init: init, on: on, version: 'v46.0.0' };
  })();

  // ====================================================================
  // 2. CareMode 模块（v46.1 护眼）
  // ====================================================================
  var CareMode = (function () {
    var STYLE_ID = 'yz-care-mode-style';
    var KEY = 'care_mode';

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) return;
      var s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = 'html.care-mode { filter: sepia(20%) saturate(0.9) brightness(0.95); }\n' +
        'html.care-mode body { background: #f4ecd8 !important; }\n' +
        'html.care-mode img, html.care-mode video { filter: sepia(10%) saturate(0.95); }';
      document.head.appendChild(s);
    }

    function isEnabled() {
      try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }

    function setEnabled(v) {
      try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
      var html = document.documentElement;
      if (v) html.classList.add('care-mode');
      else html.classList.remove('care-mode');
      // 触发自定义事件，dashboard 顶部开关可监听
      try {
        document.dispatchEvent(new CustomEvent('caremodechange', { detail: { enabled: v } }));
      } catch (e) {}
    }

    function enable() { injectStyle(); setEnabled(true); }
    function disable() { setEnabled(false); }
    function toggle() { if (isEnabled()) disable(); else enable(); return isEnabled(); }

    // 启动时恢复
    function init() {
      injectStyle();
      if (isEnabled()) setEnabled(true);
    }

    return { init: init, toggle: toggle, enable: enable, disable: disable, isEnabled: isEnabled };
  })();

  // ====================================================================
  // 3. Theme 模块（v46.2 VIP 主题）
  // ====================================================================
  var Theme = (function () {
    var KEY = 'theme';
    var VIP_KEY = 'is_vip';

    // 4 套主题 —— 黑白灰为主，3 套 VIP 主题仅为低饱和度彩色变体
    // 不破坏整体黑白灰主色
    var THEMES = {
      default: { name: '默认 (黑白灰)', vip: false, css: '' },
      ocean:   { name: '海洋 (蓝灰)',   vip: true,  css:
        'html.theme-ocean body { background: #f4f6f8; color: #1a2733; }\n' +
        'html.theme-ocean a { color: #2c4a6b; border-bottom-color: #b0c0d0; }\n' +
        'html.theme-ocean h2, html.theme-ocean h1 { color: #1a2733; border-bottom-color: #1a2733; }\n' +
        'html.theme-ocean .card, html.theme-ocean .box { border-color: #cfd9e2; background: #ffffff; }'
      },
      forest:  { name: '森林 (绿灰)',   vip: true,  css:
        'html.theme-forest body { background: #f5f7f3; color: #1f2e1f; }\n' +
        'html.theme-forest a { color: #2e5a3e; border-bottom-color: #b8c8b0; }\n' +
        'html.theme-forest h2, html.theme-forest h1 { color: #1f2e1f; border-bottom-color: #1f2e1f; }\n' +
        'html.theme-forest .card, html.theme-forest .box { border-color: #cdd9c8; background: #ffffff; }'
      },
      violet:  { name: '紫罗兰 (灰紫)', vip: true,  css:
        'html.theme-violet body { background: #f6f4f8; color: #2a2435; }\n' +
        'html.theme-violet a { color: #4a3b6b; border-bottom-color: #c0b8d0; }\n' +
        'html.theme-violet h2, html.theme-violet h1 { color: #2a2435; border-bottom-color: #2a2435; }\n' +
        'html.theme-violet .card, html.theme-violet .box { border-color: #d5cce0; background: #ffffff; }'
      }
    };

    var STYLE_ID = 'yz-theme-style';

    function isVip() {
      try { return localStorage.getItem(VIP_KEY) === '1'; } catch (e) { return false; }
    }
    function unlockVip() { try { localStorage.setItem(VIP_KEY, '1'); } catch (e) {} }
    function lockVip() { try { localStorage.removeItem(VIP_KEY); } catch (e) {} }

    function get() {
      try { return localStorage.getItem(KEY) || 'default'; } catch (e) { return 'default'; }
    }

    function set(name) {
      if (!THEMES[name]) name = 'default';
      // VIP 主题权限校验
      if (THEMES[name].vip && !isVip()) {
        try { document.dispatchEvent(new CustomEvent('themerestricted', { detail: { name: name } })); } catch (e) {}
        return { ok: false, reason: 'vip' };
      }
      try { localStorage.setItem(KEY, name); } catch (e) {}

      // 注入主题 CSS
      var s = document.getElementById(STYLE_ID);
      if (!s) {
        s = document.createElement('style');
        s.id = STYLE_ID;
        document.head.appendChild(s);
      }
      // 移除所有 theme-* class
      var html = document.documentElement;
      Object.keys(THEMES).forEach(function (k) { html.classList.remove('theme-' + k); });
      // 应用新主题
      if (name !== 'default') {
        html.classList.add('theme-' + name);
        s.textContent = THEMES[name].css;
      } else {
        s.textContent = '';
      }
      try {
        document.dispatchEvent(new CustomEvent('themechange', { detail: { name: name } }));
      } catch (e) {}
      return { ok: true, name: name };
    }

    function list() { return Object.keys(THEMES).map(function (k) {
      return { key: k, name: THEMES[k].name, vip: THEMES[k].vip };
    }); }

    function init() { set(get()); }

    return {
      init: init, get: get, set: set, list: list,
      isVip: isVip, unlockVip: unlockVip, lockVip: lockVip,
      THEMES: THEMES
    };
  })();

  // ====================================================================
  // 自动启动
  // ====================================================================
  function init() {
    CareMode.init();
    Theme.init();
    Gesture.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露
  root.Gesture = Gesture;
  root.CareMode = CareMode;
  root.Theme = Theme;
})(typeof window !== 'undefined' ? window : globalThis);
