// pages/dashboard/dashboard.js
const { getAllStats, loadData } = require('../../utils/practice-engine.js');
const { Storage } = require('../../utils/api.js');

Page({
  data: {
    stats: [],
    grandTotal: 0,
    grandCorrect: 0,
    grandAccuracy: 0,
    streak: 0,
    recentWrong: []
  },

  onLoad() {
    this.refresh();
  },

  onShow() {
    this.refresh();
  },

  onPullDownRefresh() {
    this.refresh();
    wx.stopPullDownRefresh();
  },

  refresh() {
    const stats = getAllStats();
    let total = 0, correct = 0;
    for (let i = 0; i < stats.length; i++) {
      total += stats[i].total;
      correct += stats[i].correct;
    }
    const accuracy = total ? +(correct * 100 / total).toFixed(1) : 0;
    const streak = Storage.get('yz_streak') || 0;
    const recentWrong = this._collectRecentWrong(5);
    this.setData({
      stats: stats,
      grandTotal: total,
      grandCorrect: correct,
      grandAccuracy: accuracy,
      streak: streak,
      recentWrong: recentWrong
    });
  },

  _collectRecentWrong(limit) {
    const data = loadData();
    const records = data.records || {};
    const all = [];
    const subjects = Object.keys(records);
    for (let i = 0; i < subjects.length; i++) {
      const recs = records[subjects[i]];
      const ids = Object.keys(recs);
      for (let j = 0; j < ids.length; j++) {
        const r = recs[ids[j]];
        if (!r.correct) {
          all.push({
            subject: subjects[i],
            qid: ids[j],
            topic: r.topic,
            ts: r.ts
          });
        }
      }
    }
    all.sort(function (a, b) { return b.ts - a.ts; });
    return all.slice(0, limit);
  },

  goPractice() {
    wx.switchTab({ url: '/pages/practice/practice' });
  },

  clearAll() {
    wx.showModal({
      title: '提示',
      content: '清空所有答题记录？',
      success: (res) => {
        if (res.confirm) {
          Storage.set('yz_practice_data', { records: {} });
          this.refresh();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});
