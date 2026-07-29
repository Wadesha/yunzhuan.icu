/**
 * Forum v1 - 学习论坛（localStorage 模拟）
 * 提供 post / getPosts / reply / like / getPost / view 等 API
 * 分类：考纲问答 / 错题求助 / 经验分享 / 资源推荐
 */
(function() {
  'use strict';

  var POSTS_KEY = 'yz_forum_posts';
  var REPLIES_KEY = 'yz_forum_replies';
  var LIKES_KEY = 'yz_forum_likes';
  var SEEDED_KEY = 'yz_forum_seeded_v1';

  var CATEGORIES = [
    { key: 'qa', name: '考纲问答', cn: '考纲问答', desc: '考纲要点、知识点、概念解析' },
    { key: 'wrong', name: '错题求助', cn: '错题求助', desc: '求解答错题、互帮互助' },
    { key: 'experience', name: '经验分享', cn: '经验分享', desc: '学习心得、考试经验、时间管理' },
    { key: 'resource', name: '资源推荐', cn: '资源推荐', desc: '资料、网课、工具、书籍推荐' }
  ];

  function loadJSON(key, def) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return def;
  }
  function saveJSON(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
  }

  function genId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function loadPosts() { return loadJSON(POSTS_KEY, {}); }
  function savePosts(p) { saveJSON(POSTS_KEY, p); }
  function loadReplies() { return loadJSON(REPLIES_KEY, {}); }
  function saveReplies(r) { saveJSON(REPLIES_KEY, r); }
  function loadLikes() { return loadJSON(LIKES_KEY, {}); }
  function saveLikes(l) { saveJSON(LIKES_KEY, l); }

  // ---- Mock data (only seeded once) ----
  function seedIfNeeded() {
    if (localStorage.getItem(SEEDED_KEY) === '1') return;
    if (Object.keys(loadPosts()).length > 0) {
      localStorage.setItem(SEEDED_KEY, '1');
      return;
    }
    var now = Date.now();
    var dayMs = 86400000;
    var posts = {
      'p_qa1': {
        id: 'p_qa1', category: 'qa', title: 'SAT 数学 Geometry 圆的方程必背吗？',
        content: '马上要考 SAT 了，请问圆的标准方程和一般方程考试会要求默写吗？老师说要背，但我感觉公式太多记不住。',
        author: 'Michael', views: 142, createdAt: now - 2 * dayMs, tags: ['SAT', '数学']
      },
      'p_qa2': {
        id: 'p_qa2', category: 'qa', title: 'AP Calculus BC 极值点判定技巧',
        content: '求函数极值除了用一阶导等于零，还有什么更快的判定方法？二阶导判定法的限制条件是什么？',
        author: 'Sophia', views: 88, createdAt: now - 3 * dayMs, tags: ['AP', '微积分']
      },
      'p_qa3': {
        id: 'p_qa3', category: 'qa', title: 'IB Biology HL 细胞呼吸三个阶段对比',
        content: 'Glycolysis / Krebs / ETC 三个阶段的位置、产物、ATP 产量总是记混，求一张好用的对比表。',
        author: 'Linda', views: 67, createdAt: now - 5 * dayMs, tags: ['IB', '生物']
      },
      'p_wrong1': {
        id: 'p_wrong1', category: 'wrong', title: '求解答：TOEFL 阅读推断题总错',
        content: '我每次做 inference 题都选成细节重现，求大佬分享一下怎么区分 "inferred" 和 "stated" 的关键词？',
        author: 'Alex', views: 95, createdAt: now - 1 * dayMs, tags: ['TOEFL', '阅读']
      },
      'p_wrong2': {
        id: 'p_wrong2', category: 'wrong', title: 'AMC 几何题：圆内接四边形求角度',
        content: '已知 ABCD 圆内接，对角互补，∠A=110°，求 ∠C。这题我算了半天不对，请高手点拨。',
        author: 'Kevin', views: 53, createdAt: now - 4 * dayMs, tags: ['AMC', '几何']
      },
      'p_wrong3': {
        id: 'p_wrong3', category: 'wrong', title: 'A-Level Chemistry 有机命名易错',
        content: 'IUPAC 命名酯和酰胺时主链到底选哪条？我经常选错最长碳链。',
        author: 'Emma', views: 41, createdAt: now - 6 * dayMs, tags: ['A-Level', '化学']
      },
      'p_exp1': {
        id: 'p_exp1', category: 'experience', title: '2025 Fall 我如何 3 个月 SAT 提分 150+',
        content: '从 1450 到 1600 的真实经历，重点是错题分析 + 模考节奏 + 心理调适。分享给还在冲分的同学。',
        author: 'Daniel', views: 312, createdAt: now - 7 * dayMs, tags: ['SAT', '经验']
      },
      'p_exp2': {
        id: 'p_exp2', category: 'experience', title: 'IB 选课避坑：我为什么没选 HL Physics',
        content: '亲身经历，从选课到 IA 到最终成绩，IB 选课是门学问，希望给学弟学妹提个醒。',
        author: 'Yuki', views: 178, createdAt: now - 8 * dayMs, tags: ['IB', '选课']
      },
      'p_exp3': {
        id: 'p_exp3', category: 'experience', title: 'AP 5 分经验：自学 vs 报班？',
        content: '我 5 门 AP 5 分，分享自学的资源清单和时间分配，告诉大家哪些科目适合自学。',
        author: 'Brian', views: 221, createdAt: now - 9 * dayMs, tags: ['AP', '自学']
      },
      'p_res1': {
        id: 'p_res1', category: 'resource', title: '免费 SAT 词汇资源汇总（PDF + App）',
        content: '汇总我自己用过最有效的 5 个 SAT 词汇资源，全部免费，附下载链接。',
        author: 'Helen', views: 456, createdAt: now - 10 * dayMs, tags: ['SAT', '词汇']
      },
      'p_res2': {
        id: 'p_res2', category: 'resource', title: 'AMC 历年真题 + 详解合集（2010-2024）',
        content: '收集了 15 年的 AMC 10/12 真题和详细解答，附难度分级，建议按周刷。',
        author: 'Roger', views: 389, createdAt: now - 11 * dayMs, tags: ['AMC', '真题']
      },
      'p_res3': {
        id: 'p_res3', category: 'resource', title: 'IB Internal Assessment 选题灵感库',
        content: '整理了 30 个高分 IA 选题，附研究方法提示，帮你避开雷区。',
        author: 'Cathy', views: 167, createdAt: now - 12 * dayMs, tags: ['IB', 'IA']
      },
      'p_res4': {
        id: 'p_res4', category: 'resource', title: 'YouTube 上最好的 5 个 AP 物理老师',
        content: '从基础到刷题，按难度排序，每个老师的风格和适合人群都标注了。',
        author: 'Tony', views: 134, createdAt: now - 13 * dayMs, tags: ['AP', '物理']
      }
    };
    var replies = {
      'p_qa1': [
        { id: genId('r'), postId: 'p_qa1', author: 'Leo', content: '不用默写，但 (x-a)² + (y-b)² = r² 这种形式要熟悉。', createdAt: now - 2 * dayMs + 3600000 },
        { id: genId('r'), postId: 'p_qa1', author: 'Zoe', content: '做 5 套题就记住了，公式不是背的是练会的。', createdAt: now - 2 * dayMs + 7200000 }
      ],
      'p_wrong1': [
        { id: genId('r'), postId: 'p_wrong1', author: 'Mia', content: '题目里出现 "suggest / imply / most likely" 才是推断，事实陈述选事实就行。', createdAt: now - 1 * dayMs + 3600000 }
      ],
      'p_exp1': [
        { id: genId('r'), postId: 'p_exp1', author: 'Sam', content: '感谢分享！请问模考用 Khan Academy 还是官方真题？', createdAt: now - 7 * dayMs + 3600000 }
      ],
      'p_res1': [
        { id: genId('r'), postId: 'p_res1', author: 'Iris', content: '已下载，Anki 那套真的很顶。', createdAt: now - 10 * dayMs + 3600000 }
      ]
    };
    var likes = {
      'p_exp1': { 'Alice': true, 'Bob': true, 'Carol': true },
      'p_res1': { 'Alice': true, 'Dan': true }
    };

    savePosts(posts);
    saveReplies(replies);
    saveLikes(likes);
    localStorage.setItem(SEEDED_KEY, '1');
  }

  var api = {
    version: 'v1',
    CATEGORIES: CATEGORIES,
    seed: seedIfNeeded,

    post: function(category, title, content, author) {
      seedIfNeeded();
      if (!category || !CATEGORIES.some(function(c) { return c.key === category; })) {
        throw new Error('Invalid category: ' + category);
      }
      if (!title || !content) throw new Error('Title and content are required');
      var posts = loadPosts();
      var id = genId('p');
      posts[id] = {
        id: id,
        category: category,
        title: String(title).slice(0, 200),
        content: String(content).slice(0, 5000),
        author: author || '匿名',
        views: 0,
        createdAt: Date.now(),
        tags: []
      };
      savePosts(posts);
      return posts[id];
    },

    getPosts: function(category, page) {
      seedIfNeeded();
      page = page || 1;
      var perPage = 10;
      var posts = loadPosts();
      var list = Object.keys(posts).map(function(k) { return posts[k]; });
      if (category) {
        list = list.filter(function(p) { return p.category === category; });
      }
      list.sort(function(a, b) { return b.createdAt - a.createdAt; });

      var total = list.length;
      var start = (page - 1) * perPage;
      var items = list.slice(start, start + perPage).map(function(p) {
        var replies = loadReplies()[p.id] || [];
        var likes = loadLikes()[p.id] || {};
        return {
          id: p.id,
          category: p.category,
          title: p.title,
          content: p.content,
          author: p.author,
          views: p.views,
          replyCount: replies.length,
          likeCount: Object.keys(likes).length,
          createdAt: p.createdAt
        };
      });
      return {
        items: items,
        total: total,
        page: page,
        perPage: perPage,
        totalPages: Math.max(1, Math.ceil(total / perPage))
      };
    },

    getPost: function(postId) {
      seedIfNeeded();
      var posts = loadPosts();
      var p = posts[postId];
      if (!p) return null;
      var replies = loadReplies()[postId] || [];
      var likes = loadLikes()[postId] || {};
      return {
        id: p.id,
        category: p.category,
        title: p.title,
        content: p.content,
        author: p.author,
        views: p.views,
        tags: p.tags || [],
        replyCount: replies.length,
        likeCount: Object.keys(likes).length,
        createdAt: p.createdAt
      };
    },

    reply: function(postId, content, author) {
      seedIfNeeded();
      var posts = loadPosts();
      if (!posts[postId]) throw new Error('Post not found');
      if (!content) throw new Error('Content required');
      var replies = loadReplies();
      replies[postId] = replies[postId] || [];
      var r = {
        id: genId('r'),
        postId: postId,
        author: author || '匿名',
        content: String(content).slice(0, 3000),
        createdAt: Date.now()
      };
      replies[postId].push(r);
      saveReplies(replies);
      return r;
    },

    getReplies: function(postId) {
      seedIfNeeded();
      var replies = loadReplies();
      return (replies[postId] || []).slice().sort(function(a, b) { return a.createdAt - b.createdAt; });
    },

    like: function(postId, userId) {
      seedIfNeeded();
      if (!userId) userId = 'guest_' + (localStorage.getItem('yz_forum_guest') || (function() {
        var g = 'g' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('yz_forum_guest', g);
        return g;
      })());
      var posts = loadPosts();
      if (!posts[postId]) return { liked: false, count: 0 };
      var likes = loadLikes();
      likes[postId] = likes[postId] || {};
      var liked;
      if (likes[postId][userId]) {
        delete likes[postId][userId];
        liked = false;
      } else {
        likes[postId][userId] = true;
        liked = true;
      }
      saveLikes(likes);
      return { liked: liked, count: Object.keys(likes[postId]).length };
    },

    hasLiked: function(postId, userId) {
      if (!userId) return false;
      var likes = loadLikes();
      return !!(likes[postId] && likes[postId][userId]);
    },

    view: function(postId) {
      seedIfNeeded();
      var posts = loadPosts();
      if (!posts[postId]) return;
      posts[postId].views = (posts[postId].views || 0) + 1;
      savePosts(posts);
    },

    getCategory: function(key) {
      return CATEGORIES.find(function(c) { return c.key === key; }) || null;
    },

    clearAll: function() {
      localStorage.removeItem(POSTS_KEY);
      localStorage.removeItem(REPLIES_KEY);
      localStorage.removeItem(LIKES_KEY);
      localStorage.removeItem(SEEDED_KEY);
    }
  };

  window.Forum = api;
  api.seed();
})();
