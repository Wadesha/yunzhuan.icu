/**
 * SchoolCircle v1 - 学校圈（按目标学校聚合动态）
 * 提供 getFeed / post / getMembers / join / leave / match 等 API
 * 动态类型：录取分享 / 面试经验 / 课业体验 / 活动推荐
 * 用户可加入多所学校（从 AppData 读 profile.targetSchools）
 */
(function() {
  'use strict';

  var POSTS_KEY = 'yz_circle_posts';
  var MEMBERS_KEY = 'yz_circle_members';
  var SEEDED_KEY = 'yz_circle_seeded_v1';

  var SCHOOLS = [
    { name: 'Harvard', country: 'US', short: '哈佛' },
    { name: 'MIT', country: 'US', short: 'MIT' },
    { name: 'Stanford', country: 'US', short: '斯坦福' },
    { name: 'Yale', country: 'US', short: '耶鲁' },
    { name: 'Princeton', country: 'US', short: '普林斯顿' },
    { name: 'Columbia', country: 'US', short: '哥大' },
    { name: 'UPenn', country: 'US', short: '宾大' },
    { name: 'Cornell', country: 'US', short: '康奈尔' },
    { name: 'Brown', country: 'US', short: '布朗' },
    { name: 'Dartmouth', country: 'US', short: '达特茅斯' },
    { name: 'Duke', country: 'US', short: '杜克' },
    { name: 'Northwestern', country: 'US', short: '西北' },
    { name: 'UChicago', country: 'US', short: '芝大' },
    { name: 'JHU', country: 'US', short: 'JHU' },
    { name: 'Caltech', country: 'US', short: 'Caltech' },
    { name: 'CMU', country: 'US', short: 'CMU' },
    { name: 'Berkeley', country: 'US', short: '伯克利' },
    { name: 'UCLA', country: 'US', short: 'UCLA' },
    { name: 'Oxford', country: 'UK', short: '牛津' },
    { name: 'Cambridge', country: 'UK', short: '剑桥' }
  ];

  var POST_TYPES = [
    { key: 'admit', name: '录取分享', icon: '🎉' },
    { key: 'interview', name: '面试经验', icon: '🎤' },
    { key: 'academics', name: '课业体验', icon: '📚' },
    { key: 'activity', name: '活动推荐', icon: '🎯' }
  ];

  function loadJSON(key, def) {
    try { var raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch(e) {}
    return def;
  }
  function saveJSON(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {} }

  function genId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function loadPosts() { return loadJSON(POSTS_KEY, {}); }
  function savePosts(p) { saveJSON(POSTS_KEY, p); }
  function loadMembers() { return loadJSON(MEMBERS_KEY, {}); }
  function saveMembers(m) { saveJSON(MEMBERS_KEY, m); }

  function normSchool(s) { return String(s || '').trim(); }

  function seedIfNeeded() {
    if (localStorage.getItem(SEEDED_KEY) === '1') return;
    if (Object.keys(loadPosts()).length > 0) {
      localStorage.setItem(SEEDED_KEY, '1');
      return;
    }
    var now = Date.now();
    var dayMs = 86400000;
    var posts = {
      'c1': { id: 'c1', school: 'Harvard', type: 'admit', author: 'Yuki_2024', content: 'RD 录取 Harvard！感恩 4 年坚持，分享一下我的活动列表和时间线。', likes: 156, createdAt: now - 1 * dayMs, comments: 12 },
      'c2': { id: 'c2', school: 'Harvard', type: 'interview', author: 'Daniel_M', content: '上周面了 Harvard 校友面，30 分钟全英文，问题集中在 why major 和 leadership。', likes: 89, createdAt: now - 2 * dayMs, comments: 7 },
      'c3': { id: 'c3', school: 'Harvard', type: 'academics', author: 'Iris_Soph', content: 'Harvard CS 50 课程体验：每周 100+ 页阅读 + 3 个 problem set，时间管理是必修课。', likes: 234, createdAt: now - 3 * dayMs, comments: 18 },
      'c4': { id: 'c4', school: 'MIT', type: 'admit', author: 'Brian_T', content: 'MIT EA 录了！说一下我的 STEM 研究经历和 Maker Portfolio。', likes: 312, createdAt: now - 1 * dayMs, comments: 25 },
      'c5': { id: 'c5', school: 'MIT', type: 'academics', author: 'Roger_K', content: 'MIT 6.006 算法课体验：recitation 一定要去，作业占 50%。', likes: 167, createdAt: now - 4 * dayMs, comments: 9 },
      'c6': { id: 'c6', school: 'MIT', type: 'activity', author: 'Leo_W', content: 'MIT 招新 CPW 报名中，建议提前联系学长学姐获取邀请码。', likes: 78, createdAt: now - 5 * dayMs, comments: 4 },
      'c7': { id: 'c7', school: 'Stanford', type: 'admit', author: 'Sophia_L', content: 'Stanford RD 录取！申请季最大的心得是 authentic voice。', likes: 198, createdAt: now - 2 * dayMs, comments: 15 },
      'c8': { id: 'c8', school: 'Stanford', type: 'activity', author: 'Helen_C', content: '推荐 Stanford 夏校 SHARP，6 周科研体验，对申请很有帮助。', likes: 56, createdAt: now - 6 * dayMs, comments: 3 },
      'c9': { id: 'c9', school: 'Yale', type: 'interview', author: 'Mia_H', content: 'Yale 面试 25 分钟，超温暖，教授问了一本书和一段经历。', likes: 92, createdAt: now - 3 * dayMs, comments: 8 },
      'c10': { id: 'c10', school: 'Yale', type: 'academics', author: 'Tom_Z', content: 'Yale 的人文课程体验：writing-intensive 课多，essay 量很大。', likes: 67, createdAt: now - 7 * dayMs, comments: 5 },
      'c11': { id: 'c11', school: 'Princeton', type: 'admit', author: 'Kevin_Y', content: 'Princeton RD 录了！附我的学术研究和奖项清单。', likes: 145, createdAt: now - 4 * dayMs, comments: 11 },
      'c12': { id: 'c12', school: 'Columbia', type: 'admit', author: 'Cathy_N', content: 'Columbia ED 录了，附核心 supplement 写作思路。', likes: 178, createdAt: now - 5 * dayMs, comments: 14 },
      'c13': { id: 'c13', school: 'UPenn', type: 'admit', author: 'Tony_F', content: 'UPenn Wharton 录取，分享 Wharton 申请 tips。', likes: 113, createdAt: now - 6 * dayMs, comments: 9 },
      'c14': { id: 'c14', school: 'Cornell', type: 'activity', author: 'Sam_P', content: 'Cornell Engineering 项目推荐：Engage 暑期研究计划。', likes: 45, createdAt: now - 8 * dayMs, comments: 2 },
      'c15': { id: 'c15', school: 'CMU', type: 'academics', author: 'Zoe_Q', content: 'CMU SCS 课程压力很大，建议数学基础先打牢。', likes: 89, createdAt: now - 9 * dayMs, comments: 6 },
      'c16': { id: 'c16', school: 'Oxford', type: 'interview', author: 'Emma_R', content: 'Oxford PPE 面试 2 场，TSA 80 分以上比较稳。', likes: 134, createdAt: now - 3 * dayMs, comments: 10 },
      'c17': { id: 'c17', school: 'Cambridge', type: 'admit', author: 'Lily_W', content: 'Cambridge Natural Sciences 录取，附 NSAA 备考经验。', likes: 167, createdAt: now - 5 * dayMs, comments: 13 },
      'c18': { id: 'c18', school: 'Berkeley', type: 'activity', author: 'Alice_K', content: '推荐 Berkeley 的 COSMOS 暑期项目，竞争激烈但含金量高。', likes: 78, createdAt: now - 7 * dayMs, comments: 4 }
    };

    var members = {
      'Harvard': ['Yuki_2024', 'Daniel_M', 'Iris_Soph', 'Mia_H', 'Tom_Z', 'Alice_K', 'Jason_R', 'Vivian_T', 'Owen_B', 'Nina_G'],
      'MIT': ['Brian_T', 'Roger_K', 'Leo_W', 'Helen_C', 'Zoe_Q', 'Mike_C', 'Sarah_F', 'Dan_L'],
      'Stanford': ['Sophia_L', 'Helen_C', 'Carol_D', 'Ethan_P', 'Grace_S', 'Henry_W'],
      'Yale': ['Mia_H', 'Tom_Z', 'Eva_M', 'Frank_O', 'Grace_X'],
      'Princeton': ['Kevin_Y', 'Iris_Soph', 'Jack_T', 'Kim_L'],
      'Columbia': ['Cathy_N', 'Frank_O', 'Leo_W', 'Mary_P'],
      'UPenn': ['Tony_F', 'Vivian_T', 'Will_S'],
      'Cornell': ['Sam_P', 'Yuki_2024', 'Zoe_Q'],
      'CMU': ['Zoe_Q', 'Roger_K', 'Mike_C'],
      'Oxford': ['Emma_R', 'Frank_O'],
      'Cambridge': ['Lily_W', 'Carol_D'],
      'Berkeley': ['Alice_K', 'Ethan_P'],
      'UChicago': ['Ethan_P', 'Eva_M', 'Owen_B'],
      'JHU': ['Grace_S', 'Henry_W'],
      'Caltech': ['Roger_K', 'Mike_C'],
      'Duke': ['Mary_P', 'Nina_G', 'Owen_B'],
      'Northwestern': ['Will_S', 'Xavier_Z'],
      'Dartmouth': ['Yuki_2024'],
      'Brown': ['Grace_X', 'Henry_W'],
      'UCLA': ['Alice_K', 'Eva_M', 'Frank_O']
    };

    savePosts(posts);
    saveMembers(members);
    localStorage.setItem(SEEDED_KEY, '1');
  }

  var api = {
    version: 'v1',
    SCHOOLS: SCHOOLS,
    POST_TYPES: POST_TYPES,
    seed: seedIfNeeded,

    getSchools: function() { return SCHOOLS.slice(); },
    getSchool: function(name) { return SCHOOLS.find(function(s) { return s.name === name; }) || null; },
    getPostTypes: function() { return POST_TYPES.slice(); },
    getPostType: function(key) { return POST_TYPES.find(function(t) { return t.key === key; }) || null; },

    getFeed: function(schoolName, opts) {
      seedIfNeeded();
      opts = opts || {};
      var posts = loadPosts();
      var list = Object.keys(posts).map(function(k) { return posts[k]; });
      if (schoolName) list = list.filter(function(p) { return p.school === schoolName; });
      if (opts.type) list = list.filter(function(p) { return p.type === opts.type; });
      list.sort(function(a, b) { return b.createdAt - a.createdAt; });
      if (opts.limit) list = list.slice(0, opts.limit);

      var members = loadMembers();
      return {
        posts: list,
        school: schoolName ? api.getSchool(schoolName) : null,
        memberCount: schoolName ? (members[schoolName] || []).length : 0
      };
    },

    post: function(schoolName, type, content, author) {
      seedIfNeeded();
      if (!api.getSchool(schoolName)) throw new Error('Unknown school: ' + schoolName);
      if (!api.getPostType(type)) throw new Error('Unknown type: ' + type);
      if (!content) throw new Error('Content required');
      var posts = loadPosts();
      var id = genId('c');
      posts[id] = {
        id: id,
        school: schoolName,
        type: type,
        author: author || '匿名',
        content: String(content).slice(0, 2000),
        likes: 0,
        comments: 0,
        createdAt: Date.now()
      };
      savePosts(posts);
      return posts[id];
    },

    like: function(postId) {
      seedIfNeeded();
      var posts = loadPosts();
      if (!posts[postId]) return null;
      posts[postId].likes = (posts[postId].likes || 0) + 1;
      savePosts(posts);
      return posts[postId];
    },

    getMembers: function(schoolName) {
      seedIfNeeded();
      var members = loadMembers();
      return members[schoolName] || [];
    },

    /**
     * 从 AppData 读 profile.targetSchools，把用户加入这些学校
     */
    joinMySchools: function(nickname) {
      seedIfNeeded();
      if (!nickname) nickname = '我';
      var mySchools = [];
      try {
        if (window.AppData && window.AppData.getProfile) {
          mySchools = window.AppData.getProfile().targetSchools || [];
        }
      } catch (e) {}
      var members = loadMembers();
      mySchools.forEach(function(s) {
        members[s] = members[s] || [];
        if (members[s].indexOf(nickname) === -1) members[s].push(nickname);
      });
      saveMembers(members);
      return mySchools;
    },

    isMember: function(schoolName, nickname) {
      if (!nickname) return false;
      var members = loadMembers();
      return (members[schoolName] || []).indexOf(nickname) >= 0;
    },

    /**
     * 同校生匹配：返回该校成员 + 与 profile 共同信息
     */
    matchSameSchool: function(schoolName, profile) {
      seedIfNeeded();
      var members = api.getMembers(schoolName);
      var me = (profile && profile.name) ? profile.name : '我';
      return members
        .filter(function(m) { return m !== me; })
        .map(function(m) {
          return {
            name: m,
            school: schoolName,
            isMutual: false, // localStorage 模拟
            score: Math.floor(Math.random() * 30) + 70
          };
        });
    },

    /**
     * 跨学校匹配：与 profile 至少有 1 个共同 target school
     */
    matchCrossSchool: function(profile) {
      seedIfNeeded();
      var mySchools = (profile && profile.targetSchools) || [];
      var me = (profile && profile.name) ? profile.name : '我';
      var members = loadMembers();
      var result = [];
      Object.keys(members).forEach(function(school) {
        if (mySchools.indexOf(school) === -1 && mySchools.length > 0) {
          members[school].forEach(function(m) {
            if (m === me) return;
            result.push({
              name: m,
              school: school,
              isMutual: mySchools.indexOf(school) >= 0,
              score: Math.floor(Math.random() * 30) + 60
            });
          });
        }
      });
      // dedupe by name
      var seen = {};
      var deduped = [];
      result.forEach(function(r) {
        if (!seen[r.name]) { seen[r.name] = true; deduped.push(r); }
      });
      return deduped;
    },

    clearAll: function() {
      localStorage.removeItem(POSTS_KEY);
      localStorage.removeItem(MEMBERS_KEY);
      localStorage.removeItem(SEEDED_KEY);
    }
  };

  window.SchoolCircle = api;
  api.seed();
})();
