// 用户档案管理模块
// 支持 localStorage 和未来后端 API
// 预留上云接口：只需替换 API_BASE_URL 和实现 fetch* 函数

const Storage = {
  KEY: 'prereq_user_v1',
  API_BASE_URL: '', // 预留：上线后改为后端地址，如 'https://api.yunzhuan.icu/v1'

  // ===== 本地存储 API =====
  
  getUser() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return this.createUser();
  },

  saveUser(user) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(user));
    } catch (e) {}
    // 预留：同步到后端
    if (this.API_BASE_URL) {
      this.syncToCloud(user);
    }
  },

  resetUser() {
    localStorage.removeItem(this.KEY);
    if (this.API_BASE_URL) {
      this.logout();
    }
  },

  createUser() {
    return {
      userId: this.generateId(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      coin: 0,
      level: 1,
      totalAnswered: 0,
      totalCorrect: 0,
      totalSessions: 0,
      maxStreak: 0,
      courseProgress: {},
      badges: [],
      tasks: {}
    };
  },

  calcLevel(coin) {
    return Math.floor(coin / 100) + 1;
  },

  generateId() {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // ===== 预留：后端云同步 API =====

  async syncToCloud(user) {
    // 预留：上线后实现
    /*
    try {
      await fetch(`${this.API_BASE_URL}/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (e) {
      console.warn('Cloud sync failed:', e);
    }
    */
  },

  async login(userId) {
    // 预留：登录后从云端同步数据
    /*
    try {
      const resp = await fetch(`${this.API_BASE_URL}/user/${userId}`);
      const data = await resp.json();
      if (data.user) {
        localStorage.setItem(this.KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (e) {
      console.warn('Cloud login failed:', e);
    }
    */
    return this.getUser();
  },

  async logout() {
    // 预留：清除云端会话
  },

  async getLeaderboard() {
    // 预留：排行榜
    /*
    try {
      const resp = await fetch(`${this.API_BASE_URL}/leaderboard`);
      return await resp.json();
    } catch (e) {
      return [];
    }
    */
    return [];
  },

  async saveQuestionAnswer(courseId, questionId, isCorrect) {
    // 预留：答题记录上报
  }
};

// ===== 全局金币展示组件 =====
// 在页面顶部显示金币和等级

const CoinDisplay = {
  init() {
    const user = Storage.getUser();
    this.render(user);
  },

  render(user) {
    const html = `
    <div class="coin-bar" id="coin-bar">
      <div class="coin-item">
        <span class="coin-icon">●</span>
        <span class="coin-value">${user.coin}</span>
      </div>
      <div class="level-item">
        <span class="level-label">等级</span>
        <span class="level-value">${user.level}</span>
      </div>
      <a href="profile.html" class="profile-link">查看档案</a>
    </div>`;
    
    // 在页面 body 开头插入
    const body = document.querySelector('body');
    if (body && !document.getElementById('coin-bar')) {
      body.insertAdjacentHTML('afterbegin', html);
    }
  },

  update() {
    const user = Storage.getUser();
    const coinVal = document.querySelector('.coin-value');
    const levelVal = document.querySelector('.level-value');
    if (coinVal) coinVal.textContent = user.coin;
    if (levelVal) levelVal.textContent = user.level;
  }
};

// 页面加载后自动初始化
document.addEventListener('DOMContentLoaded', () => {
  CoinDisplay.init();
});
