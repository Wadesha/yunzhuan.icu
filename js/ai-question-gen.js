/* ================================================================
 * ai-question-gen.js v1.0 (v40)
 * AI 智能出题系统
 *
 * 暴露对象：window.QuestionGen
 *   .generate({subject, topicCode, difficulty, count, type}) -> Promise<Question[]>
 *   .saveToBank(questions, subject, topicCode) -> number
 *   .loadFromBank(subject, topicCode) -> Question[]
 *   .listBank() -> { subject, topicCode, count }[]
 *   .localGenerate(opts) -> Question[]   纯模板生成
 *
 * Question 模型:
 *   { qid, stem, choices:{A,B,C,D[,E]}, answer, explanation,
 *     difficulty, topicCode, subject, source, ts }
 *
 * localStorage key:
 *   ai_generated_questions  -> { [subject]: { [topicCode]: Question[] } }
 * ================================================================ */
(function() {
  'use strict';

  var BANK_KEY = 'ai_generated_questions';
  var VALID_DIFFICULTY = ['easy', 'medium', 'hard'];
  var VALID_TYPES = ['single', 'multiple', 'tf'];
  var DIFFICULTY_LABELS = { easy: '简单', medium: '中等', hard: '困难' };

  function uid() {
    return 'qg-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function getDifficultyAdjustment(subject, topicCode) {
    // read yz_practice_data and adjust difficulty based on past accuracy
    try {
      var raw = localStorage.getItem('yz_practice_data');
      if (!raw) return 0;
      var data = JSON.parse(raw);
      var recs = (data.records && data.records[subject]) || {};
      var total = 0, correct = 0;
      Object.keys(recs).forEach(function(k) {
        var r = recs[k];
        if (r && r.topicCode === topicCode) {
          total++;
          if (r.correct) correct++;
        }
      });
      if (total < 3) return 0;
      var acc = correct / total;
      if (acc >= 0.85) return 1;     // 提升难度
      if (acc <= 0.5) return -1;     // 降低难度
      return 0;
    } catch (e) {
      return 0;
    }
  }

  function adjustDifficulty(baseDifficulty, adj) {
    var idx = VALID_DIFFICULTY.indexOf(baseDifficulty);
    if (idx < 0) idx = 1;
    var newIdx = Math.max(0, Math.min(VALID_DIFFICULTY.length - 1, idx + adj));
    return VALID_DIFFICULTY[newIdx];
  }

  function getTopicInfo(subject, topicCode) {
    if (!window.SYLLABUS_DATA) return null;
    try {
      return window.SYLLABUS_DATA.getTopic(subject, topicCode);
    } catch (e) {
      return null;
    }
  }

  // ---------------- Local Template Generation ----------------
  var STEM_TEMPLATES = {
    easy: [
      '下列关于 {topic} 的说法，哪一项是正确的？',
      '{topic} 的基本定义是：',
      '以下哪个选项最准确地描述了 {topic}？',
      '在 {topic} 中，最常见的应用场景是：'
    ],
    medium: [
      '关于 {topic}，下列分析哪一项最合理？',
      '在 {subject} 考试中，{topic} 经常与以下哪个概念一起考察？',
      '针对 {topic}，下列做法中最有效的是：',
      '请判断以下关于 {topic} 的论述是否正确，并说明理由。'
    ],
    hard: [
      '综合考虑 {topic} 与其前置知识点，下列推理哪一项最严谨？',
      '在 {subject} 高难度题目中，{topic} 常作为关键步骤，下列哪一项是其核心思想？',
      '请从多个角度比较 {topic} 的不同解法，并选出最优。',
      '若在 {topic} 中引入 {topic} 的进阶变体，下列哪种处理最恰当？'
    ]
  };

  var CHOICE_TEMPLATES = {
    easy: [
      'A. {topic} 的标准定义',
      'B. {topic} 的近似描述（不完全准确）',
      'C. 与 {topic} 无关的概念',
      'D. 错误的 {topic} 解释'
    ],
    medium: [
      'A. {topic} 的基础方法',
      'B. {topic} 的进阶应用',
      'C. 与 {topic} 易混淆的其他概念',
      'D. {topic} 的常见误区'
    ],
    hard: [
      'A. {topic} 的核心原理',
      'B. {topic} 的形式化证明',
      'C. {topic} 在高阶场景下的推广',
      'D. {topic} 与其他知识点的交叉',
      'E. {topic} 的常见错误思路'
    ]
  };

  function localGenerate(opts) {
    opts = opts || {};
    var subject = opts.subject || 'sat';
    var topicCode = opts.topicCode || 'T-LOCAL';
    var difficulty = VALID_DIFFICULTY.indexOf(opts.difficulty) >= 0 ? opts.difficulty : 'medium';
    var count = Math.max(1, Math.min(20, parseInt(opts.count, 10) || 5));
    var type = VALID_TYPES.indexOf(opts.type) >= 0 ? opts.type : 'single';

    var adj = getDifficultyAdjustment(subject, topicCode);
    var effectiveDifficulty = adjustDifficulty(difficulty, adj);

    var topic = getTopicInfo(subject, topicCode);
    var topicName = (topic && topic.name) || topicCode;
    var subjectLabel = (window.SYLLABUS_DATA && window.SYLLABUS_DATA.getSubject(subject)) ?
      (window.SYLLABUS_DATA.getSubject(subject).name || subject.toUpperCase()) : subject.toUpperCase();

    var stemPool = STEM_TEMPLATES[effectiveDifficulty];
    var choicePool = CHOICE_TEMPLATES[effectiveDifficulty];

    var questions = [];
    var numChoices = (effectiveDifficulty === 'hard') ? 5 : 4;

    for (var i = 0; i < count; i++) {
      var stemTpl = stemPool[i % stemPool.length];
      var stem = stemTpl.replace(/\{topic\}/g, topicName).replace(/\{subject\}/g, subjectLabel);

      var choices = {};
      for (var c = 0; c < numChoices; c++) {
        var letter = String.fromCharCode(65 + c); // A, B, C, D, E
        var tpl = choicePool[c % choicePool.length];
        choices[letter] = tpl.replace(/\{topic\}/g, topicName);
      }

      // correct answer: rotate for variety
      var answer = String.fromCharCode(65 + (i % numChoices));

      var explanation = '本题考察 ' + topicName + '（' + subjectLabel + '，难度：' +
        DIFFICULTY_LABELS[effectiveDifficulty] + '）。\n' +
        '正确答案：' + answer + '。\n' +
        '解析：该选项最符合 ' + topicName + ' 的核心定义与应用场景。\n' +
        '—— 本地模板生成，可在 Dashboard → AI Provider Settings 配置真实 AI ——';

      questions.push({
        qid: uid(),
        stem: stem,
        choices: choices,
        answer: answer,
        explanation: explanation,
        difficulty: effectiveDifficulty,
        topicCode: topicCode,
        subject: subject,
        source: 'local',
        ts: Date.now(),
        type: type
      });
    }

    return {
      questions: questions,
      provider: 'local',
      difficultyAdjusted: adj,
      effectiveDifficulty: effectiveDifficulty
    };
  }

  // ---------------- AI-Powered Generation ----------------
  function aiGenerate(opts) {
    if (!window.AIProvider) {
      return Promise.resolve(localGenerate(opts));
    }

    var subject = opts.subject || 'sat';
    var topicCode = opts.topicCode || 'T-LOCAL';
    var difficulty = VALID_DIFFICULTY.indexOf(opts.difficulty) >= 0 ? opts.difficulty : 'medium';
    var count = Math.max(1, Math.min(20, parseInt(opts.count, 10) || 5));
    var type = opts.type || 'single';

    var topic = getTopicInfo(subject, topicCode);
    var topicName = (topic && topic.name) || topicCode;
    var subjectLabel = (window.SYLLABUS_DATA && window.SYLLABUS_DATA.getSubject(subject)) ?
      (window.SYLLABUS_DATA.getSubject(subject).name || subject.toUpperCase()) : subject.toUpperCase();

    var systemPrompt = '你是一位经验丰富的 ' + subjectLabel + ' 出题专家，擅长根据知识点生成高质量的单选题。' +
      '严格只返回 JSON，不要包含任何额外说明、Markdown 标记或代码块围栏。' +
      '题目要符合 ' + subjectLabel + ' 考试的难度与风格。';

    var prompt = '请基于以下参数生成 ' + count + ' 道 ' + DIFFICULTY_LABELS[difficulty] + ' 难度的单选题。\n' +
      '科目：' + subjectLabel + '\n' +
      '知识点代码：' + topicCode + '\n' +
      '知识点名称：' + topicName + '\n' +
      '难度：' + difficulty + ' (' + DIFFICULTY_LABELS[difficulty] + ')\n' +
      '题型：' + type + ' (single=单选)\n\n' +
      '严格按以下 JSON Schema 返回：\n' +
      '{\n' +
      '  "questions": [\n' +
      '    {\n' +
      '      "qid": "唯一ID（短字符串）",\n' +
      '      "stem": "题目题干（中文）",\n' +
      '      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },\n' +
      '      "answer": "A" | "B" | "C" | "D",\n' +
      '      "explanation": "答案解析（中文，2-3 句）",\n' +
      '      "difficulty": "' + difficulty + '",\n' +
      '      "topicCode": "' + topicCode + '"\n' +
      '    }\n' +
      '  ]\n' +
      '}';

    return window.AIProvider.complete(prompt, {
      systemPrompt: systemPrompt,
      temperature: 0.6,
      maxTokens: 2000,
      cache: true
    }).then(function(result) {
      var parsed = parseAIResponse(result.text);
      if (!parsed || !parsed.questions || !parsed.questions.length) {
        // fallback
        var local = localGenerate(opts);
        local.fallbackReason = 'AI response parse failed';
        return local;
      }
      // normalize + augment
      var out = parsed.questions.slice(0, count).map(function(q) {
        return {
          qid: q.qid || uid(),
          stem: q.stem || '',
          choices: q.choices || { A: '', B: '', C: '', D: '' },
          answer: (q.answer || 'A').toString().charAt(0).toUpperCase(),
          explanation: q.explanation || '',
          difficulty: q.difficulty || difficulty,
          topicCode: q.topicCode || topicCode,
          subject: subject,
          source: 'ai-' + result.provider,
          ts: Date.now(),
          type: type
        };
      });
      return {
        questions: out,
        provider: result.provider,
        cached: result.cached || false
      };
    }).catch(function(err) {
      var local = localGenerate(opts);
      local.fallbackReason = err && err.message;
      return local;
    });
  }

  function parseAIResponse(text) {
    if (!text) return null;
    // try direct JSON
    try { return JSON.parse(text); } catch (e) {}
    // try to extract first JSON block
    var m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (e) {}
    }
    return null;
  }

  // ---------------- Public API ----------------
  function generate(opts) {
    opts = opts || {};
    var useAI = opts.useAI !== false; // default true
    if (!useAI) return Promise.resolve(localGenerate(opts));
    return aiGenerate(opts);
  }

  function loadBank() {
    try {
      var raw = localStorage.getItem(BANK_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveBank(bank) {
    try {
      localStorage.setItem(BANK_KEY, JSON.stringify(bank));
      return true;
    } catch (e) {
      return false;
    }
  }

  function saveToBank(questions, subject, topicCode) {
    if (!Array.isArray(questions) || !questions.length) return 0;
    subject = subject || 'unknown';
    topicCode = topicCode || 'T-MISC';
    var bank = loadBank();
    if (!bank[subject]) bank[subject] = {};
    if (!bank[subject][topicCode]) bank[subject][topicCode] = [];
    bank[subject][topicCode] = bank[subject][topicCode].concat(questions);
    saveBank(bank);
    return questions.length;
  }

  function loadFromBank(subject, topicCode) {
    var bank = loadBank();
    if (!subject) {
      // return all
      return bank;
    }
    if (!topicCode) return bank[subject] || {};
    return (bank[subject] && bank[subject][topicCode]) || [];
  }

  function listBank() {
    var bank = loadBank();
    var out = [];
    Object.keys(bank).forEach(function(s) {
      Object.keys(bank[s]).forEach(function(t) {
        out.push({ subject: s, topicCode: t, count: (bank[s][t] || []).length });
      });
    });
    return out;
  }

  function clearBank(subject, topicCode) {
    var bank = loadBank();
    if (subject && topicCode) {
      if (bank[subject]) delete bank[subject][topicCode];
    } else if (subject) {
      delete bank[subject];
    } else {
      bank = {};
    }
    saveBank(bank);
  }

  window.QuestionGen = {
    generate: generate,
    localGenerate: localGenerate,
    saveToBank: saveToBank,
    loadFromBank: loadFromBank,
    listBank: listBank,
    clearBank: clearBank,
    _internal: {
      VALID_DIFFICULTY: VALID_DIFFICULTY,
      VALID_TYPES: VALID_TYPES,
      DIFFICULTY_LABELS: DIFFICULTY_LABELS
    }
  };
})();
