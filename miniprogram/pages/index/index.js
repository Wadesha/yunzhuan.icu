// pages/index/index.js
const { listSubjects } = require('../../utils/syllabus-data.js');
const { getAllStats } = require('../../utils/practice-engine.js');
const { Storage } = require('../../utils/api.js');

Page({
  data: {
    subjects: [],
    stats: [],
    locale: 'zh-CN',
    version: 'v56'
  },

  onLoad() {
    const subs = listSubjects().map(s => ({
      code: s.code,
      name: s.name,
      desc: s.desc
    }));
    this.setData({
      subjects: subs,
      stats: getAllStats(),
      locale: Storage.get('yz_locale') || 'zh-CN'
    });
  },

  onShow() {
    this.setData({ stats: getAllStats() });
  },

  onPullDownRefresh() {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  goPractice(e) {
    const code = e.currentTarget.dataset.code || 'sat';
    wx.navigateTo({ url: '/pages/practice/practice?subject=' + code });
  },

  goDashboard() {
    wx.switchTab({ url: '/pages/dashboard/dashboard' });
  },

  switchLocale() {
    const list = ['zh-CN', 'en-US', 'ja-JP'];
    const idx = list.indexOf(this.data.locale);
    const next = list[(idx + 1) % list.length];
    Storage.set('yz_locale', next);
    this.setData({ locale: next });
    wx.showToast({ title: next, icon: 'none', duration: 800 });
  }
});
