/**
 * Buddy v1 - 带鱼导 / 结伴备战（localStorage 模拟）
 * 提供 find / addFriend / getFriends / createPrepRoom / joinPrepRoom / getFeed 等 API
 * 匹配规则：年级相同 + 共同目标学校 + 考试日期相近
 * 备战室 = collab room 的子集
 */
(function() {
  'use strict';

  var USERS_KEY = 'yz_buddy_users';
  var FRIENDS_KEY = 'yz_buddy_friends';
  var PREP_KEY = 'yz_buddy_prep_rooms';
  var SEEDED_KEY = 'yz_buddy_seeded_v1';

  // Standard exam dates
  var EXAM_DATES = {
    'SAT_2025_10': '2025-10-04',
    'SAT_2025_11': '2025-11-01',
    'SAT_2025_12': '2025-12-06',
    'SAT_2026_03': '2026-03-14',
    'SAT_2026_05': '2026-05-02',
    'SAT_2026_06': '2026-06-06',
    'ACT_2025_09': '2025-09-13',
    'ACT_2025_10': '2025-10-25',
    'ACT_2025_12': '2025-12-13',
    'ACT_2026_02': '2026-02-14',
    'ACT_2026_04': '2026-04-11',
    'ACT_2026_06': '2026-06-13',
    'AP_2026_05': '2026-05-04',
    'IB_2026_05': '2026-05-01',
    'TOEFL_2025_10': '2025-10-18',
    'IELTS_2025_10': '2025-10-25'
  };

  function loadJSON(key, def) {
    try { var raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch(e) {}
    return def;
  }
  function saveJSON(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {} }

  function genId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function genRoomCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  function daysBetween(dateA, dateB) {
    if (!dateA || !dateB) return 9999;
    var a = new Date(dateA).getTime();
    var b = new Date(dateB).getTime();
    return Math.abs(a - b) / 86400000;
  }

  function loadUsers() { return loadJSON(USERS_KEY, {}); }
  function saveUsers(u) { saveJSON(USERS_KEY, u); }
  function loadFriends() { return loadJSON(FRIENDS_KEY, {}); }
  function saveFriends(f) { saveJSON(FRIENDS_KEY, f); }
  function loadPrep() { return loadJSON(PREP_KEY, {}); }
  function savePrep(p) { saveJSON(PREP_KEY, p); }

  function seedIfNeeded() {
    if (localStorage.getItem(SEEDED_KEY) === '1') return;
    if (Object.keys(loadUsers()).length > 0) {
      localStorage.setItem(SEEDED_KEY, '1');
      return;
    }
    var now = Date.now();
    var dayMs = 86400000;
    var users = {
      'u1': { name: 'Alice_2026', grade: 11, targetSchools: ['Harvard', 'MIT', 'Stanford'], examDate: 'SAT_2025_12', subjects: ['SAT', 'AP'], bio: '目标 MIT CS，求 SAT 战友', ts: now - 1 * dayMs },
      'u2': { name: 'Bob_Coder', grade: 11, targetSchools: ['MIT', 'Caltech', 'Stanford'], examDate: 'SAT_2025_12', subjects: ['SAT', 'AMC'], bio: 'AMC 12 备战，目标 MIT', ts: now - 2 * dayMs },
      'u3': { name: 'Carol_Med', grade: 11, targetSchools: ['Harvard', 'JHU', 'Yale'], examDate: 'SAT_2025_10', subjects: ['SAT', 'AP Bio'], bio: 'Pre-med，求生物/化学学伴', ts: now - 3 * dayMs },
      'u4': { name: 'Daniel_Eco', grade: 12, targetSchools: ['UPenn', 'Columbia', 'NYU'], examDate: 'SAT_2025_11', subjects: ['SAT', 'AP Eco'], bio: '申请季最后冲刺，UPenn 是梦校', ts: now - 4 * dayMs },
      'u5': { name: 'Emma_Art', grade: 11, targetSchools: ['RISD', 'Yale', 'Brown'], examDate: 'SAT_2026_03', subjects: ['SAT', 'Portfolio'], bio: '作品集进行中，求艺术搭子', ts: now - 5 * dayMs },
      'u6': { name: 'Frank_IB', grade: 12, targetSchools: ['Oxford', 'Cambridge', 'Imperial'], examDate: 'IB_2026_05', subjects: ['IB', 'IELTS'], bio: 'IB 党，目标 Oxford PPE', ts: now - 6 * dayMs },
      'u7': { name: 'Grace_UK', grade: 11, targetSchools: ['Cambridge', 'LSE', 'UCL'], examDate: 'IELTS_2025_10', subjects: ['IELTS', 'A-Level'], bio: 'A-Level 求 UK 方向战友', ts: now - 7 * dayMs },
      'u8': { name: 'Henry_Eng', grade: 11, targetSchools: ['Stanford', 'MIT', 'Berkeley'], examDate: 'SAT_2025_12', subjects: ['SAT', 'AP Physics'], bio: '工程方向，求物理/数学搭子', ts: now - 8 * dayMs },
      'u9': { name: 'Iris_Lit', grade: 11, targetSchools: ['Yale', 'Princeton', 'Brown'], examDate: 'SAT_2025_12', subjects: ['SAT', 'AP Lit'], bio: '人文学科方向，求阅读搭子', ts: now - 9 * dayMs },
      'u10': { name: 'Jason_AI', grade: 12, targetSchools: ['CMU', 'MIT', 'Stanford'], examDate: 'SAT_2025_11', subjects: ['SAT', 'AP CS', 'USACO'], bio: 'AI/ML 方向，求 USACO 战友', ts: now - 10 * dayMs },
      'u11': { name: 'Karen_Biz', grade: 11, targetSchools: ['UPenn', 'NYU', 'Michigan'], examDate: 'SAT_2026_03', subjects: ['SAT', 'AP Eco'], bio: '商科方向，求商赛搭子', ts: now - 11 * dayMs },
      'u12': { name: 'Leo_Math', grade: 11, targetSchools: ['MIT', 'Princeton', 'Caltech'], examDate: 'SAT_2026_05', subjects: ['SAT', 'AMC', 'AIME'], bio: '数竞党，求 AMC 战友', ts: now - 12 * dayMs },
      'u13': { name: 'Mia_China', grade: 11, targetSchools: ['Harvard', 'Yale', 'Stanford'], examDate: 'TOEFL_2025_10', subjects: ['TOEFL', 'SAT'], bio: '国内体系，求 TOEFL 战友', ts: now - 13 * dayMs },
      'u14': { name: 'Nick_Bball', grade: 12, targetSchools: ['Duke', 'UVA', 'UNC'], examDate: 'SAT_2025_11', subjects: ['SAT'], bio: '体育方向，求文书搭子', ts: now - 14 * dayMs },
      'u15': { name: 'Olivia_Eng', grade: 11, targetSchools: ['Stanford', 'MIT', 'Caltech'], examDate: 'SAT_2025_12', subjects: ['SAT', 'AP Eng'], bio: '女工程师，求理工战友', ts: now - 15 * dayMs }
    };

    var friends = {
      'Alice_2026': ['Bob_Coder', 'Henry_Eng'],
      'Bob_Coder': ['Alice_2026', 'Leo_Math'],
      'Carol_Med': ['Daniel_Eco']
    };

    var prep = {
      'PR3K9X': { name: 'SAT 12 月冲刺小队', code: 'PR3K9X', createdBy: 'Alice_2026', members: ['Alice_2026', 'Bob_Coder', 'Henry_Eng'], schools: ['MIT', 'Stanford'], examDate: 'SAT_2025_12', createdAt: now - 1 * dayMs },
      'PR8M2Q': { name: 'AMC 12 数论专练', code: 'PR8M2Q', createdBy: 'Leo_Math', members: ['Leo_Math', 'Bob_Coder'], schools: ['MIT'], examDate: 'SAT_2025_12', createdAt: now - 3 * dayMs },
      'PR5N7L': { name: 'IB 5 月大考备战', code: 'PR5N7L', createdBy: 'Frank_IB', members: ['Frank_IB', 'Grace_UK'], schools: ['Oxford', 'Cambridge'], examDate: 'IB_2026_05', createdAt: now - 2 * dayMs }
    };

    saveUsers(users);
    saveFriends(friends);
    savePrep(prep);
    localStorage.setItem(SEEDED_KEY, '1');
  }

  function computeMatchScore(me, other) {
    if (!me || !other) return 0;
    var score = 0;
    // 年级相同 +30
    if (me.grade === other.grade) score += 30;
    // 每个共同目标学校 +15
    var meSchools = me.targetSchools || [];
    var otherSchools = other.targetSchools || [];
    var commonSchools = meSchools.filter(function(s) { return otherSchools.indexOf(s) >= 0; });
    score += commonSchools.length * 15;
    // 考试日期相近 +25
    var myDate = EXAM_DATES[me.examDate];
    var theirDate = EXAM_DATES[other.examDate];
    var diff = daysBetween(myDate, theirDate);
    if (diff <= 7) score += 25;
    else if (diff <= 30) score += 20;
    else if (diff <= 60) score += 12;
    else if (diff <= 90) score += 5;
    // 共同科目 +5
    var meSub = me.subjects || [];
    var otherSub = other.subjects || [];
    var commonSub = meSub.filter(function(s) { return otherSub.indexOf(s) >= 0; });
    score += commonSub.length * 5;
    return Math.min(100, score);
  }

  function getMyProfile() {
    if (window.AppData && window.AppData.getProfile) {
      try {
        var p = window.AppData.getProfile();
        return {
          name: p.name || '我',
          grade: p.grade || 11,
          targetSchools: p.targetSchools || ['Harvard', 'MIT'],
          examDate: 'SAT_2025_12',
          subjects: ['SAT', 'AP'],
          bio: ''
        };
      } catch (e) {}
    }
    return { name: '我', grade: 11, targetSchools: ['Harvard', 'MIT', 'Stanford'], examDate: 'SAT_2025_12', subjects: ['SAT'], bio: '' };
  }

  var api = {
    version: 'v1',
    EXAM_DATES: EXAM_DATES,
    seed: seedIfNeeded,

    /**
     * 匹配：年级相同 + 共同目标学校 + 考试日期相近
     */
    find: function(criteria) {
      seedIfNeeded();
      var me = getMyProfile();
      if (criteria) {
        if (criteria.grade) me.grade = criteria.grade;
        if (criteria.targetSchools) me.targetSchools = criteria.targetSchools;
        if (criteria.examDate) me.examDate = criteria.examDate;
        if (criteria.name) me.name = criteria.name;
      }
      var users = loadUsers();
      var list = Object.keys(users).map(function(k) {
        var u = users[k];
        u.score = computeMatchScore(me, u);
        return u;
      }).filter(function(u) { return u.name !== me.name; });
      list.sort(function(a, b) { return b.score - a.score; });
      return {
        me: me,
        matches: list
      };
    },

    getUser: function(name) {
      seedIfNeeded();
      var users = loadUsers();
      return users[name] || null;
    },

    registerUser: function(profile) {
      seedIfNeeded();
      if (!profile || !profile.name) throw new Error('Name required');
      var users = loadUsers();
      users[profile.name] = {
        name: profile.name,
        grade: profile.grade || 11,
        targetSchools: profile.targetSchools || [],
        examDate: profile.examDate || 'SAT_2025_12',
        subjects: profile.subjects || [],
        bio: profile.bio || '',
        ts: Date.now()
      };
      saveUsers(users);
      return users[profile.name];
    },

    addFriend: function(myName, friendName) {
      seedIfNeeded();
      if (!myName) myName = getMyProfile().name;
      if (!friendName) throw new Error('Friend name required');
      var friends = loadFriends();
      friends[myName] = friends[myName] || [];
      if (friends[myName].indexOf(friendName) === -1) {
        friends[myName].push(friendName);
        // 双向
        friends[friendName] = friends[friendName] || [];
        if (friends[friendName].indexOf(myName) === -1) {
          friends[friendName].push(myName);
        }
      }
      saveFriends(friends);
      return friends[myName];
    },

    removeFriend: function(myName, friendName) {
      seedIfNeeded();
      if (!myName) myName = getMyProfile().name;
      var friends = loadFriends();
      friends[myName] = (friends[myName] || []).filter(function(n) { return n !== friendName; });
      friends[friendName] = (friends[friendName] || []).filter(function(n) { return n !== myName; });
      saveFriends(friends);
      return friends[myName];
    },

    getFriends: function(myName) {
      seedIfNeeded();
      if (!myName) myName = getMyProfile().name;
      var friends = loadFriends();
      var list = (friends[myName] || []).slice();
      var users = loadUsers();
      return list.map(function(n) { return users[n] || { name: n }; });
    },

    isFriend: function(myName, friendName) {
      if (!myName) myName = getMyProfile().name;
      var friends = loadFriends();
      return (friends[myName] || []).indexOf(friendName) >= 0;
    },

    /**
     * 备战室（子集 collab.js 房间）= 通过 Collab.createRoom 复用
     */
    createPrepRoom: function(name, schools, examDate, by) {
      seedIfNeeded();
      if (!window.Collab) throw new Error('Collab not loaded');
      if (!by) by = getMyProfile().name;
      var r = window.Collab.createRoom(name || (examDate + ' 备战室'), by);
      // 标记为备战室
      var prep = loadPrep();
      prep[r.code] = {
        name: r.name,
        code: r.code,
        createdBy: by,
        members: [by],
        schools: schools || [],
        examDate: examDate || '',
        createdAt: Date.now()
      };
      savePrep(prep);
      return prep[r.code];
    },

    joinPrepRoom: function(code) {
      seedIfNeeded();
      if (!window.Collab) throw new Error('Collab not loaded');
      var me = getMyProfile().name;
      var room = window.Collab.joinRoom(code, me);
      if (!room) throw new Error('Room not found');
      var prep = loadPrep();
      if (prep[code]) {
        if (prep[code].members.indexOf(me) === -1) prep[code].members.push(me);
        savePrep(prep);
      }
      return prep[code] || null;
    },

    leavePrepRoom: function(code) {
      seedIfNeeded();
      if (!window.Collab) return false;
      var me = getMyProfile().name;
      window.Collab.leaveRoom(code, me);
      var prep = loadPrep();
      if (prep[code]) {
        prep[code].members = (prep[code].members || []).filter(function(m) { return m !== me; });
        savePrep(prep);
      }
      return true;
    },

    getPrepRooms: function(myName) {
      seedIfNeeded();
      if (!myName) myName = getMyProfile().name;
      var prep = loadPrep();
      var list = [];
      Object.keys(prep).forEach(function(code) {
        var p = prep[code];
        if ((p.members || []).indexOf(myName) >= 0) {
          list.push(p);
        }
      });
      return list;
    },

    getAllPrepRooms: function() {
      seedIfNeeded();
      var prep = loadPrep();
      return Object.keys(prep).map(function(k) { return prep[k]; });
    },

    /**
     * 战友动态 = 同校 + 同目标（拉取 SchoolCircle 的动态）
     */
    getBuddyFeed: function(myProfile) {
      seedIfNeeded();
      if (!myProfile) myProfile = getMyProfile();
      var me = myProfile;
      var friends = api.getFriends(me.name);
      var mySchools = me.targetSchools || [];

      // 简化：从 SchoolCircle 拉取相关动态
      var feed = [];
      if (window.SchoolCircle) {
        mySchools.forEach(function(s) {
          var data = window.SchoolCircle.getFeed(s, { limit: 5 });
          if (data && data.posts) {
            data.posts.forEach(function(p) {
              feed.push({
                school: s,
                author: p.author,
                type: p.type,
                content: p.content,
                createdAt: p.createdAt
              });
            });
          }
        });
        // 按时间排序
        feed.sort(function(a, b) { return b.createdAt - a.createdAt; });
      }

      return {
        friends: friends,
        feed: feed.slice(0, 15)
      };
    },

    computeMatchScore: computeMatchScore,
    getMyProfile: getMyProfile,

    clearAll: function() {
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem(FRIENDS_KEY);
      localStorage.removeItem(PREP_KEY);
      localStorage.removeItem(SEEDED_KEY);
    }
  };

  window.Buddy = api;
  api.seed();
})();
