/**
 * app.js
 * 小程序全局入口。封装：
 *   - fetch → wx.request
 *   - localStorage → wx.getStorageSync / wx.setStorageSync
 *   - 暴露 App() 全局对象
 */
const { Storage, Api } = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    locale: 'zh-CN',
    version: 'v56.0.0',
    apiBase: 'https://yunzhuan.icu'
  },

  onLaunch() {
    // 读取本地存储的用户信息
    try {
      const user = Storage.get('yz_user');
      if (user) this.globalData.userInfo = user;
    } catch (e) { /* noop */ }

    // 读取语言
    try {
      const loc = Storage.get('yz_locale');
      if (loc) this.globalData.locale = loc;
    } catch (e) { /* noop */ }

    // 系统信息
    try {
      const sys = wx.getSystemInfoSync();
      this.globalData.systemInfo = sys;
    } catch (e) { /* noop */ }

    console.log('[yunzhuan] v56 launched, locale=' + this.globalData.locale);
  },

  onShow() {
    // 回到前台
  },

  onError(err) {
    console.error('[yunzhuan] onError:', err);
  }
});
