(function() {
  'use strict';

  var SRS_KEY = 'yz_srs_data';
  var SUBJECT_KEY = 'yz_srs_subject';

  function load() {
    try {
      var raw = localStorage.getItem(SRS_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return {};
  }

  function save(data) {
    try {
      localStorage.setItem(SRS_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var SRS = {
    init: function() {
      return load();
    },

    recordWrong: function(qid) {
      var data = load();
      var now = Date.now();
      if (!data[qid]) {
        data[qid] = { ease: 2.5, interval: 0, nextReview: now, reps: 0, wrongCount: 0, correctCount: 0 };
      }
      var r = data[qid];
      r.wrongCount = (r.wrongCount || 0) + 1;
      r.reps = 0;
      r.ease = Math.max(1.0, r.ease - 0.2);
      r.interval = 1;
      r.nextReview = now;
      save(data);
      return r;
    },

    recordCorrect: function(qid) {
      var data = load();
      var now = Date.now();
      if (!data[qid]) {
        data[qid] = { ease: 2.5, interval: 0, nextReview: now, reps: 0, wrongCount: 0, correctCount: 0 };
      }
      var r = data[qid];
      r.correctCount = (r.correctCount || 0) + 1;
      r.reps = (r.reps || 0) + 1;
      if (r.reps >= 2) {
        r.ease = Math.min(3.0, r.ease + 0.1);
      }
      var dayMs = 24 * 60 * 60 * 1000;
      r.interval = Math.round(r.interval * r.ease);
      if (r.interval < 1) r.interval = 1;
      r.nextReview = now + r.interval * dayMs;
      save(data);
      return r;
    },

    getDueQuestions: function(subject) {
      var data = load();
      var now = Date.now();
      var due = [];

      if (!subject) {
        for (var qid in data) {
          if (data.hasOwnProperty(qid) && data[qid].nextReview <= now) {
            due.push({ qid: qid, info: data[qid] });
          }
        }
      } else {
        var recsKey = 'yz_practice_data';
        try {
          var raw = localStorage.getItem(recsKey);
          if (raw) {
            var pracData = JSON.parse(raw);
            var recs = pracData.records && pracData.records[subject] ? pracData.records[subject] : {};
            for (var qid in data) {
              if (data.hasOwnProperty(qid) && data[qid].nextReview <= now) {
                if (recs[qid]) {
                  due.push({ qid: qid, info: data[qid], rec: recs[qid] });
                }
              }
            }
          }
        } catch(e) {}
      }

      due.sort(function(a, b) { return a.info.nextReview - b.info.nextReview; });
      return due;
    },

    setSubject: function(subject) {
      try {
        localStorage.setItem(SUBJECT_KEY, subject);
      } catch(e) {}
    },

    getSubject: function() {
      try {
        return localStorage.getItem(SUBJECT_KEY) || '';
      } catch(e) { return ''; }
    },

    getStats: function() {
      var data = load();
      var now = Date.now();
      var total = Object.keys(data).length;
      var due = 0;
      var mastered = 0;
      var learning = 0;
      for (var qid in data) {
        if (!data.hasOwnProperty(qid)) continue;
        if (data[qid].nextReview <= now) due++;
        if ((data[qid].wrongCount || 0) === 0 && (data[qid].correctCount || 0) >= 2) mastered++;
        else learning++;
      }
      return { total: total, due: due, mastered: mastered, learning: learning };
    },

    reset: function() {
      try {
        localStorage.removeItem(SRS_KEY);
      } catch(e) {}
    }
  };

  window.SRS = SRS;

})();