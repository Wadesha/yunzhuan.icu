// 用户档案管理模块
// 支持 localStorage 和未来后端 API
// 预留上云接口：只需替换 API_BASE_URL 和实现 fetch* 函数

// ===== 安全兜底（防止脚本执行失败时页面完全挂掉）=====
window.CloudSlot = window.CloudSlot || {
  isLoggedIn: () => false,
  getToken: () => null,
  create: () => ({ success: false, error: '模块加载中' }),
  login: () => ({ success: false, error: '模块加载中' }),
  logout: () => {},
  kvGet: () => ({ success: false, error: '模块加载中' }),
  kvSet: () => ({ success: false, error: '模块加载中' }),
  kvDel: () => ({ success: false, error: '模块加载中' })
};

window.UserStorage = window.UserStorage || {
  getUser: () => ({ userId: 'guest', coin: 0, level: 1, totalAnswered: 0, totalCorrect: 0, courseProgress: {}, badges: [], tasks: {} }),
  saveUser: () => {},
  resetUser: () => {},
  calcLevel: (coin) => Math.floor(coin / 100) + 1,
  syncToCloud: () => {},
  syncFromCloud: () => null,
  saveQuestionAnswer: () => {}
};

// ===== 版本信息（部署追溯用）=====
const BUILD_INFO = {
  version: 'v20260722-81',
  commit: 'ff3831b',
  commitFull: 'ff3831b4df32b0822ea070338b1c7e775d9c6f70',
  branch: 'main',
  buildTime: '2026-07-22T02:28:02Z'supabase-js"]')) {
    window.supabaseLoadStatus = '等待页面已有脚本加载';
    const checkInterval = setInterval(() => {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        clearInterval(checkInterval);
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        supabaseReady = true;
        window.supabaseLoadStatus = '已初始化(页面已有脚本)';
        supabaseReadyCallbacks.forEach(cb => cb());
        supabaseReadyCallbacks.length = 0;
      }
    }, 100);
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!supabaseReady) {
        window.supabaseLoadStatus = '超时:页面脚本未加载完成，尝试UMD';
        loadUMDVersion();
      }
    }, 15000);
    return;
  }
  loadUMDVersion();

  function loadUMDVersion() {
    window.supabaseLoadStatus = '加载UMD版本中';
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        supabaseReady = true;
        window.supabaseLoadStatus = '已初始化(UMD)';
        supabaseReadyCallbacks.forEach(cb => cb());
        supabaseReadyCallbacks.length = 0;
      } else {
        window.supabaseLoadStatus = 'UMD加载后无window.supabase';
        console.warn('[Supabase] UMD版本加载后未找到window.supabase');
      }
    };
    script.onerror = function() {
      window.supabaseLoadStatus = 'UMD加载失败';
      console.error('[Supabase] UMD脚本加载失败');
    };
    document.head.appendChild(script);
  }
}

if (SUPABASE_URL && SUPABASE_ANON_KEY && typeof document !== 'undefined') {
  try {
    initSupabase();
  } catch (e) {
    console.warn('[Supabase] 初始化失败:', e.message);
    window.supabaseLoadStatus = '初始化失败: ' + e.message;
  }
}

// ===== 云端占坑 API（CloudSlot）=====
// 对应 PostgreSQL SECURITY DEFINER 存储过程

function waitForSupabase() {
  return new Promise((resolve) => {
    if (supabaseReady && supabase) {
      resolve(true);
    } else {
      onSupabaseReady(() => resolve(true));
      setTimeout(() => resolve(false), 10000);
    }
  });
}

