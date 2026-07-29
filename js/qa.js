/**
 * QA v1 - 知识问答 / 错题求助（localStorage 模拟）
 * 提供 ask / answer / accept / search / byTag / bySubject / fromWrongQuestion 等 API
 * 标签系统：tag 索引 + 按 tag 检索
 * 与 v34 错题联动：错题详情可一键"求解答" → 自动带题内容发布到 QA
 */
(function() {
  'use strict';

  var QUESTIONS_KEY = 'yz_qa_questions';
  var ANSWERS_KEY = 'yz_qa_answers';
  var POINTS_KEY = 'yz_qa_points';
  var SEEDED_KEY = 'yz_qa_seeded_v1';

  var SUBJECTS = [
    { key: 'sat', name: 'SAT' },
    { key: 'act', name: 'ACT' },
    { key: 'ap', name: 'AP' },
    { key: 'ib', name: 'IB' },
    { key: 'alevel', name: 'A-Level' },
    { key: 'toefl', name: 'TOEFL' },
    { key: 'ielts', name: 'IELTS' },
    { key: 'igcse', name: 'IGCSE' },
    { key: 'amc', name: 'AMC' },
    { key: 'other', name: '其他' }
  ];

  function loadJSON(key, def) {
    try { var raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch(e) {}
    return def;
  }
  function saveJSON(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
  }
  function genId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function loadQuestions() { return loadJSON(QUESTIONS_KEY, {}); }
  function saveQuestions(q) { saveJSON(QUESTIONS_KEY, q); }
  function loadAnswers() { return loadJSON(ANSWERS_KEY, {}); }
  function saveAnswers(a) { saveJSON(ANSWERS_KEY, a); }
  function loadPoints() { return loadJSON(POINTS_KEY, {}); }
  function savePoints(p) { saveJSON(POINTS_KEY, p); }

  function normTag(t) {
    return String(t || '').trim().replace(/^#/, '').toLowerCase();
  }

  function seedIfNeeded() {
    if (localStorage.getItem(SEEDED_KEY) === '1') return;
    if (Object.keys(loadQuestions()).length > 0) {
      localStorage.setItem(SEEDED_KEY, '1');
      return;
    }
    var now = Date.now();
    var dayMs = 86400000;
    var questions = {
      'q1': {
        id: 'q1', question: 'SAT 数学 Geometry 中，圆与直线相切的条件是？',
        tags: ['sat', '数学', '几何'], subject: 'sat', author: '小明',
        views: 234, createdAt: now - 1 * dayMs, acceptedAnswerId: 'a1', fromWrong: false
      },
      'q2': {
        id: 'q2', question: 'AP Chemistry 平衡常数 Kp 和 Kc 怎么换算？',
        tags: ['ap', '化学', '平衡'], subject: 'ap', author: 'Lily',
        views: 156, createdAt: now - 2 * dayMs, acceptedAnswerId: null, fromWrong: true
      },
      'q3': {
        id: 'q3', question: 'IB Economics Micro 边际成本和平均成本的关系？',
        tags: ['ib', '经济', '微经济学'], subject: 'ib', author: 'Tom',
        views: 98, createdAt: now - 3 * dayMs, acceptedAnswerId: 'a3', fromWrong: false
      },
      'q4': {
        id: 'q4', question: 'TOEFL 阅读 inference 题怎么做？',
        tags: ['toefl', '阅读', 'inference'], subject: 'toefl', author: 'Alex',
        views: 312, createdAt: now - 4 * dayMs, acceptedAnswerId: 'a4', fromWrong: true
      },
      'q5': {
        id: 'q5', question: 'A-Level Further Maths 矩阵的特征值怎么求？',
        tags: ['alevel', '数学', '矩阵'], subject: 'alevel', author: 'Sophie',
        views: 78, createdAt: now - 5 * dayMs, acceptedAnswerId: null, fromWrong: false
      },
      'q6': {
        id: 'q6', question: 'AMC 10 数论题：求 1+2+...+100 模 7 的余数？',
        tags: ['amc', '数论', '求和'], subject: 'amc', author: 'Kevin',
        views: 145, createdAt: now - 6 * dayMs, acceptedAnswerId: 'a6', fromWrong: false
      },
      'q7': {
        id: 'q7', question: 'IB Biology HL 蛋白质结构四级结构层次？',
        tags: ['ib', '生物', '蛋白质'], subject: 'ib', author: 'Yuki',
        views: 67, createdAt: now - 7 * dayMs, acceptedAnswerId: null, fromWrong: false
      },
      'q8': {
        id: 'q8', question: 'ACT 英语语法中 misplaced modifier 怎么识别？',
        tags: ['act', '语法', '修饰语'], subject: 'act', author: 'Iris',
        views: 92, createdAt: now - 8 * dayMs, acceptedAnswerId: null, fromWrong: true
      },
      'q9': {
        id: 'q9', question: 'AP Physics C 电磁感应：楞次定律怎么用？',
        tags: ['ap', '物理', '电磁'], subject: 'ap', author: 'Brian',
        views: 110, createdAt: now - 9 * dayMs, acceptedAnswerId: 'a9', fromWrong: false
      },
      'q10': {
        id: 'q10', question: 'IGCSE Chemistry 离子键和共价键区别？',
        tags: ['igcse', '化学', '化学键'], subject: 'igcse', author: 'Cathy',
        views: 88, createdAt: now - 10 * dayMs, acceptedAnswerId: null, fromWrong: false
      },
      'q11': {
        id: 'q11', question: 'IELTS 写作 Task 2 双边讨论结构怎么搭？',
        tags: ['ielts', '写作', '结构'], subject: 'ielts', author: 'Tony',
        views: 201, createdAt: now - 11 * dayMs, acceptedAnswerId: 'a11', fromWrong: false
      },
      'q12': {
        id: 'q12', question: 'A-Level Physics 简谐运动的周期公式推导？',
        tags: ['alevel', '物理', '简谐运动'], subject: 'alevel', author: 'Helen',
        views: 54, createdAt: now - 12 * dayMs, acceptedAnswerId: null, fromWrong: false
      }
    };
    var answers = {
      'q1': [
        { id: 'a1', qid: 'q1', author: 'Leo', content: '圆心到直线距离 = 半径。点到直线距离公式 |Ax0+By0+C|/√(A²+B²) = r。', upvotes: 12, createdAt: now - 1 * dayMs + 3600000 }
      ],
      'q2': [
        { id: 'a2', qid: 'q2', author: 'Zoe', content: 'Kp = Kc(RT)^Δn，Δn = 气体产物系数和 - 气体反应物系数和。', upvotes: 8, createdAt: now - 2 * dayMs + 3600000 }
      ],
      'q3': [
        { id: 'a3', qid: 'q3', author: 'Sam', content: '当 MC < AC 时 AC 下降，MC = AC 时 AC 极小，MC > AC 时 AC 上升。', upvotes: 15, createdAt: now - 3 * dayMs + 3600000 }
      ],
      'q4': [
        { id: 'a4', qid: 'q4', author: 'Mia', content: '关键词：suggest/imply/most likely → 推断；according to the passage → 事实。', upvotes: 23, createdAt: now - 4 * dayMs + 3600000 }
      ],
      'q5': [],
      'q6': [
        { id: 'a6', qid: 'q6', author: 'Roger', content: '等差数列求和公式 n(n+1)/2 = 5050，5050 mod 7 = ?  7*721=5047，余 3。', upvotes: 18, createdAt: now - 6 * dayMs + 3600000 }
      ],
      'q7': [],
      'q8': [],
      'q9': [
        { id: 'a9', qid: 'q9', author: 'Roger', content: '感应电流方向总是阻碍引起它的磁通量变化。判断步骤：①看原磁通方向 ②看变化 ③用右手定则。', upvotes: 14, createdAt: now - 9 * dayMs + 3600000 }
      ],
      'q10': [],
      'q11': [
        { id: 'a11', qid: 'q11', author: 'Sophia', content: '结构：引言表态 → 双方观点 + 论据 → 我方观点 + 理由 → 结论。', upvotes: 19, createdAt: now - 11 * dayMs + 3600000 }
      ],
      'q12': []
    };
    var points = {
      'Leo': 12, 'Zoe': 8, 'Sam': 15, 'Mia': 23, 'Roger': 32, 'Sophia': 19
    };
    saveQuestions(questions);
    saveAnswers(answers);
    savePoints(points);
    localStorage.setItem(SEEDED_KEY, '1');
  }

  function getAnswersCount(qid) {
    return (loadAnswers()[qid] || []).length;
  }

  var api = {
    version: 'v1',
    SUBJECTS: SUBJECTS,
    seed: seedIfNeeded,

    ask: function(question, tags, subject, author, opts) {
      seedIfNeeded();
      if (!question) throw new Error('Question required');
      tags = (tags || []).map(normTag).filter(Boolean);
      subject = subject || 'other';
      if (!SUBJECTS.some(function(s) { return s.key === subject; })) subject = 'other';
      opts = opts || {};
      var questions = loadQuestions();
      var id = genId('q');
      questions[id] = {
        id: id,
        question: String(question).slice(0, 1000),
        tags: tags,
        subject: subject,
        author: author || '匿名',
        views: 0,
        createdAt: Date.now(),
        acceptedAnswerId: null,
        fromWrong: !!opts.fromWrong,
        wrongQid: opts.wrongQid || null
      };
      saveQuestions(questions);
      return questions[id];
    },

    answer: function(qid, content, author) {
      seedIfNeeded();
      var qs = loadQuestions();
      if (!qs[qid]) throw new Error('Question not found');
      if (!content) throw new Error('Content required');
      var answers = loadAnswers();
      answers[qid] = answers[qid] || [];
      var a = {
        id: genId('a'),
        qid: qid,
        author: author || '匿名',
        content: String(content).slice(0, 5000),
        upvotes: 0,
        createdAt: Date.now()
      };
      answers[qid].push(a);
      saveAnswers(answers);

      // 回答 +5 积分
      var pts = loadPoints();
      var who = author || '匿名';
      pts[who] = (pts[who] || 0) + 5;
      savePoints(pts);

      return a;
    },

    accept: function(qid, answerId, by) {
      seedIfNeeded();
      var qs = loadQuestions();
      if (!qs[qid]) throw new Error('Question not found');
      var answers = loadAnswers();
      var list = answers[qid] || [];
      var ans = list.find(function(a) { return a.id === answerId; });
      if (!ans) throw new Error('Answer not found');
      qs[qid].acceptedAnswerId = answerId;
      saveQuestions(qs);

      // 采纳：答主 +20 积分，提问者 +2
      var pts = loadPoints();
      pts[ans.author] = (pts[ans.author] || 0) + 20;
      if (by) pts[by] = (pts[by] || 0) + 2;
      savePoints(pts);

      return qs[qid];
    },

    upvote: function(qid, answerId) {
      seedIfNeeded();
      var answers = loadAnswers();
      var list = answers[qid] || [];
      var ans = list.find(function(a) { return a.id === answerId; });
      if (!ans) return null;
      ans.upvotes = (ans.upvotes || 0) + 1;
      saveAnswers(answers);
      // upvote: +1 积分
      var pts = loadPoints();
      pts[ans.author] = (pts[ans.author] || 0) + 1;
      savePoints(pts);
      return ans;
    },

    getQuestions: function(filter) {
      seedIfNeeded();
      filter = filter || {};
      var qs = loadQuestions();
      var ans = loadAnswers();
      var list = Object.keys(qs).map(function(k) {
        var q = qs[k];
        var ansList = ans[q.id] || [];
        return {
          id: q.id,
          question: q.question,
          tags: q.tags || [],
          subject: q.subject,
          author: q.author,
          views: q.views,
          answerCount: ansList.length,
          acceptedAnswerId: q.acceptedAnswerId,
          createdAt: q.createdAt,
          fromWrong: q.fromWrong
        };
      });

      if (filter.subject) list = list.filter(function(q) { return q.subject === filter.subject; });
      if (filter.tag) {
        var t = normTag(filter.tag);
        list = list.filter(function(q) { return (q.tags || []).indexOf(t) >= 0; });
      }
      if (filter.search) {
        var s = String(filter.search).toLowerCase();
        list = list.filter(function(q) {
          return q.question.toLowerCase().indexOf(s) >= 0
            || (q.tags || []).some(function(t) { return t.indexOf(s) >= 0; });
        });
      }
      if (filter.solved === true) list = list.filter(function(q) { return !!q.acceptedAnswerId; });
      if (filter.solved === false) list = list.filter(function(q) { return !q.acceptedAnswerId; });
      if (filter.fromWrong) list = list.filter(function(q) { return q.fromWrong; });

      list.sort(function(a, b) { return b.createdAt - a.createdAt; });

      if (filter.page) {
        var per = filter.perPage || 10;
        var start = (filter.page - 1) * per;
        return {
          items: list.slice(start, start + per),
          total: list.length,
          page: filter.page,
          perPage: per,
          totalPages: Math.max(1, Math.ceil(list.length / per))
        };
      }
      return list;
    },

    getQuestion: function(qid) {
      seedIfNeeded();
      var qs = loadQuestions();
      var q = qs[qid];
      if (!q) return null;
      q.answers = (loadAnswers()[qid] || []).slice().sort(function(a, b) {
        if (a.id === q.acceptedAnswerId) return -1;
        if (b.id === q.acceptedAnswerId) return 1;
        return b.upvotes - a.upvotes;
      });
      return q;
    },

    view: function(qid) {
      seedIfNeeded();
      var qs = loadQuestions();
      if (!qs[qid]) return;
      qs[qid].views = (qs[qid].views || 0) + 1;
      saveQuestions(qs);
    },

    getAllTags: function() {
      seedIfNeeded();
      var qs = loadQuestions();
      var tagCount = {};
      Object.keys(qs).forEach(function(k) {
        (qs[k].tags || []).forEach(function(t) {
          var nt = normTag(t);
          if (nt) tagCount[nt] = (tagCount[nt] || 0) + 1;
        });
      });
      var arr = Object.keys(tagCount).map(function(t) { return { tag: t, count: tagCount[t] }; });
      arr.sort(function(a, b) { return b.count - a.count; });
      return arr;
    },

    getPoints: function(user) {
      var pts = loadPoints();
      return user ? (pts[user] || 0) : pts;
    },

    getAcceptRate: function(user) {
      var qs = loadQuestions();
      var ans = loadAnswers();
      var asked = 0, accepted = 0;
      var answered = 0, ansAccepted = 0;
      Object.keys(qs).forEach(function(k) {
        var q = qs[k];
        if (q.author === user) {
          asked++;
          if (q.acceptedAnswerId) accepted++;
        }
      });
      Object.keys(ans).forEach(function(qid) {
        ans[qid].forEach(function(a) {
          if (a.author === user) {
            answered++;
            if (qs[qid] && qs[qid].acceptedAnswerId === a.id) ansAccepted++;
          }
        });
      });
      return {
        user: user,
        asked: asked,
        accepted: accepted,
        askAcceptRate: asked > 0 ? Math.round(accepted / asked * 100) : 0,
        answered: answered,
        ansAccepted: ansAccepted,
        ansAcceptRate: answered > 0 ? Math.round(ansAccepted / answered * 100) : 0
      };
    },

    /**
     * 与 v34 错题联动：从错题内容生成 QA 问题草稿
     * 调用者传入 { qid, question, subject, tags }
     */
    fromWrongQuestion: function(wrongData) {
      var opts = { fromWrong: true, wrongQid: wrongData.qid || null };
      return api.ask(
        '[错题求助] ' + wrongData.question,
        wrongData.tags || ['错题'],
        wrongData.subject || 'other',
        wrongData.author || '我',
        opts
      );
    },

    getSubject: function(key) {
      return SUBJECTS.find(function(s) { return s.key === key; }) || SUBJECTS[SUBJECTS.length - 1];
    },

    clearAll: function() {
      localStorage.removeItem(QUESTIONS_KEY);
      localStorage.removeItem(ANSWERS_KEY);
      localStorage.removeItem(POINTS_KEY);
      localStorage.removeItem(SEEDED_KEY);
    }
  };

  window.QA = api;
  api.seed();
})();
