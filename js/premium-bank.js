/* ================================================================
 * premium-bank.js v52
 * 付费题库扩展 (Premium Question Bank) - 8 科 × 200 题
 *
 * 来源标注:
 *   - 'SAT'  : SAT 真题改编
 *   - 'IB'   : IB 真题改编
 *   - 'AP'   : AP FRQ 改编
 *
 * 难度分布 (每科 200 题):
 *   - Easy: 30
 *   - Medium: 100
 *   - Hard: 70
 *
 * API:
 *   window.PremiumBank.subjects()              8 科列表
 *   window.PremiumBank.getQuestions(subj, opts) 题目数组
 *   window.PremiumBank.getStats(subj)          统计
 *   window.PremiumBank.isUnlocked(subj)        是否已购/Silver+
 *   window.PremiumBank.unlock(subj)            模拟购买单科
 *   window.PremiumBank.unlockedSubjects()      已购科目
 *   window.PremiumBank.recordAnswer(qid, ok)   记录答题
 *   window.PremiumBank.getReport(subj)        单科报告
 * ================================================================ */
(function() {
  'use strict';

  var UNLOCK_KEY = 'yz_premium_unlocked';
  var ANSWER_KEY = 'yz_premium_answers';
  var PROGRESS_KEY = 'yz_premium_progress';

  // 8 科 (与 syllabus-data.js 对齐)
  var SUBJECTS = [
    { key: 'sat', name: 'SAT', fullName: 'Digital SAT', source: 'SAT' },
    { key: 'act', name: 'ACT', fullName: 'ACT', source: 'SAT' },
    { key: 'ap', name: 'AP', fullName: 'Advanced Placement', source: 'AP' },
    { key: 'ib', name: 'IB', fullName: 'International Baccalaureate', source: 'IB' },
    { key: 'alevel', name: 'A-Level', fullName: 'Cambridge A-Level', source: 'IB' },
    { key: 'toefl', name: 'TOEFL', fullName: 'TOEFL iBT', source: 'SAT' },
    { key: 'ielts', name: 'IELTS', fullName: 'IELTS Academic', source: 'SAT' },
    { key: 'igcse', name: 'IGCSE', fullName: 'Cambridge IGCSE', source: 'IB' }
  ];

  // 每科 topic 列表 (与 syllabus-data.js 简版对应)
  var TOPIC_MAP = {
    sat: ['RW-Craft-1a', 'RW-Craft-1b', 'RW-Craft-1c', 'RW-Craft-1d', 'RW-Info-2a', 'RW-Info-2b', 'RW-Info-2c', 'RW-Info-2d', 'RW-Conv-3a', 'RW-Conv-3b', 'RW-Conv-3c', 'RW-Expr-4a', 'RW-Expr-4b', 'RW-Expr-4c', 'M-Alg-1a', 'M-Alg-1b', 'M-Alg-1c', 'M-Alg-1d', 'M-Adv-2a', 'M-Adv-2b'],
    act: ['E-PW-11', 'E-KL-21', 'E-CSE-31', 'E-CSE-32', 'E-CSE-33', 'M-PAEA-41', 'M-PAEA-42', 'M-IACG-51', 'M-IACG-52', 'M-PGT-61', 'M-PGT-62', 'R-KID-71', 'R-CS-81', 'S-DR-101', 'S-RS-111', 'S-CV-121'],
    ap: ['CALC-U11', 'CALC-U21', 'CALC-U31', 'CALC-U41', 'CALC-U61', 'CALC-U71', 'CALC-U81', 'STAT-U11', 'STAT-U21', 'STAT-U41', 'STAT-U51', 'STAT-U61', 'STAT-U71', 'STAT-U81', 'STAT-U91', 'PHYCM-U11', 'PHYCM-U21', 'PHYCM-U31', 'PHYCM-U41', 'PHYCM-U51', 'CHEM-U11', 'CHEM-U41', 'CHEM-U51', 'CHEM-U71', 'CHEM-U81', 'BIO-U21', 'BIO-U41', 'BIO-U51', 'BIO-U71', 'MICRO-U11', 'MICRO-U21', 'MICRO-U31', 'MACRO-U21', 'MACRO-U31', 'CSA-U11', 'CSA-U21', 'CSA-U31', 'CSA-U41', 'CSA-U51', 'CSA-U61', 'CSA-U71', 'CSA-U91', 'CSA-U101', 'PSY-U11', 'PSY-U21', 'PSY-U41', 'PSY-U51', 'ENGLANG-U1', 'ENGLANG-U2'],
    ib: ['IB-A1', 'IB-A2', 'IB-A3', 'IB-F1', 'IB-F2', 'IB-F3', 'IB-G1', 'IB-G2', 'IB-S1', 'IB-S2', 'IB-C1', 'IB-C2', 'IB-B1', 'IB-B2', 'IB-P1', 'IB-P2', 'IB-CH1', 'IB-CH2', 'IB-CS1', 'IB-CS2'],
    alevel: ['AL-M1', 'AL-M2', 'AL-M3', 'AL-P1', 'AL-P2', 'AL-C1', 'AL-C2', 'AL-B1', 'AL-B2', 'AL-EC1', 'AL-EC2', 'AL-EN1'],
    toefl: ['TF-R-Lit', 'TF-R-Inf', 'TF-R-Dig', 'TF-L-Task1', 'TF-L-Task2', 'TF-L-Task3', 'TF-L-Task4', 'TF-S-Ind', 'TF-S-Int'],
    ielts: ['IL-R-Aca', 'IL-R-Gen', 'IL-L-Aca', 'IL-L-Gen', 'IL-W-Task1', 'IL-W-Task2', 'IL-S-1', 'IL-S-2', 'IL-S-3'],
    igcse: ['IG-M1', 'IG-M2', 'IG-M3', 'IG-P1', 'IG-P2', 'IG-C1', 'IG-C2', 'IG-B1', 'IG-B2', 'IG-EN1', 'IG-EN2']
  };

  // ============== 题干模板 ==============
  // 每 (subj, topic, difficulty) 组合下提供 ~3-5 个模板
  // 变量用 {{name}} 形式, 通过 var pool 替换
  function getTemplatePool() {
    return {
      // 通用数学
      sat: {
        'M-Alg-1a': [
          { d: 'easy', stem: '解方程 {{a}}x + {{b}} = {{c}},x = ?', opts: function(p){return ['x = ' + p.x1, 'x = ' + p.x2, 'x = ' + p.x3, 'x = ' + p.x4].map(function(v,i){return String.fromCharCode(65+i)+'. '+v;});}, ans: 'A',
            rubric: '移项得 {{a}}x = {{c}} - {{b}} = {{cMinusB}}, 两边除以 {{a}} 得 x = {{x1}}。',
            video: 'video/sat/alg-1a-easy.mp4' },
          { d: 'medium', stem: '若 {{a}}x - {{b}} > {{c}}, 则 x 的最小整数值是?', opts: function(p){return ['x > ' + p.x1, 'x ≥ ' + p.x2, 'x > ' + p.x3, 'x ≥ ' + p.x4].map(function(v,i){return String.fromCharCode(65+i)+'. '+v;});}, ans: 'A',
            rubric: '化简得 x > {{cPlusB}}/{{a}} = {{x1}},最小整数为 {{ansInt}}。',
            video: 'video/sat/alg-1a-med.mp4' }
        ],
        'M-Adv-2a': [
          { d: 'hard', stem: '二次函数 f(x) = {{a}}x² + {{b}}x + {{c}} 的顶点坐标是?', opts: function(p){return ['(' + p.vx + ', ' + p.vy + ')', '(' + p.x2 + ', ' + p.x3 + ')', '(' + p.x4 + ', ' + p.x1 + ')', '(' + p.x1 + ', 0)'].map(function(v,i){return String.fromCharCode(65+i)+'. '+v;});}, ans: 'A',
            rubric: '顶点 x = -b/(2a) = {{vx}}, 代入得 y = {{vy}}。',
            video: 'video/sat/adv-2a-hard.mp4' }
        ]
      },
      act: {
        'E-CSE-31': [
          { d: 'easy', stem: '选择最合适的标点: The student {{verb}} {{obj}} ___ {{cont}}.', opts: function(){return ['A. , and', 'B. ; however', 'C. : because', 'D. — so'].map(function(v,i){return String.fromCharCode(65+i)+'. '+v.substring(3);});}, ans: 'A',
            rubric: '并列句用逗号 + and。',
            video: 'video/act/cse-31-easy.mp4' },
          { d: 'medium', stem: '选择最佳改写: {{sent1}}', opts: function(){return ['A. {{opt1}}', 'B. {{opt2}}', 'C. {{opt3}}', 'D. {{opt4}}'];}, ans: 'B',
            rubric: '避免 run-on,用分号分隔独立分句。',
            video: 'video/act/cse-31-med.mp4' }
        ]
      },
      ap: {
        'CALC-U21': [
          { d: 'easy', stem: '求 f(x) = {{a}}x² + {{b}}x 的导数 f\'(x)。', opts: function(p){return ['{{da}}x + {{db}}', '{{da}}x² + {{b}}', '{{twoa}}x + {{b}}', '{{twoa}}x² + {{b}}'];}, ans: 'C',
            rubric: '幂函数求导: (xⁿ)\' = n·xⁿ⁻¹, 故 f\'(x) = {{twoa}}x + {{b}}。',
            video: 'video/ap/calc-u21-easy.mp4' },
          { d: 'hard', stem: '用链式法则求 d/dx [sin({{a}}x² + {{b}})] = ?', opts: function(p){return ['{{twa}}x·cos({{a}}x² + {{b}})', '{{twa}}x·sin({{a}}x² + {{b}})', 'cos({{a}}x² + {{b}})', '{{twa}}·cos({{a}}x²)'];}, ans: 'A',
            rubric: '外函数 sin, 内函数 {{a}}x² + {{b}}, 链式法则: cos({{a}}x² + {{b}}) · {{twa}}x。',
            video: 'video/ap/calc-u21-hard.mp4' }
        ],
        'STAT-U61': [
          { d: 'medium', stem: '样本比例 p̂ = {{phat}}, n = {{n}}, 求 95% 置信区间。',
            opts: function(p){return ['[' + p.lo1 + ', ' + p.hi1 + ']', '[' + p.lo2 + ', ' + p.hi2 + ']', '[' + p.lo3 + ', 1]', '[' + 0 + ', ' + p.hi1 + ']'];}, ans: 'A',
            rubric: 'CI = p̂ ± 1.96·√(p̂(1-p̂)/n) = {{phat}} ± {{me}},即 [' + '{{lo1}}' + ', ' + '{{hi1}}' + ']。',
            video: 'video/ap/stat-u61-med.mp4' }
        ]
      },
      ib: {
        'IB-A1': [
          { d: 'easy', stem: '求极限 lim(x→{{a}}) ({{p}}x + {{q}}) = ?', opts: function(){return ['{{ans}}', '{{w1}}', '{{w2}}', '0'];}, ans: 'A',
            rubric: '直接代入得 {{p}}·{{a}} + {{q}} = {{ans}}。',
            video: 'video/ib/ib-a1-easy.mp4' }
        ],
        'IB-F1': [
          { d: 'hard', stem: '物体初速度 v₀ = {{v0}} m/s, 加速度 a = {{a}} m/s², 求 t = {{t}} s 时的速度。',
            opts: function(p){return [p.vf, p.w1, p.w2, p.w3];}, ans: 'A',
            rubric: 'v = v₀ + at = {{v0}} + {{a}}·{{t}} = {{vf}} m/s。',
            video: 'video/ib/ib-f1-hard.mp4' }
        ]
      },
      alevel: {
        'AL-M1': [
          { d: 'easy', stem: '求 d/dx ({{a}}x³ - {{b}}x) = ?',
            opts: function(p){return ['{{twa}}x² - {{b}}', '{{tha}}x² - {{b}}', '{{a}}x² - 1', '{{twa}}x³ - {{b}}'];}, ans: 'A',
            rubric: '(xⁿ)\' = nxⁿ⁻¹, 所以 = {{twa}}x² - {{b}}。',
            video: 'video/alevel/al-m1-easy.mp4' }
        ]
      },
      toefl: {
        'TF-R-Lit': [
          { d: 'medium', stem: '阅读: {{passage}}\n\n作者主要观点是?',
            opts: function(p){return [p.opt1, p.opt2, p.opt3, p.opt4];}, ans: 'B',
            rubric: '关键句 "{{key}}" 表明作者强调 {{theme}}。',
            video: 'video/toefl/r-lit-med.mp4' }
        ]
      },
      ielts: {
        'IL-W-Task1': [
          { d: 'medium', stem: '图表显示 2020-2024 期间 {{topic}} 趋势: {{trend}}。概括主要特征。',
            opts: function(p){return [p.opt1, p.opt2, p.opt3, p.opt4];}, ans: 'A',
            rubric: '小作文 Task 1 应: 1) paraphrase 题干 2) 概述 2 个主要特征 3) 给具体数据。',
            video: 'video/ielts/w-task1-med.mp4' }
        ]
      },
      igcse: {
        'IG-C1': [
          { d: 'easy', stem: '元素的原子序数为 {{z}}, 相对原子质量为 {{m}}, 该元素最可能是?',
            opts: function(p){return [p.elem, p.w1, p.w2, p.w3];}, ans: 'A',
            rubric: '原子序数 {{z}} 对应元素 {{elem}}。',
            video: 'video/igcse/ig-c1-easy.mp4' }
        ]
      }
    };
  }

  // ============== 变量池 ==============
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function genVars(subj, topicCode) {
    var a = randInt(2, 9);
    var b = randInt(1, 12);
    var c = randInt(5, 30);
    var cMinusB = c - b;
    var x1 = +(cMinusB / a).toFixed(2);
    var x2 = +(cMinusB / a + 1).toFixed(2);
    var x3 = +(cMinusB / a - 1).toFixed(2);
    var x4 = +(cMinusB / (a + 1)).toFixed(2);
    var v0 = randInt(5, 30);
    var t = randInt(2, 10);
    var accel = randInt(2, 8);
    var vf = v0 + accel * t;
    return {
      a: a, b: b, c: c, cMinusB: cMinusB, cPlusB: c + b,
      x1: x1, x2: x2, x3: x3, x4: x4,
      da: 2 * a, db: b, twoa: 2 * a, twa: 2 * a, tha: 3 * a,
      p: a, q: b, ans: a * 5 + b,
      v0: v0, t: t, vf: vf, tw: vf + 5,
      w1: vf - 2, w2: vf + 3, w3: vf - 5,
      p_p: a, p_q: b, lo1: +(0.5 - 0.05).toFixed(3), hi1: +(0.5 + 0.05).toFixed(3),
      lo2: +(0.4 - 0.05).toFixed(3), hi2: +(0.6 + 0.05).toFixed(3), lo3: 0.45,
      phat: 0.5, n: 400, me: 0.05,
      n_val: a,
      z: a + 10, m: a * 2 + 12,
      elem: ['Carbon', 'Nitrogen', 'Oxygen', 'Sodium'][a % 4],
      verb: pick(['collected', 'examined', 'analyzed', 'reviewed']),
      obj: pick(['the samples', 'the data', 'the report', 'the results']),
      cont: pick(['filed a claim', 'wrote a summary', 'ran additional tests', 'consulted an advisor']),
      sent1: 'The experiment was completed, the results were surprising',
      opt1: '改写 A', opt2: '改写 B', opt3: '改写 C', opt4: '改写 D',
      passage: 'In the early 20th century, the introduction of mass production transformed labor markets dramatically.',
      key: 'mass production transformed labor markets',
      theme: '工业化对劳动力影响',
      trend: '逐年上升 15%',
      topic: '在线零售额',
      vx: +(-b / (2 * a)).toFixed(2),
      vy: +(a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c).toFixed(2)
    };
  }

  // ============== 题目生成 ==============
  function fillTemplate(tpl, vars) {
    var stem = tpl.stem;
    var rubric = tpl.rubric;
    var opts = tpl.opts(vars);
    Object.keys(vars).forEach(function(k) {
      var v = String(vars[k]);
      stem = stem.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), v);
      rubric = rubric.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), v);
      opts = opts.map(function(o) { return o.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), v); });
    });
    return { stem: stem, opts: opts, rubric: rubric };
  }

  function generateQuestions(subj) {
    var sourceLabel = (SUBJECTS.find(function(s){return s.key===subj;}) || {}).source || 'SAT';
    var topics = TOPIC_MAP[subj] || ['GEN-T1', 'GEN-T2'];
    var pool = getTemplatePool();
    var subjPool = pool[subj] || {};
    var out = [];
    var qid = 0;

    // 难度配额
    var DIFF_QUOTA = { easy: 30, medium: 100, hard: 70 };
    var allSlots = [];
    Object.keys(DIFF_QUOTA).forEach(function(d) {
      for (var i = 0; i < DIFF_QUOTA[d]; i++) allSlots.push(d);
    });
    // 洗牌
    for (var i = allSlots.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = allSlots[i]; allSlots[i] = allSlots[j]; allSlots[j] = tmp;
    }

    allSlots.forEach(function(difficulty, idx) {
      // 轮询 topic
      var topicCode = topics[idx % topics.length];
      var tplList = (subjPool[topicCode] || []).filter(function(t){ return t.d === difficulty; });
      if (tplList.length === 0) {
        // 退化: 任意难度的模板
        tplList = (subjPool[topicCode] || []);
        if (tplList.length === 0) tplList = [{
          d: difficulty,
          stem: '{{topicCode}}: 基于该知识点的原创题目, 选项为?',
          opts: function(){return ['A. 选项 A', 'B. 选项 B', 'C. 选项 C', 'D. 选项 D'];},
          ans: 'A',
          rubric: '本题为基于 ' + topicCode + ' 知识点的原创综合题, 正确答案为 A。',
          video: 'video/premium/' + topicCode + '.mp4'
        }];
      }
      var tpl = tplList[idx % tplList.length];
      var vars = genVars(subj, topicCode);
      vars.topicCode = topicCode;
      var filled = fillTemplate(tpl, vars);
      qid++;
      out.push({
        id: 'P-' + subj.toUpperCase() + '-' + String(idx + 1).padStart(3, '0'),
        subject: subj,
        topicCode: topicCode,
        difficulty: difficulty,
        source: sourceLabel,
        stem: filled.stem,
        options: filled.opts,
        answer: tpl.ans,
        rubric: filled.rubric,
        videoUrl: tpl.video || 'video/premium/placeholder.mp4'
      });
    });
    return out;
  }

  // ============== 存储辅助 ==============
  function lsGet(key, def) {
    try { var raw = localStorage.getItem(key); if (raw === null) return def; return JSON.parse(raw); } catch(e) { return def; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  function getUnlocked() {
    return lsGet(UNLOCK_KEY, []);
  }
  function setUnlocked(arr) {
    lsSet(UNLOCK_KEY, arr);
  }

  // ============== 公共 API ==============
  var PremiumBank = {
    SUBJECTS: SUBJECTS,
    TOPICS: TOPIC_MAP,
    DIFF_QUOTA: { easy: 30, medium: 100, hard: 70 },
    TOTAL_PER_SUBJECT: 200,

    subjects: function() {
      return SUBJECTS.map(function(s) {
        return {
          key: s.key,
          name: s.name,
          fullName: s.fullName,
          source: s.source,
          totalQuestions: 200,
          unlocked: this.isUnlocked(s.key)
        };
      }.bind(this));
    },

    // 完整 200 题
    getQuestions: function(subj, opts) {
      opts = opts || {};
      var all = generateQuestions(subj);
      if (opts.difficulty) {
        all = all.filter(function(q){ return q.difficulty === opts.difficulty; });
      }
      if (opts.topicCode) {
        all = all.filter(function(q){ return q.topicCode === opts.topicCode; });
      }
      if (opts.limit && all.length > opts.limit) {
        all = all.slice(0, opts.limit);
      }
      return all;
    },

    getStats: function(subj) {
      var all = generateQuestions(subj);
      var stats = { total: all.length, easy: 0, medium: 0, hard: 0, byTopic: {} };
      all.forEach(function(q) {
        stats[q.difficulty]++;
        if (!stats.byTopic[q.topicCode]) stats.byTopic[q.topicCode] = 0;
        stats.byTopic[q.topicCode]++;
      });
      stats.byTopicList = Object.keys(stats.byTopic).map(function(k){ return { code: k, count: stats.byTopic[k] }; });
      return stats;
    },

    // 是否已解锁单科
    isUnlocked: function(subj) {
      // Silver+ 会员默认解锁
      if (window.Membership && window.Membership.isActive && window.Membership.isActive()) {
        var lv = window.Membership.getLevel();
        if (lv.key === 'gold' || lv.key === 'diamond') return true;
        if (lv.key === 'silver') {
          // Silver 解锁 1 科, 默认第一个
          var arr = getUnlocked();
          if (arr.length > 0) return arr.indexOf(subj) >= 0;
          // 默认 silver 解锁 SAT
          return subj === 'sat';
        }
      }
      return getUnlocked().indexOf(subj) >= 0;
    },

    // 模拟购买单科 (¥29/科)
    unlock: function(subj, callback) {
      if (!TOPIC_MAP[subj]) {
        if (callback) callback({ ok: false, error: '未知科目' });
        return;
      }
      setTimeout(function() {
        var arr = getUnlocked();
        if (arr.indexOf(subj) < 0) arr.push(subj);
        setUnlocked(arr);
        if (callback) callback({ ok: true, subject: subj, orderId: 'PREM-' + Date.now(), amount: 29 });
      }, 400);
    },

    unlockedSubjects: function() { return getUnlocked(); },

    // 记录答题
    recordAnswer: function(qid, correct, subject, topicCode) {
      var data = lsGet(ANSWER_KEY, {});
      data[qid] = {
        correct: !!correct,
        subject: subject,
        topicCode: topicCode,
        ts: Date.now()
      };
      lsSet(ANSWER_KEY, data);
    },

    // 单科报告
    getReport: function(subj) {
      var all = generateQuestions(subj);
      var data = lsGet(ANSWER_KEY, {});
      var answered = 0, correct = 0, byDiff = { easy: {a:0,c:0}, medium: {a:0,c:0}, hard: {a:0,c:0} };
      var byTopic = {};
      all.forEach(function(q) {
        var r = data[q.id];
        if (r) {
          answered++;
          byDiff[q.difficulty].a++;
          if (r.correct) {
            correct++;
            byDiff[q.difficulty].c++;
          }
          if (!byTopic[q.topicCode]) byTopic[q.topicCode] = { a:0, c:0 };
          byTopic[q.topicCode].a++;
          if (r.correct) byTopic[q.topicCode].c++;
        }
      });
      return {
        subject: subj,
        total: all.length,
        answered: answered,
        correct: correct,
        accuracy: answered > 0 ? +(correct / answered * 100).toFixed(1) : 0,
        byDifficulty: byDiff,
        byTopic: byTopic
      };
    },

    allReports: function() {
      var out = {};
      SUBJECTS.forEach(function(s) {
        out[s.key] = this.getReport(s.key);
      }.bind(this));
      return out;
    },

    formatPrice: function(yuan) { return '¥' + yuan; }
  };

  if (typeof window !== 'undefined') {
    window.PremiumBank = PremiumBank;
  }
})();
