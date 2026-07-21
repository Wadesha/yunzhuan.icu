// localStorage 封装
const Storage = {
  KEY: 'prereq_user_v1',

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
  },

  resetUser() {
    localStorage.removeItem(this.KEY);
  },

  createUser() {
    return {
      coin: 0,
      level: 1,
      totalAnswered: 0,
      totalCorrect: 0,
      totalSessions: 0,
      maxStreak: 0,
      courseProgress: {}
    };
  },

  // 简化:计算等级 (每100金币升1级)
  calcLevel(coin) {
    return Math.floor(coin / 100) + 1;
  }
};