const CloudSlot = {
  // 注册占坑：手机号 + 可选 PIN
  async create(phone, pin) {
    const ready = await waitForSupabase();
    if (!ready || !supabase) return { success: false, error: 'Cloud not configured' };
    
    try {
      const { data, error } = await supabase.rpc('create_slot', {
        p_phone: phone,
        p_pin: pin || null
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      const result = data[0];
      if (result.conflict) {
        return { success: false, conflict: true };
      }
      
      // 保存凭证到 localStorage
      localStorage.setItem('slot_token', JSON.stringify({
        slot_id: result.slot_id,
        slot_secret: result.slot_secret,
        phone: phone
      }));
      
      return { success: true, slot_id: result.slot_id, slot_secret: result.slot_secret };
      
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // 登录：手机号 + 可选 PIN
  async login(phone, pin) {
    const ready = await waitForSupabase();
    if (!ready || !supabase) return { success: false, error: 'Cloud not configured' };
    
    try {
      const { data, error } = await supabase.rpc('login_slot', {
        p_phone: phone,
        p_pin: pin || null
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      const result = data[0];
      if (result.not_found) {
        return { success: false, not_found: true };
      }
      if (result.bad_pin) {
        return { success: false, bad_pin: true };
      }
      
      localStorage.setItem('slot_token', JSON.stringify({
        slot_id: result.slot_id,
        slot_secret: result.slot_secret,
        phone: phone
      }));
      
      return { success: true, slot_id: result.slot_id, slot_secret: result.slot_secret };
      
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // 获取当前登录凭证
  getToken() {
    try {
      return JSON.parse(localStorage.getItem('slot_token'));
    } catch (e) {
      return null;
    }
  },

  // 判断是否已登录
  isLoggedIn() {
    return !!this.getToken();
  },

  // 登出：清除本地凭证
  logout() {
    localStorage.removeItem('slot_token');
  },

  // KV 写入
  async kvSet(key, value) {
    const token = this.getToken();
    const ready = await waitForSupabase();
    if (!token || !ready || !supabase) return { success: false };
    
    try {
      const { error } = await supabase.rpc('kv_slot_set', {
        p_slot_id: token.slot_id,
        p_slot_secret: token.slot_secret,
        p_key: key,
        p_value: value
      });
      
      return { success: !error, error: error ? error.message : null };
      
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // KV 读取
  async kvGet() {
    const token = this.getToken();
    const ready = await waitForSupabase();
    if (!token || !ready || !supabase) return { success: false, data: null };
    
    try {
      const { data, error } = await supabase.rpc('kv_slot_get', {
        p_slot_id: token.slot_id,
        p_slot_secret: token.slot_secret
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      const result = {};
      data.forEach(item => {
        result[item.key] = item.value;
      });
      
      return { success: true, data: result };
      
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // KV 删除
  async kvDel(key) {
    const token = this.getToken();
    const ready = await waitForSupabase();
    if (!token || !ready || !supabase) return { success: false };
    
    try {
      const { error } = await supabase.rpc('kv_slot_del', {
        p_slot_id: token.slot_id,
        p_slot_secret: token.slot_secret,
        p_key: key
      });
      
      return { success: !error, error: error ? error.message : null };
      
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

const UserStorage = {
  KEY: 'prereq_user_v1',

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
    // 预留：同步到云端（占坑模式）
    if (CloudSlot.isLoggedIn()) {
      this.syncToCloud(user);
    }
  },

  resetUser() {
    localStorage.removeItem(this.KEY);
    CloudSlot.logout();
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

  // ===== 云端同步（占坑模式）=====

  async syncToCloud(user) {
    // 通过 CloudSlot.kvSet 同步 user_data
    await CloudSlot.kvSet('user_data', user);
  },

  async syncFromCloud() {
    // 从云端拉取 user_data
    const result = await CloudSlot.kvGet();
    if (result.success && result.data && result.data.user_data) {
      localStorage.setItem(this.KEY, JSON.stringify(result.data.user_data));
      return result.data.user_data;
    }
    return null;
  },

  async getLeaderboard() {
    return [];
  },

  async saveQuestionAnswer(courseId, questionId, isCorrect) {
    // 预留：答题记录上报到云端
    if (CloudSlot.isLoggedIn()) {
      const user = this.getUser();
      await CloudSlot.kvSet('user_data', user);
    }
  }
};

// 兼容旧代码
const Storage = UserStorage;
window.UserStorage = UserStorage;
window.Storage = UserStorage;

// ===== 全局金币展示组件 =====
// 在页面顶部显示金币和等级

function getRootPrefix() {
  var path = location.pathname;
  var parts = path.split('/').filter(function(p) { return p !== ''; });
  var depth = 0;
  var foundPrereq = false;
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === 'prerequisite') {
      foundPrereq = true;
      continue;
    }
    if (foundPrereq) depth++;
  }
  var prefix = '';
  for (var j = 0; j < depth - 1; j++) {
    prefix += '../';
  }
  return prefix;
}

const CoinDisplay = {
  init() {
    const user = Storage.getUser();
    this.render(user);
  },

  render(user) {
    var prefix = getRootPrefix();
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
      <a href="${prefix}profile.html" class="profile-link">查看档案</a>
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

// 标记 user.js 已加载完成
window.userJsLoaded = true;
window.userJsVersion = BUILD_INFO.version;
window.userJsCommit = BUILD_INFO.commit;
