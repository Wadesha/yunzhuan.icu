/* ================================================================
 * trial.js v53
 * 试听 + 限免权益 (Trial / Limited Free Features)
 *
 * 试用功能:
 *   - ai_question : AI 出题
 *   - writing_review : 写作精评
 *   - srs_deep : 间隔复习深度版
 *   - collab_large : 协作大房间
 *
 * 时长档位:
 *   - 15min, 30min, 24h
 *
 * 重置周期: 7 天 (每功能 7 天内只能开 1 次)
 *
 * API:
 *   window.Trial.start(feature, durationMin)
 *   window.Trial.active(feature)            -> {active, remaining, expireAt}
 *   window.Trial.cancel(feature)
 *   window.Trial.history()
 *   window.Trial.canStart(feature)          -> 7 天内是否还能开
 *   window.Trial.nextAvailable(feature)     -> 7 天后可开时间
 *   window.Trial.getFeatures()
 *   window.Trial.formatRemaining(ms)
 * ================================================================ */
(function() {
  'use strict';

  var ACTIVE_KEY = 'yz_trial_active';
  var HISTORY_KEY = 'yz_trial_history';
  var RESET_WINDOW = 7 * 24 * 60 * 60 * 1000;

  var FEATURES = {
    ai_question: {
      key: 'ai_question',
      name: 'AI 出题',
      desc: 'AI 根据你的错题与薄弱点,智能生成针对性练习题',
      icon: '🤖',
      allowedDurations: [15, 30, 1440]
    },
    writing_review: {
      key: 'writing_review',
      name: '写作精评',
      desc: 'AI 逐句精评你的作文,给出词汇/语法/结构/逻辑四维评分',
      icon: '✍️',
      allowedDurations: [15, 30, 1440]
    },
    srs_deep: {
      key: 'srs_deep',
      name: '间隔复习深度版',
      desc: '解锁 SM-17 高级调度算法,支持错题深度追踪与遗忘曲线预测',
      icon: '🧠',
      allowedDurations: [15, 30, 1440]
    },
    collab_large: {
      key: 'collab_large',
      name: '协作大房间',
      desc: '解锁 50 人协作房间、白板协作、语音房间等高级功能',
      icon: '👥',
      allowedDurations: [30, 1440]
    }
  };

  function lsGet(key, def) {
    try { var raw = localStorage.getItem(key); if (raw === null) return def; return JSON.parse(raw); } catch(e) { return def; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  function getActive() {
    return lsGet(ACTIVE_KEY, {});
  }
  function setActive(obj) {
    lsSet(ACTIVE_KEY, obj);
  }
  function getHistory() {
    return lsGet(HISTORY_KEY, []);
  }
  function addHistory(entry) {
    var h = getHistory();
    h.unshift(entry);
    if (h.length > 100) h = h.slice(0, 100);
    lsSet(HISTORY_KEY, h);
  }

  // 清理过期
  function sweep() {
    var act = getActive();
    var now = Date.now();
    var changed = false;
    Object.keys(act).forEach(function(k) {
      if (act[k] && act[k].expireAt && act[k].expireAt <= now) {
        // 试用到期, 归档到历史
        act[k].status = 'expired';
        addHistory(Object.assign({}, act[k], { sweptAt: now }));
        delete act[k];
        changed = true;
      }
    });
    if (changed) setActive(act);
    return act;
  }

  var Trial = {
    FEATURES: FEATURES,
    RESET_WINDOW: RESET_WINDOW,

    init: function() { sweep(); },

    getFeatures: function() {
      return Object.keys(FEATURES).map(function(k) {
        var f = Object.assign({}, FEATURES[k]);
        var a = this.active(k);
        f.active = a.active;
        f.remaining = a.remaining;
        f.expireAt = a.expireAt;
        f.canStart = this.canStart(k);
        f.nextAvailable = this.nextAvailable(k);
        return f;
      }.bind(this));
    },

    // 是否可开启 (7 天内未开过)
    canStart: function(featureKey) {
      if (!FEATURES[featureKey]) return false;
      var act = sweep();
      if (act[featureKey] && act[featureKey].expireAt > Date.now()) return false; // 还在用
      var hist = getHistory().filter(function(h) {
        return h.feature === featureKey && (Date.now() - h.ts) < RESET_WINDOW;
      });
      return hist.length === 0;
    },

    // 下次可开时间
    nextAvailable: function(featureKey) {
      if (!FEATURES[featureKey]) return 0;
      var act = sweep();
      if (act[featureKey] && act[featureKey].expireAt > Date.now()) return act[featureKey].expireAt;
      var hist = getHistory().filter(function(h) {
        return h.feature === featureKey && (Date.now() - h.ts) < RESET_WINDOW;
      });
      if (hist.length === 0) return Date.now();
      // 取最近一次, 加 7 天
      var last = hist[0];
      return last.ts + RESET_WINDOW;
    },

    // 开启试用
    start: function(featureKey, durationMin) {
      sweep();
      if (!FEATURES[featureKey]) return { ok: false, error: '未知功能: ' + featureKey };
      if (!this.canStart(featureKey)) {
        var next = this.nextAvailable(featureKey);
        return { ok: false, error: '7 天内已使用过,下次可开启时间: ' + new Date(next).toLocaleString('zh-CN') };
      }
      var feature = FEATURES[featureKey];
      if (feature.allowedDurations.indexOf(durationMin) < 0) {
        return { ok: false, error: '不支持的时长,允许: ' + feature.allowedDurations.join(' / ') + ' 分钟' };
      }
      var now = Date.now();
      var expireAt = now + durationMin * 60 * 1000;
      var act = getActive();
      act[featureKey] = {
        feature: featureKey,
        startedAt: now,
        expireAt: expireAt,
        durationMin: durationMin,
        status: 'active'
      };
      setActive(act);
      addHistory({
        ts: now,
        feature: featureKey,
        durationMin: durationMin,
        expireAt: expireAt,
        status: 'started'
      });
      return { ok: true, feature: featureKey, durationMin: durationMin, expireAt: expireAt };
    },

    // 主动取消
    cancel: function(featureKey) {
      var act = getActive();
      if (!act[featureKey]) return { ok: false, error: '未开启该试用' };
      act[featureKey].status = 'cancelled';
      act[featureKey].cancelledAt = Date.now();
      addHistory(Object.assign({}, act[featureKey], { sweptAt: Date.now() }));
      delete act[featureKey];
      setActive(act);
      return { ok: true };
    },

    // 检查状态
    active: function(featureKey) {
      sweep();
      var act = getActive();
      var a = act[featureKey];
      if (!a) return { active: false, remaining: 0, expireAt: 0 };
      var now = Date.now();
      if (a.expireAt <= now) return { active: false, remaining: 0, expireAt: a.expireAt };
      return {
        active: true,
        remaining: a.expireAt - now,
        expireAt: a.expireAt,
        startedAt: a.startedAt,
        durationMin: a.durationMin
      };
    },

    // 所有活跃
    activeAll: function() {
      sweep();
      var act = getActive();
      return Object.keys(act).map(function(k) {
        var info = this.active(k);
        return Object.assign({ key: k }, info, FEATURES[k]);
      }.bind(this));
    },

    history: function() { return getHistory(); },

    formatRemaining: function(ms) {
      if (!ms || ms <= 0) return '已到期';
      var totalSec = Math.floor(ms / 1000);
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      if (h >= 24) {
        var d = Math.floor(h / 24);
        return d + ' 天 ' + (h % 24) + ' 时 ' + m + ' 分';
      }
      if (h > 0) return h + ' 时 ' + m + ' 分 ' + s + ' 秒';
      if (m > 0) return m + ' 分 ' + s + ' 秒';
      return s + ' 秒';
    }
  };

  if (typeof window !== 'undefined') {
    window.Trial = Trial;
    try { Trial.init(); } catch (e) {}
  }
})();
