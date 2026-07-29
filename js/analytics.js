/**
 * analytics.js v58
 *
 * 事件追踪封装：
 *   - window.Analytics.track(event, props)
 *   - window.Analytics.page(path)
 *   - window.Analytics.identify(userId)
 *
 * 转发到：
 *   - Google Analytics 4 (window.gtag)
 *   - 百度统计 (window._hmt)
 *   - console（始终）
 *   - 自定义 endpoint（可选 POST）
 *
 * 用法：
 *   <script src="/js/analytics.js"></script>
 *   <script>Analytics.track('practice_start', { subject: 'sat' });</script>
 */
(function () {
  'use strict';

  var ENDPOINT = null; // 'https://yunzhuan.icu/api/track' 生产环境可填
  var DEBUG = true;
  var QUEUE = [];

  function log_(name, payload) {
    if (!DEBUG) return;
    try {
      var t = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.log('[Analytics] ' + t + ' ' + name, payload || {});
    } catch (e) {}
  }

  function toGtag(name, props) {
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', name, props || {});
      } catch (e) {}
    }
  }

  function toBaidu(name, props) {
    if (typeof window._hmt === 'object' && window._hmt && window._hmt.push) {
      try {
        // 百度统计事件追踪
        window._hmt.push(['_trackEvent', name, JSON.stringify(props || {})]);
      } catch (e) {}
    }
  }

  function toEndpoint(name, props) {
    if (!ENDPOINT) return;
    try {
      var body = JSON.stringify({
        event: name,
        props: props || {},
        ts: Date.now(),
        path: location.pathname,
        ua: navigator.userAgent
      });
      // 用 navigator.sendBeacon 优先
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(ENDPOINT, blob);
      } else if (typeof fetch === 'function') {
        fetch(ENDPOINT, { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
          .catch(function () { /* noop */ });
      }
    } catch (e) {}
  }

  /**
   * 追踪一个事件
   * @param {string} name 事件名（snake_case 风格）
   * @param {object} [props] 附加属性
   */
  function track(name, props) {
    if (!name) return;
    var payload = Object.assign({
      path: location.pathname,
      locale: (window.I18n && window.I18n.getLocale && window.I18n.getLocale()) || 'zh-CN',
      ts: Date.now()
    }, props || {});

    log_(name, payload);
    toGtag(name, payload);
    toBaidu(name, payload);
    toEndpoint(name, payload);

    // 派发自定义事件，便于业务侧监听
    try {
      window.dispatchEvent(new CustomEvent('analytics:track', { detail: { name: name, props: payload } }));
    } catch (e) {}
  }

  /** 页面访问（默认会在 DOMContentLoaded 时自动调用） */
  function page(path) {
    track('page_view', { path: path || location.pathname });
  }

  /** 用户识别（登录后调用） */
  function identify(userId, traits) {
    if (typeof window.gtag === 'function') {
      try { window.gtag('set', 'user_properties', Object.assign({ user_id: userId }, traits || {})); } catch (e) {}
    }
    track('identify', Object.assign({ user_id: userId }, traits || {}));
  }

  var Analytics = {
    track: track,
    page: page,
    identify: identify,
    setEndpoint: function (url) { ENDPOINT = url; },
    setDebug: function (v) { DEBUG = !!v; }
  };

  if (typeof window !== 'undefined') {
    window.Analytics = Analytics;
  }

  // 自动 page_view
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { page(); });
  } else {
    // 延后一点，等其他监听器就绪
    setTimeout(function () { page(); }, 0);
  }
})();
