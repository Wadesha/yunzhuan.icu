/* ================================================================
 * membership.js v51
 * 会员等级体系 (Membership Tier System)
 *
 * 等级: Free / Bronze / Silver / Gold / Diamond
 * 价格: Free / ¥19 / ¥49 / ¥99 / ¥199 (per month)
 *
 * API:
 *   window.Membership.getLevel()        当前等级对象
 *   window.Membership.upgrade(level, days) 模拟购买升级
 *   window.Membership.downgrade()        取消会员
 *   window.Membership.isActive()         是否有效期内
 *   window.Membership.daysLeft()          剩余天数
 *   window.Membership.check(feature)     权益检查
 *   window.Membership.entitlements()     完整权益表
 *   window.Membership.invite(code)       处理邀请
 *   window.Membership.generateInvite()   生成邀请码
 *   window.Membership.leaderboard()      邀请排行
 *   window.Membership.history()          升级历史
 *   window.Membership.formatPrice(¥)     格式化价格
 * ================================================================ */
(function() {
  'use strict';

  var LEVEL_KEY = 'member_level';
  var EXPIRE_KEY = 'member_expire';
  var HISTORY_KEY = 'member_history';
  var INVITE_KEY = 'member_invite_code';
  var INVITE_USED_KEY = 'member_invited_count';
  var INVITE_HISTORY_KEY = 'member_invite_history';
  var TRIAL_KEY = 'member_trial_used';

  // ============== 等级定义 ==============
  var TIERS = {
    free: {
      key: 'free',
      name: 'Free',
      nameZh: '免费版',
      price: 0,
      priceLabel: '¥0',
      color: '#888888',
      order: 0
    },
    bronze: {
      key: 'bronze',
      name: 'Bronze',
      nameZh: '铜牌',
      price: 19,
      priceLabel: '¥19/月',
      color: '#a16207',
      order: 1
    },
    silver: {
      key: 'silver',
      name: 'Silver',
      nameZh: '银牌',
      price: 49,
      priceLabel: '¥49/月',
      color: '#6b7280',
      order: 2
    },
    gold: {
      key: 'gold',
      name: 'Gold',
      nameZh: '金牌',
      price: 99,
      priceLabel: '¥99/月',
      color: '#ca8a04',
      order: 3
    },
    diamond: {
      key: 'diamond',
      name: 'Diamond',
      nameZh: '钻石',
      price: 199,
      priceLabel: '¥199/月',
      color: '#111111',
      order: 4
    }
  };

  // ============== 权益矩阵 (硬编码) ==============
  var ENTITLEMENTS = {
    free: {
      questionsPerDay: 20,
      aiChatsPerDay: 5,
      exportsPerMonth: 0,
      collabRooms: 1,
      solutionDepth: 'brief',     // brief / standard / detailed
      adFree: false,
      srsAdvanced: false,
      premiumBank: false,
      trialUnlock: false,
      prioritySupport: false
    },
    bronze: {
      questionsPerDay: 80,
      aiChatsPerDay: 20,
      exportsPerMonth: 3,
      collabRooms: 3,
      solutionDepth: 'standard',
      adFree: false,
      srsAdvanced: false,
      premiumBank: false,
      trialUnlock: true,
      prioritySupport: false
    },
    silver: {
      questionsPerDay: 200,
      aiChatsPerDay: 60,
      exportsPerMonth: 10,
      collabRooms: 8,
      solutionDepth: 'standard',
      adFree: true,
      srsAdvanced: true,
      premiumBank: true,         // 解锁 1 科
      trialUnlock: true,
      prioritySupport: false
    },
    gold: {
      questionsPerDay: 500,
      aiChatsPerDay: 200,
      exportsPerMonth: 30,
      collabRooms: 20,
      solutionDepth: 'detailed',
      adFree: true,
      srsAdvanced: true,
      premiumBank: true,         // 解锁 3 科
      trialUnlock: true,
      prioritySupport: true
    },
    diamond: {
      questionsPerDay: -1,       // 无限
      aiChatsPerDay: -1,
      exportsPerMonth: -1,
      collabRooms: -1,
      solutionDepth: 'detailed',
      adFree: true,
      srsAdvanced: true,
      premiumBank: true,         // 解锁全部 8 科
      trialUnlock: true,
      prioritySupport: true
    }
  };

  // ============== 存储辅助 ==============
  function lsGet(key, def) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return def;
      return JSON.parse(raw);
    } catch (e) { return def; }
  }

  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function getStoredLevel() {
    return lsGet(LEVEL_KEY, 'free');
  }

  function getStoredExpire() {
    return lsGet(EXPIRE_KEY, 0);
  }

  function getHistory() {
    return lsGet(HISTORY_KEY, []);
  }

  function addHistory(entry) {
    var h = getHistory();
    h.unshift(entry);
    if (h.length > 50) h = h.slice(0, 50);
    lsSet(HISTORY_KEY, h);
  }

  // ============== 预置 30 天会员试用 ==============
  function ensureTrialSeed() {
    var seeded = lsGet(TRIAL_KEY, false);
    if (seeded) return;
    var lv = getStoredLevel();
    var exp = getStoredExpire();
    var now = Date.now();
    // 仅在用户当前为 free 且无到期时间时预置
    if (lv === 'free' && (!exp || exp < now)) {
      var thirtyDays = 30 * 24 * 60 * 60 * 1000;
      lsSet(LEVEL_KEY, 'silver');
      lsSet(EXPIRE_KEY, now + thirtyDays);
      addHistory({
        ts: now,
        action: 'trial_seed',
        level: 'silver',
        days: 30,
        note: '系统预置 30 天 Silver 试用'
      });
    }
    lsSet(TRIAL_KEY, true);
  }

  // ============== 公共 API ==============
  var Membership = {
    TIERS: TIERS,
    LEVELS: ['free', 'bronze', 'silver', 'gold', 'diamond'],

    init: function() {
      ensureTrialSeed();
      return this.getLevel();
    },

    getLevel: function() {
      ensureTrialSeed();
      var key = getStoredLevel();
      var tier = TIERS[key] || TIERS.free;
      var exp = getStoredExpire();
      var now = Date.now();
      var active = (key !== 'free') && (exp > now);
      return {
        key: key,
        name: tier.name,
        nameZh: tier.nameZh,
        price: tier.price,
        priceLabel: tier.priceLabel,
        color: tier.color,
        order: tier.order,
        expireAt: exp,
        active: active,
        daysLeft: active ? Math.max(0, Math.ceil((exp - now) / (24 * 60 * 60 * 1000))) : 0
      };
    },

    isActive: function() {
      return this.getLevel().active;
    },

    daysLeft: function() {
      return this.getLevel().daysLeft;
    },

    // 模拟购买升级
    upgrade: function(levelKey, durationDays) {
      if (!TIERS[levelKey]) {
        return { ok: false, error: '未知等级: ' + levelKey };
      }
      if (levelKey === 'free') {
        return this.downgrade();
      }
      var days = parseInt(durationDays, 10) || 30;
      if (days < 1) days = 30;
      var now = Date.now();
      var currentExp = getStoredExpire();
      // 若在有效期内,基于当前到期时间累加
      var base = (currentExp > now) ? currentExp : now;
      var newExp = base + days * 24 * 60 * 60 * 1000;
      lsSet(LEVEL_KEY, levelKey);
      lsSet(EXPIRE_KEY, newExp);
      addHistory({
        ts: now,
        action: 'upgrade',
        level: levelKey,
        days: days,
        expireAt: newExp,
        note: '模拟购买 ' + TIERS[levelKey].nameZh + ' ' + days + ' 天'
      });
      return { ok: true, level: levelKey, expireAt: newExp, days: days };
    },

    // 取消会员
    downgrade: function() {
      var prev = getStoredLevel();
      lsSet(LEVEL_KEY, 'free');
      lsSet(EXPIRE_KEY, 0);
      addHistory({
        ts: Date.now(),
        action: 'downgrade',
        level: 'free',
        note: '已取消会员,降级为 Free'
      });
      return { ok: true, prev: prev };
    },

    // 检查权益: feature 名 -> boolean / 值
    check: function(feature) {
      var lv = this.getLevel().key;
      var ent = ENTITLEMENTS[lv] || ENTITLEMENTS.free;
      return ent[feature];
    },

    // 完整权益
    entitlements: function() {
      var lv = this.getLevel().key;
      return ENTITLEMENTS[lv] || ENTITLEMENTS.free;
    },

    // 全部等级权益(用于对比表)
    allEntitlements: function() {
      var out = {};
      Object.keys(ENTITLEMENTS).forEach(function(k) {
        out[k] = ENTITLEMENTS[k];
      });
      return out;
    },

    // 邀请码生成
    generateInvite: function() {
      ensureTrialSeed();
      var existing = lsGet(INVITE_KEY, '');
      if (existing) return existing;
      var code = '';
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (var i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      lsSet(INVITE_KEY, code);
      return code;
    },

    // 获取当前邀请码 (无则生成)
    getInviteCode: function() {
      ensureTrialSeed();
      return this.generateInvite();
    },

    // 模拟"被邀请人使用我的码" — 加 7 天 silver
    invite: function(code) {
      ensureTrialSeed();
      var used = lsGet(INVITE_USED_KEY, 0);
      var hist = lsGet(INVITE_HISTORY_KEY, []);
      hist.push({
        ts: Date.now(),
        code: code || 'SELF',
        reward: '7d_silver',
        status: 'success'
      });
      lsSet(INVITE_USED_KEY, used + 1);
      lsSet(INVITE_HISTORY_KEY, hist);
      // 给自己加 7 天 silver (若当前已更高级则保持)
      var lv = this.getLevel();
      if (lv.order < 2) {
        this.upgrade('silver', 7);
      } else {
        // 已 Silver 及以上,仅延长 7 天
        var now = Date.now();
        var base = (lv.expireAt > now) ? lv.expireAt : now;
        var newExp = base + 7 * 24 * 60 * 60 * 1000;
        lsSet(EXPIRE_KEY, newExp);
        addHistory({
          ts: now,
          action: 'invite_bonus',
          level: lv.key,
          days: 7,
          expireAt: newExp,
          note: '邀请奖励 +7 天'
        });
      }
      return { ok: true, reward: '7d_silver', inviteCount: used + 1 };
    },

    // 邀请排行
    leaderboard: function() {
      var hist = lsGet(INVITE_HISTORY_KEY, []);
      // 按 code 聚合
      var map = {};
      hist.forEach(function(h) {
        if (!map[h.code]) map[h.code] = { code: h.code, count: 0, lastTs: 0 };
        map[h.code].count += 1;
        if (h.ts > map[h.code].lastTs) map[h.code].lastTs = h.ts;
      });
      var arr = Object.keys(map).map(function(k) { return map[k]; });
      arr.sort(function(a, b) { return b.count - a.count; });
      return arr.slice(0, 20);
    },

    inviteCount: function() {
      return lsGet(INVITE_USED_KEY, 0);
    },

    // 升级历史
    history: function() {
      return getHistory();
    },

    // 模拟支付 (UI 调用入口, 不做实际扣款)
    pay: function(levelKey, durationDays, callback) {
      var self = this;
      var tier = TIERS[levelKey];
      if (!tier) {
        if (callback) callback({ ok: false, error: '未知等级' });
        return;
      }
      var totalPrice = tier.price * (durationDays / 30);
      // 模拟异步支付
      setTimeout(function() {
        var result = self.upgrade(levelKey, durationDays);
        if (callback) callback({
          ok: true,
          orderId: 'SIM-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
          level: levelKey,
          days: durationDays,
          amount: totalPrice,
          payMethod: 'mock-alipay',
          ts: Date.now()
        });
      }, 600);
    },

    // 续费提醒
    renewalReminder: function() {
      var lv = this.getLevel();
      if (!lv.active) return { needed: false };
      if (lv.daysLeft <= 7) {
        return { needed: true, daysLeft: lv.daysLeft, message: '会员将在 ' + lv.daysLeft + ' 天后到期,建议提前续费' };
      }
      return { needed: false, daysLeft: lv.daysLeft };
    },

    formatPrice: function(yuan) {
      if (yuan === 0) return '免费';
      if (yuan === -1) return '无限';
      return '¥' + yuan;
    },

    // 倒计时格式化 (剩余时间)
    formatCountdown: function(expireAt) {
      var diff = expireAt - Date.now();
      if (diff <= 0) return '已到期';
      var d = Math.floor(diff / (24 * 60 * 60 * 1000));
      var h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      var m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      var s = Math.floor((diff % (60 * 1000)) / 1000);
      if (d > 0) return d + ' 天 ' + h + ' 时 ' + m + ' 分';
      if (h > 0) return h + ' 时 ' + m + ' 分 ' + s + ' 秒';
      return m + ' 分 ' + s + ' 秒';
    }
  };

  // 自动初始化 (预置 30 天试用)
  if (typeof window !== 'undefined') {
    window.Membership = Membership;
    try { Membership.init(); } catch (e) {}
  }

})();
