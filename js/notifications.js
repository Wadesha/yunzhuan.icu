/**
 * notifications.js · v45 推送通知 + 离线消息
 *
 * API:
 *   window.Notifications.requestPermission()  -> Promise<'default'|'granted'|'denied'>
 *   window.Notifications.schedule(title, body, time)  -> setTimeout 延时触发
 *   window.Notifications.daily(time, title, body)    -> 每天定时
 *   window.Notifications.show(title, body)           -> 立即触发
 *   window.Notifications.log()                       -> localStorage.notifications_log
 *
 * 默认规则:
 *   - 每日 09:00  "今日计划"
 *   - 每日 21:00  "今日打卡提醒"
 *   - SRS 到期推送
 *   - 倒计时 v28 考试日 7/3/1 天提醒
 */
(function (root) {
  'use strict';

  var STORAGE_KEY = 'notifications_log';
  var RULES_KEY = 'notifications_rules';
  var PERM_KEY = 'notifications_permission';

  // ---------------- 工具 ----------------
  function safeJSONParse(str, fallback) {
    if (str == null) return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }
  function readLog() {
    try { return safeJSONParse(localStorage.getItem(STORAGE_KEY), []) || []; } catch (e) { return []; }
  }
  function writeLog(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 200))); } catch (e) {}
  }
  function readRules() {
    return safeJSONParse(localStorage.getItem(RULES_KEY), null) || {
      daily9: true, daily21: true, srs: true, examCountdown: true
    };
  }
  function writeRules(r) { try { localStorage.setItem(RULES_KEY, JSON.stringify(r)); } catch (e) {} }

  function recordToLog(entry) {
    var log = readLog();
    log.unshift({
      id: 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: entry.title || '',
      body: entry.body || '',
      type: entry.type || 'custom',
      ts: entry.ts || Date.now(),
      read: false
    });
    writeLog(log);
  }

  function nativeNotify(title, body) {
    if (typeof Notification === 'undefined') return null;
    if (Notification.permission !== 'granted') return null;
    try {
      return new Notification(title, {
        body: body || '',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'yunzhuan-' + Date.now()
      });
    } catch (e) { return null; }
  }

  function fallbackInPage(title, body) {
    // 当 Notification API 不可用时，降级为页面内 toast
    var div = document.createElement('div');
    div.style.cssText = 'position:fixed;left:16px;right:16px;bottom:80px;z-index:99999;background:#111;color:#fff;padding:12px 16px;font-size:0.88rem;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    div.innerHTML = '<strong>' + title + '</strong><div style="opacity:0.8;font-size:0.8rem;margin-top:2px;">' + (body || '') + '</div>';
    document.body.appendChild(div);
    setTimeout(function () {
      if (div.parentNode) div.parentNode.removeChild(div);
    }, 5000);
  }

  // ---------------- 公共 API ----------------
  function requestPermission() {
    return new Promise(function (resolve) {
      if (typeof Notification === 'undefined') {
        try { localStorage.setItem(PERM_KEY, 'unsupported'); } catch (e) {}
        return resolve('unsupported');
      }
      if (Notification.permission === 'granted') {
        try { localStorage.setItem(PERM_KEY, 'granted'); } catch (e) {}
        return resolve('granted');
      }
      if (Notification.permission === 'denied') {
        try { localStorage.setItem(PERM_KEY, 'denied'); } catch (e) {}
        return resolve('denied');
      }
      Notification.requestPermission(function (perm) {
        try { localStorage.setItem(PERM_KEY, perm); } catch (e) {}
        resolve(perm);
      });
    });
  }

  function getPermission() {
    try {
      var p = localStorage.getItem(PERM_KEY);
      if (p) return p;
    } catch (e) {}
    if (typeof Notification !== 'undefined') return Notification.permission || 'default';
    return 'unsupported';
  }

  function show(title, body, type) {
    recordToLog({ title: title, body: body, type: type || 'custom', ts: Date.now() });
    var n = nativeNotify(title, body);
    if (!n) fallbackInPage(title, body);
    return true;
  }

  function schedule(title, body, time, type) {
    // time: number timestamp or Date or '+1h' 之类字符串
    var ts;
    if (typeof time === 'number') ts = time;
    else if (time instanceof Date) ts = time.getTime();
    else if (typeof time === 'string') ts = new Date(time).getTime();
    else ts = Date.now() + 60 * 1000;

    var delay = Math.max(0, ts - Date.now());
    var id = setTimeout(function () {
      show(title, body, type || 'scheduled');
    }, delay);
    return { id: id, fireAt: ts, title: title, body: body, type: type || 'scheduled' };
  }

  // "HH:MM" 形式 → 当日 timestamp
  function todayAt(hhmm) {
    var parts = String(hhmm).split(':');
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1] || '0', 10);
    var d = new Date();
    d.setHours(h, m, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return d.getTime();
  }

  var dailyTimers = [];
  function daily(hhmm, title, body, type) {
    var fireAt = todayAt(hhmm);
    var t = setTimeout(function () {
      show(title, body, type || 'daily');
      // 24h 后再排
      daily(hhmm, title, body, type);
    }, Math.max(0, fireAt - Date.now()));
    dailyTimers.push(t);
    return t;
  }

  // ---------------- 默认规则 ----------------
  function bootstrapDefaults() {
    var rules = readRules();
    if (rules.daily9) daily('09:00', '今日计划', '打开 Dashboard 看看今天的任务清单吧', 'daily9');
    if (rules.daily21) daily('21:00', '今日打卡提醒', '别忘了完成今天的刷题和复习', 'daily21');
  }

  // ---------------- SRS 到期提醒 ----------------
  function checkSrsDue() {
    if (!root.SRS || typeof root.SRS.getDueQuestions !== 'function') return 0;
    try {
      var due = root.SRS.getDueQuestions('all');
      if (due && due.length > 0) {
        show('SRS 复习到期', '你有 ' + due.length + ' 道题目需要复习', 'srs');
        return due.length;
      }
    } catch (e) {}
    return 0;
  }

  // ---------------- v28 考试日倒计时 ----------------
  function checkExamCountdown() {
    var exam = null;
    try {
      var s = localStorage.getItem('v28_exam_date');
      if (s) exam = new Date(s);
    } catch (e) {}
    if (!exam || isNaN(exam.getTime())) return null;

    var daysLeft = Math.ceil((exam.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
      var firedKey = 'exam_countdown_fired_' + daysLeft;
      try {
        if (localStorage.getItem(firedKey)) return null;
        localStorage.setItem(firedKey, '1');
      } catch (e) {}
      show('考试倒计时 ' + daysLeft + ' 天', '距离 v28 考试还有 ' + daysLeft + ' 天，加油！', 'exam');
      return daysLeft;
    }
    return null;
  }

  // ---------------- 初始化 ----------------
  var bootstrapped = false;
  function bootstrap() {
    if (bootstrapped) return;
    bootstrapped = true;
    bootstrapDefaults();

    // 每 30 分钟轮询检查 SRS / 考试倒计时（轻量）
    setInterval(function () {
      var rules = readRules();
      if (rules.srs) checkSrsDue();
      if (rules.examCountdown) checkExamCountdown();
    }, 30 * 60 * 1000);

    // 启动时立即检查一次（SRS 频繁一些）
    setTimeout(function () { checkSrsDue(); checkExamCountdown(); }, 3000);
  }

  // 自动启动（DOMContentLoaded 后）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // ---------------- 暴露 ----------------
  root.Notifications = {
    version: 'v45.0.0',
    requestPermission: requestPermission,
    getPermission: getPermission,
    show: show,
    schedule: schedule,
    daily: daily,
    checkSrsDue: checkSrsDue,
    checkExamCountdown: checkExamCountdown,
    getRules: readRules,
    setRules: writeRules,
    getLog: readLog,
    clearLog: function () { writeLog([]); },
    markAllRead: function () {
      var log = readLog();
      log.forEach(function (e) { e.read = true; });
      writeLog(log);
    },
    bootstrap: bootstrap
  };
})(typeof window !== 'undefined' ? window : globalThis);
