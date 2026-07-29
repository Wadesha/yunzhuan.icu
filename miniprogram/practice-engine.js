/**
 * practice-engine.js · v43 兼容层
 *
 * 目标：
 *   - 在 h5 模式下，行为与原 /js/practice-engine.js 一致（localStorage + 浮动导航）
 *   - 在微信/支付宝小程序下：
 *       1. 不依赖 window.URLSearchParams，使用 url query 解析容错
 *       2. 不依赖 window.scroll，使用 navigator 跳转 / setData
 *       3. 浮动导航自动降级为底部 mini bar
 *
 * 暴露：
 *   - window.PracticeEngine.boot({ auto: true })
 *   - window.PracticeEngine.questions
 *   - window.PracticeEngine.goNext() / goPrev() / goTo(idx)
 */
(function (root) {
  'use strict';

  if (!root.Adapter) {
    // 若 adapter 未加载，则说明没有正确引用；用 h5 兜底避免崩溃
    if (typeof console !== 'undefined') console.warn('[practice-engine] adapter.js not loaded, using localStorage fallback');
  }

  var Adapter = root.Adapter || (function () {
    return {
      storage: {
        get: function (k) {
          try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; }
        },
        set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
      },
      isMiniProgram: false
    };
  })();

  var STORAGE_KEY = 'yz_practice_data';
  var FLOATING_NAV_ID = 'yz-floating-nav-mp';

  // -------- 容错：URL query 解析（无 URLSearchParams） --------
  function parseQuery(search) {
    var out = {};
    if (!search) return out;
    var s = search.indexOf('?') === 0 ? search.slice(1) : search;
    if (!s) return out;
    s.split('&').forEach(function (kv) {
      if (!kv) return;
      var idx = kv.indexOf('=');
      var k = idx >= 0 ? kv.slice(0, idx) : kv;
      var v = idx >= 0 ? decodeURIComponent(kv.slice(idx + 1)) : '';
      out[k] = v;
    });
    return out;
  }

  function getQuery(name) {
    var s = typeof location !== 'undefined' ? location.search : '';
    var q = parseQuery(s);
    return q[name] || '';
  }

  // -------- 答题记录 --------
  function loadAll() {
    var data = Adapter.storage.get(STORAGE_KEY);
    if (!data || typeof data !== 'object') return { records: {} };
    if (!data.records) data.records = {};
    return data;
  }
  function saveAll(data) { Adapter.storage.set(STORAGE_KEY, data); }
  function recordAnswer(subject, qid, selected, correct, topic) {
    var data = loadAll();
    if (!data.records[subject]) data.records[subject] = {};
    data.records[subject][qid] = {
      selected: selected, correct: !!correct, topic: topic || '', ts: Date.now()
    };
    saveAll(data);
  }

  // -------- 浮动导航（小程序降级为底部 mini bar） --------
  function renderFloatingNav(state) {
    var old = document.getElementById(FLOATING_NAV_ID);
    if (old) old.parentNode.removeChild(old);

    var bar = document.createElement('div');
    bar.id = FLOATING_NAV_ID;
    bar.style.cssText = Adapter.isMiniProgram
      ? 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff;border-top:1px solid #111;display:flex;justify-content:space-around;align-items:center;padding:8px 0;font-size:0.8rem;'
      : 'position:fixed;right:16px;bottom:16px;z-index:9999;background:#fff;border:1px solid #111;padding:8px 10px;font-size:0.8rem;display:flex;align-items:center;gap:6px;max-width:340px;box-shadow:0 2px 8px rgba(0,0,0,0.1);';

    function makeBtn(text, onClick) {
      var b = document.createElement('button');
      b.textContent = text;
      b.style.cssText = 'border:1px solid #111;background:#fff;padding:4px 10px;cursor:pointer;font-family:inherit;font-size:0.8rem;';
      if (onClick) b.addEventListener('click', onClick);
      return b;
    }
    var counter = document.createElement('span');
    counter.style.cssText = 'margin:0 4px;white-space:nowrap;';
    counter.textContent = (state.index + 1) + ' / ' + state.total;

    var prev = makeBtn('←', function () { goPrev(); });
    var next = makeBtn('→', function () { goNext(); });
    bar.appendChild(prev);
    bar.appendChild(counter);
    bar.appendChild(next);

    document.body.appendChild(bar);
  }

  function findVisibleQuestions() {
    var all = Array.prototype.slice.call(document.querySelectorAll('[data-qid]'));
    return all.filter(function (q) { return q.style.display !== 'none'; });
  }

  function scrollToVisible(visible, idx) {
    if (idx < 0 || idx >= visible.length) return;
    var target = visible[idx];
    if (Adapter.isMiniProgram) {
      // 小程序没有 window.scroll；用 location 锚点 + 后退栈
      try {
        if (target.id) {
          location.hash = '#' + target.id;
        }
      } catch (e) {}
    } else {
      try {
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      } catch (e) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  var currentState = { index: 0, total: 0, subject: 'unknown' };

  function goNext() {
    var visible = findVisibleQuestions();
    if (!visible.length) return;
    currentState.index = Math.min(currentState.index + 1, visible.length - 1);
    renderFloatingNav(currentState);
    scrollToVisible(visible, currentState.index);
  }
  function goPrev() {
    var visible = findVisibleQuestions();
    if (!visible.length) return;
    currentState.index = Math.max(currentState.index - 1, 0);
    renderFloatingNav(currentState);
    scrollToVisible(visible, currentState.index);
  }
  function goTo(idx) {
    var visible = findVisibleQuestions();
    if (!visible.length) return;
    currentState.index = Math.max(0, Math.min(idx, visible.length - 1));
    renderFloatingNav(currentState);
    scrollToVisible(visible, currentState.index);
  }

  // -------- 题目答案记录 hook --------
  function attachAnswerRecorder() {
    var subject = document.body.getAttribute('data-subject') || 'unknown';
    currentState.subject = subject;
    var questions = document.querySelectorAll('[data-qid]');
    questions.forEach(function (q) {
      var qid = q.getAttribute('data-qid');
      if (!qid) return;
      var options = q.querySelectorAll('input[type=radio], input[type=checkbox], button[data-option]');
      options.forEach(function (opt) {
        opt.addEventListener('change', function () {
          var selected = opt.value || opt.getAttribute('data-option') || opt.textContent;
          var correct = q.querySelector('.answer-correct, .correct, [data-correct="true"]');
          var topicEl = q.querySelector('.q-num');
          var topic = '';
          if (topicEl) {
            var m = topicEl.textContent.match(/【([A-Za-z0-9_-]+)】/);
            if (m) topic = m[1];
          }
          recordAnswer(subject, qid, selected, !!correct, topic);
        });
      });
    });
  }

  function boot(opts) {
    opts = opts || {};
    if (!opts.subject) {
      currentState.subject = document.body.getAttribute('data-subject') || 'unknown';
    }
    var visible = findVisibleQuestions();
    currentState.total = visible.length;
    if (opts.auto) {
      attachAnswerRecorder();
      renderFloatingNav(currentState);
    }
  }

  // v43 额外：暴露手势接口（v46 gesture.js 也可复用）
  var PracticeEngine = {
    boot: boot,
    goNext: goNext,
    goPrev: goPrev,
    goTo: goTo,
    recordAnswer: function (qid, sel, ok, topic) {
      recordAnswer(currentState.subject, qid, sel, ok, topic);
    },
    isMiniProgram: Adapter.isMiniProgram,
    getQuery: getQuery
  };

  root.PracticeEngine = PracticeEngine;
})(typeof window !== 'undefined' ? window : globalThis);
