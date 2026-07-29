/* ================================================================
 * ai-tutor.js v1.0
 * AI 薄弱点诊断 + 错题讲解（纯前端规则引擎）
 *
 * window.AITutor.diagnose(data)  → 薄弱 TOP5 诊断
 * window.AITutor.explain(topicCode, subject) → 三段式讲解
 * ================================================================ */
(function() {
  'use strict';

  var SUBJECT_NAMES = {
    sat: 'SAT', act: 'ACT', ap: 'AP', ib: 'IB',
    alevel: 'A-Level', toefl: 'TOEFL', ielts: 'IELTS', igcse: 'IGCSE'
  };

  var EXPLAIN_TEMPLATES = {
    sat: {
      '线性方程': '线性方程是 SAT Math 的基础考点。核心方法：去分母→去括号→移项→合并同类项→系数化1。注意不等式两边乘除负数时不等号方向要反转。方程组可使用代入消元或加减消元法。',
      '二次函数': '二次函数 f(x)=ax²+bx+c 的图像是抛物线。关键性质：对称轴 x=-b/(2a)、顶点坐标、开口方向由 a 的正负决定。因式分解法求解：将方程化为 (x-r₁)(x-r₂)=0 形式。求根公式：x=(-b±√(b²-4ac))/(2a)。',
      '几何': '几何题解题策略：先标注已知条件→识别基本图形（三角形/圆/矩形）→选择对应定理。三角形重点：勾股定理、相似三角形判定、内角和定理。圆形重点：圆心角与圆周角关系、切线性质。',
      '统计': '数据分析要点：均值=总和/数量、中位数=排序后中间值、众数=出现最多的值。数据分布：标准差衡量离散程度，相关系数衡量线性相关性。概率题注意独立事件 P(A∩B)=P(A)×P(B)。',
      '阅读': '阅读策略：先读题→定位关键词→回文定位→比对选项。注意：正确选项必须被原文直接支持，不能过度推理。常见陷阱：偷换概念、范围扩大/缩小、绝对化表述。'
    },
    act: {
      '英语语法': 'ACT 英语核心：标点符号（逗号、分号、冒号、破折号）、时态一致性、代词指代、平行结构。解题策略：读画线部分上下文→判断错误类型→排除法选最佳。',
      '数学代数': 'ACT 数学代数重点：因式分解、二次方程、不等式、函数图像。解题技巧：代入法（将选项代入题目验证）、特殊值法（选特殊值代入简化计算）。',
      '阅读': 'ACT 阅读 4 篇 × 10 题 = 40 题，35 分钟。策略：先读题干关键词→分段阅读→做段内题。注意作者态度、文章主旨、推理题（必须基于原文）。',
      '科学推理': 'ACT 科学：数据表示（表格/图形读取）、研究摘要（实验设计变量控制）、观点冲突（对比不同理论）。策略：先看图表→理解变量→注意趋势和对比。'
    }
  };

  function getSubjectName(key) {
    return SUBJECT_NAMES[key] || key;
  }

  function findTopicInfo(subjectKey, topicCode) {
    if (!window.SYLLABUS_DATA) return null;
    var topic = window.SYLLABUS_DATA.getTopic(subjectKey, topicCode);
    return topic;
  }

  function matchTemplate(subjectKey, topicName) {
    var templates = EXPLAIN_TEMPLATES[subjectKey];
    if (!templates) return null;
    var keys = Object.keys(templates);
    for (var i = 0; i < keys.length; i++) {
      if (topicName.indexOf(keys[i]) !== -1 || keys[i].indexOf(topicName) !== -1) {
        return templates[keys[i]];
      }
    }
    return null;
  }

  function diagnose(data) {
    var SUBJECTS = ['ib', 'alevel', 'igcse', 'ap', 'sat', 'act', 'toefl', 'ielts'];
    var results = [];
    var records = (data && data.records) || {};

    if (window.SYLLABUS_DATA) {
      SUBJECTS.forEach(function(s) {
        var subjData = window.SYLLABUS_DATA.getSubject(s);
        if (!subjData || !subjData.papers) return;
        var recs = records[s] || {};
        var byTopic = {};
        Object.keys(recs).forEach(function(k) {
          var r = recs[k];
          if (!r) return;
          var tName = r.topic || '';
          if (!byTopic[tName]) byTopic[tName] = { done: 0, correct: 0 };
          byTopic[tName].done++;
          if (r.correct) byTopic[tName].correct++;
        });

        subjData.papers.forEach(function(paper) {
          if (!paper.topics) return;
          paper.topics.forEach(function(topic) {
            var st = byTopic[topic.name] || { done: 0, correct: 0 };
            var acc = st.done > 0 ? Math.round((st.correct / st.done) * 100) : null;
            var weightPct = 5;
            if (topic.weight) {
              var m = String(topic.weight).match(/([\d.]+)/);
              if (m) weightPct = parseFloat(m[1]) || 5;
            }
            var score = (acc === null ? 0 : acc) * weightPct / 100;
            results.push({
              subject: s,
              topicCode: topic.code,
              topicName: topic.name,
              acc: acc,
              done: st.done,
              correct: st.correct,
              weight: weightPct,
              score: score,
              priority: (acc === null ? 100 : (100 - acc)) * weightPct
            });
          });
        });
      });
    }

    results.sort(function(a, b) { return b.priority - a.priority; });

    var top5 = results.slice(0, 5).map(function(r) {
      var recommendPrac = r.acc === null ? 5 : Math.max(2, Math.round((100 - r.acc) * r.weight / 20));
      var estImprove = r.acc === null ? 30 : Math.min(40, Math.round((100 - r.acc) * 0.6));
      return {
        subject: r.subject,
        subjectName: getSubjectName(r.subject),
        topicCode: r.topicCode,
        topicName: r.topicName,
        acc: r.acc,
        done: r.done,
        weight: r.weight,
        recommendPrac: recommendPrac,
        estImprove: estImprove
      };
    });

    return {
      timestamp: Date.now(),
      topWeakTopics: top5,
      totalDiagnosed: results.length
    };
  }

  function explain(topicCode, subjectKey) {
    var topic = findTopicInfo(subjectKey, topicCode);
    var topicName = topic ? topic.name : topicCode;
    var weight = topic ? topic.weight : '—';
    var subjectName = getSubjectName(subjectKey);

    var template = matchTemplate(subjectKey, topicName);

    var part1 = '【考点回顾】\n' +
      '· 所属科目：' + subjectName + '\n' +
      '· Topic 编码：' + topicCode + '\n' +
      '· Topic 名称：' + topicName + '\n' +
      '· 权重：' + weight + '\n\n';

    var part2;
    if (template) {
      part2 = '【解题策略】\n' + template + '\n\n';
    } else {
      part2 = '【解题策略】\n' +
        '1. 审题：仔细阅读题干，标注关键信息和限制条件\n' +
        '2. 识别题型：判断属于哪类考点（计算/证明/分析/应用）\n' +
        '3. 选择方法：匹配最适合的解题方法和公式\n' +
        '4. 逐步推理：每步标注依据，确保逻辑清晰\n' +
        '5. 检查验证：结果代入原题验证合理性\n\n';
    }

    var part3 = '【常见陷阱】\n' +
      '· 注意单位转换和计算精度\n' +
      '· 警惕题目中的干扰信息和多余条件\n' +
      '· 避免跳步导致的粗心错误\n' +
      '· 关注题目限定条件（范围、正负、整数等）\n' +
      '· 做完后用答案回代验证\n\n' +
      '—— AI Tutor 生成，仅供参考 ——';

    return part1 + part2 + part3;
  }

  window.AITutor = {
    diagnose: diagnose,
    explain: explain
  };

  // --- Auto-inject AI Explain buttons on practice.html ---
  function initPracticeExplain() {
    var body = document.body;
    if (!body) return;
    var subject = body.getAttribute('data-subject');
    if (!subject) return;
    var qElements = document.querySelectorAll('.q');
    if (!qElements.length) return;

    var practiceData = null;
    try {
      var raw = localStorage.getItem('yz_practice_data');
      if (raw) practiceData = JSON.parse(raw);
    } catch(e) {}

    var records = (practiceData && practiceData.records && practiceData.records[subject]) || {};

    qElements.forEach(function(qEl) {
      var qId = qEl.id || '';
      var topicCode = '';
      var qNumEl = qEl.querySelector('.q-num');
      if (qNumEl) {
        var txt = qNumEl.textContent || '';
        var m = txt.match(/[\u3010\u3011\u3008\u3009【】]([A-Za-z0-9][A-Za-z0-9-]*)[\u3010\u3011\u3008\u3009【】]/);
        if (m) topicCode = m[1];
      }
      if (!topicCode) {
        var codeAttr = qEl.getAttribute('data-topic-code') || qEl.getAttribute('data-topic');
        if (codeAttr) topicCode = codeAttr;
      }

      var isWrong = false;
      if (qId && records[qId]) {
        isWrong = !records[qId].correct;
      }

      var hasAIBtn = qEl.querySelector('.ai-explain-btn');
      if (hasAIBtn) return;

      var btn = document.createElement('button');
      btn.className = 'ai-explain-btn';
      btn.textContent = '🤖 AI 讲解';
      btn.style.cssText = 'margin-top:8px;background:#fff;border:1px solid #111;padding:4px 12px;font-size:0.8rem;cursor:pointer;font-weight:600;color:#111;';
      btn.addEventListener('mouseenter', function() { btn.style.background = '#111'; btn.style.color = '#fff'; });
      btn.addEventListener('mouseleave', function() { btn.style.background = '#fff'; btn.style.color = '#111'; });

      var explainDiv = document.createElement('div');
      explainDiv.className = 'ai-explain-text';
      explainDiv.style.cssText = 'display:none;margin-top:8px;padding:10px;border:1px dashed #888;font-size:0.82rem;line-height:1.6;color:#333;background:#fafafa;white-space:pre-wrap;';

      btn.addEventListener('click', function() {
        if (explainDiv.style.display === 'block') {
          explainDiv.style.display = 'none';
          btn.textContent = '🤖 AI 讲解';
          return;
        }
        if (!explainDiv.dataset.generated) {
          var text = explain(topicCode, subject);
          explainDiv.textContent = text;
          explainDiv.dataset.generated = '1';
        }
        explainDiv.style.display = 'block';
        btn.textContent = '🤖 收起讲解';
      });

      var answerEl = qEl.querySelector('.q-answer');
      if (answerEl && answerEl.parentNode) {
        answerEl.parentNode.insertBefore(btn, answerEl.nextSibling);
        answerEl.parentNode.insertBefore(explainDiv, btn.nextSibling);
      } else {
        qEl.appendChild(btn);
        qEl.appendChild(explainDiv);
      }

      if (isWrong) {
        btn.style.borderColor = '#b00020';
        btn.style.color = '#b00020';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPracticeExplain);
  } else {
    initPracticeExplain();
  }
})();