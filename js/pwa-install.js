/**
 * PWA Install Helper v57
 * 提供：
 *   - window.PWAInstall.prompt()      触发 beforeinstallprompt 安装
 *   - 自动捕获 beforeinstallprompt 事件
 *   - 监听 appinstalled 事件
 *   - 30 秒延迟后弹出首次引导浮窗
 *   - 已安装检测（display-mode: standalone / iOS standalone）
 *
 * 用法：
 *   <script src="/js/pwa-install.js"></script>
 *   <button onclick="PWAInstall.prompt()">安装</button>
 */
(function () {
  'use strict';

  var STORAGE_KEY_DISMISS = 'yz_pwa_dismissed';
  var STORAGE_KEY_INSTALLED = 'yz_pwa_installed';
  var FIRST_DELAY_MS = 30 * 1000;

  var state = {
    deferredPrompt: null,
    installed: false,
    available: false,
    dismissed: false,
    timer: null
  };

  function isStandalone() {
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      if (window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches) return true;
      if (window.navigator && window.navigator.standalone === true) return true;
    } catch (e) {}
    return false;
  }

  function isInstalled() {
    try {
      if (localStorage.getItem(STORAGE_KEY_INSTALLED) === '1') return true;
    } catch (e) {}
    return isStandalone();
  }

  function isDismissed() {
    try {
      var v = localStorage.getItem(STORAGE_KEY_DISMISSED);
      // 7 天内不再提示
      if (v) {
        var t = parseInt(v, 10);
        if (t && (Date.now() - t) < 7 * 24 * 3600 * 1000) return true;
      }
    } catch (e) {}
    return false;
  }

  function markInstalled() {
    try { localStorage.setItem(STORAGE_KEY_INSTALLED, '1'); } catch (e) {}
    state.installed = true;
  }

  function markDismissed() {
    try { localStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now())); } catch (e) {}
    state.dismissed = true;
  }

  // === UI：浮窗 ===
  function ensureBubble() {
    var id = 'yz-pwa-bubble';
    var old = document.getElementById(id);
    if (old) return old;
    var div = document.createElement('div');
    div.id = id;
    div.style.cssText = [
      'position:fixed', 'right:16px', 'bottom:16px',
      'max-width:320px', 'padding:14px 16px',
      'background:#ffffff', 'border:1px solid #111111',
      'box-shadow:0 4px 16px rgba(0,0,0,.12)',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      'font-size:14px', 'line-height:1.5', 'color:#111111',
      'z-index:99999', 'display:none'
    ].join(';');
    div.innerHTML =
      '<div style="font-weight:700;margin-bottom:4px;">' +
        '<span data-i18n="install.title">安装 yunzhuan App</span>' +
      '</div>' +
      '<div style="color:#555;margin-bottom:10px;font-size:12px;">' +
        '<span data-i18n="install.subtitle">添加到桌面，离线可用，秒开启动</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button id="yz-pwa-install-btn" style="flex:1;padding:6px 0;background:#111;color:#fff;border:1px solid #111;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px;">' +
          '<span data-i18n="install.button">安装到桌面</span>' +
        '</button>' +
        '<button id="yz-pwa-later-btn" style="padding:6px 12px;background:#fff;color:#111;border:1px solid #888;cursor:pointer;font-family:inherit;font-size:13px;">' +
          '稍后' +
        '</button>' +
      '</div>';
    document.body.appendChild(div);
    var btn = document.getElementById('yz-pwa-install-btn');
    var later = document.getElementById('yz-pwa-later-btn');
    btn.addEventListener('click', function () {
      hideBubble();
      PWAInstall.prompt();
    });
    later.addEventListener('click', function () {
      hideBubble();
      markDismissed();
    });
    return div;
  }

  function showBubble() {
    if (isInstalled() || isDismissed()) return;
    var b = ensureBubble();
    b.style.display = 'block';
    if (window.I18n && window.I18n.apply) {
      try { window.I18n.apply(b); } catch (e) {}
    }
  }

  function hideBubble() {
    var b = document.getElementById('yz-pwa-bubble');
    if (b) b.style.display = 'none';
  }

  // === Event Hooks ===
  window.addEventListener('beforeinstallprompt', function (e) {
    // 阻止默认，保留 prompt
    e.preventDefault();
    state.deferredPrompt = e;
    state.available = true;
    try { window.dispatchEvent(new CustomEvent('pwa:available', { detail: { available: true } })); } catch (err) {}
  });

  window.addEventListener('appinstalled', function () {
    markInstalled();
    hideBubble();
    try { window.dispatchEvent(new CustomEvent('pwa:installed', { detail: { installed: true } })); } catch (err) {}
  });

  // === Public API ===
  var PWAInstall = {
    isAvailable: function () { return !!state.deferredPrompt && !isInstalled(); },
    isInstalled: isInstalled,
    isStandalone: isStandalone,
    hideBubble: hideBubble,
    showBubble: showBubble,
    dismiss: markDismissed,
    /** 主动触发系统安装提示 */
    prompt: function () {
      if (!state.deferredPrompt) {
        // 引导用户到 install.html
        if (window.location && window.location.assign) {
          window.location.assign('/academics/practice/install.html');
        }
        return Promise.resolve({ outcome: 'unavailable' });
      }
      var p = state.deferredPrompt;
      state.deferredPrompt = null;
      return p.prompt().then(function () {
        return p.userChoice.then(function (choice) {
          if (choice && choice.outcome === 'accepted') {
            markInstalled();
          } else {
            markDismissed();
          }
          return choice;
        });
      });
    },
    /** 重置 dismiss 标记（用于 install 页"我已安装"按钮） */
    resetDismiss: function () {
      try { localStorage.removeItem(STORAGE_KEY_DISMISSED); } catch (e) {}
      state.dismissed = false;
    }
  };

  // === Auto init ===
  function init() {
    if (isInstalled()) {
      markInstalled();
      return;
    }
    // 30 秒后第一次浮窗
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(function () {
      if (!isInstalled() && !isDismissed()) {
        showBubble();
      }
    }, FIRST_DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PWAInstall = PWAInstall;
})();
