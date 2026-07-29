(function() {
  'use strict';

  var STORAGE_KEY = 'yz_streak_data';
  var BADGE_THRESHOLDS = [
    { days: 3, name: 'Bronze', icon: '🥉', desc: '3天连续打卡' },
    { days: 7, name: 'Silver', icon: '🥈', desc: '7天连续打卡' },
    { days: 14, name: 'Gold', icon: '🥇', desc: '14天连续打卡' },
    { days: 30, name: 'Diamond', icon: '💎', desc: '30天连续打卡' },
    { days: 100, name: 'Legend', icon: '👑', desc: '100天连续打卡' }
  ];

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function yesterdayStr() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { current: 0, max: 0, lastDate: '', history: [] };
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  var Streak = {
    init: function() {
      return load();
    },

    todayCount: function(n) {
      n = n || 1;
      var data = load();
      var today = todayStr();

      if (data.lastDate === today) {
        data.current = data.current;
      } else if (data.lastDate === yesterdayStr()) {
        data.current = data.current + 1;
      } else {
        data.current = 1;
      }

      data.lastDate = today;
      if (data.current > data.max) data.max = data.current;

      var found = false;
      for (var i = 0; i < data.history.length; i++) {
        if (data.history[i].date === today) {
          data.history[i].count = (data.history[i].count || 0) + n;
          found = true;
          break;
        }
      }
      if (!found) {
        data.history.push({ date: today, count: n });
      }

      if (data.history.length > 365) {
        data.history = data.history.slice(-365);
      }

      save(data);
      return data;
    },

    getBadges: function() {
      var data = load();
      var earned = [];
      for (var i = 0; i < BADGE_THRESHOLDS.length; i++) {
        if (data.max >= BADGE_THRESHOLDS[i].days) {
          earned.push({
            name: BADGE_THRESHOLDS[i].name,
            icon: BADGE_THRESHOLDS[i].icon,
            desc: BADGE_THRESHOLDS[i].desc
          });
        }
      }
      return earned;
    },

    getData: function() {
      return load();
    },

    setGoal: function(n) {
      var data = load();
      data.goal = n;
      save(data);
      return data;
    },

    getGoal: function() {
      var data = load();
      return data.goal || 20;
    }
  };

  window.Streak = Streak;

})();