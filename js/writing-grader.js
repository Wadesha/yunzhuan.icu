/* ================================================================
 * writing-grader.js v2.0 (v42)
 * 作文精评（深度版）
 *
 * 暴露对象：window.WritingGrader
 *   .grade(text, type)                 4 维 Band 评分（增强版，保持向后兼容）
 *   .gradeDeep(text, type, options)    深度评分（AIProvider + 本地双轨）
 *   .TYPES                             支持的作文类型
 *   .history                           历史批改记录数组
 *   .exportGrade(result, format)       导出：'json' | 'markdown' | 'html'
 *   .copyRichText(result)              复制为富文本（HTML + 纯文本）
 *   .compare(history)                  对比多次批改
 *   .clearHistory()
 *
 * 评分维度 (Rubric) · 0-9 Band：
 *   - Task Response       (TR)
 *   - Coherence & Cohesion (CC)
 *   - Lexical Resource    (LR)
 *   - Grammatical Range   (GRA)
 *
 * 总分：四维 Band 求和 (0-36)，等比映射至 0-100 兼容旧接口
 *
 * 不破坏 grade() 旧字段；新增 band / detail / highlights / improvements / aiNote。
 * ================================================================ */
(function() {
  'use strict';

  var GRADING_TYPES = ['TOEFL Integrated', 'TOEFL Independent', 'IELTS Task 1', 'IELTS Task 2', 'AP FRQ'];
  var HISTORY_KEY = 'writing_grader_history';
  var MAX_HISTORY = 50;

  // ---------------- Utilities ----------------
  function countWords(text) {
    if (!text) return 0;
    var trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function countSentences(text) {
    if (!text) return 0;
    var matches = text.match(/[^.!?]+[.!?]+/g);
    return matches ? matches.length : 0;
  }

  function splitSentences(text) {
    if (!text) return [];
    return (text.match(/[^.!?]+[.!?]+/g) || []).map(function(s) { return s.trim(); }).filter(Boolean);
  }

  function countUniqueWords(text) {
    if (!text) return 0;
    var words = text.toLowerCase().match(/[a-z]+/gi) || [];
    var unique = {};
    words.forEach(function(w) { unique[w] = true; });
    return Object.keys(unique).length;
  }

  function lexicalDiversity(text) {
    var total = countWords(text);
    var unique = countUniqueWords(text);
    if (total === 0) return 0;
    return Math.round((unique / total) * 100) / 100;
  }

  function detectConnectives(text) {
    if (!text) return { count: 0, found: [] };
    var connectives = [
      'however', 'moreover', 'furthermore', 'additionally', 'consequently',
      'therefore', 'thus', 'hence', 'nevertheless', 'nonetheless',
      'in contrast', 'on the other hand', 'for example', 'for instance',
      'in conclusion', 'to summarize', 'first', 'second', 'finally',
      'because', 'since', 'as a result', 'in addition', 'similarly',
      'although', 'whereas', 'while', 'despite', 'in spite of'
    ];
    var lower = text.toLowerCase();
    var found = [];
    connectives.forEach(function(c) {
      var regex = new RegExp(c, 'gi');
      var matches = lower.match(regex);
      if (matches && matches.length > 0) {
        found.push({ word: c, count: matches.length });
      }
    });
    var totalCount = 0;
    found.forEach(function(f) { totalCount += f.count; });
    return { count: totalCount, found: found };
  }

  function detectGrammarIssues(text) {
    if (!text) return { count: 0, issues: [] };
    var issues = [];
    var lower = text.toLowerCase();

    var doubleWords = text.match(/\b(\w+)\s+\1\b/gi);
    if (doubleWords) {
      doubleWords.forEach(function(m) {
        issues.push({ type: '重复词', text: m });
      });
    }

    var missingCaps = text.match(/[.!?]\s+[a-z]/g);
    if (missingCaps) {
      issues.push({ type: '缺少大写', count: missingCaps.length });
    }

    var doubleSpaces = text.match(/\s{2,}/g);
    if (doubleSpaces) {
      issues.push({ type: '多余空格', count: doubleSpaces.length });
    }

    var commaSplices = text.match(/\w+,\s+\w+/g);
    if (commaSplices && commaSplices.length > 5) {
      issues.push({ type: '逗号过多', count: commaSplices.length });
    }

    var spellingHints = [];
    var commonlyMisspelled = ['recieve', 'seperate', 'occured', 'untill', 'theif', 'alot', 'becuase'];
    commonlyMisspelled.forEach(function(w) {
      var regex = new RegExp('\\b' + w + '\\b', 'gi');
      if (regex.test(lower)) {
        spellingHints.push(w);
      }
    });
    if (spellingHints.length > 0) {
      issues.push({ type: '疑似拼写错误', words: spellingHints });
    }

    return { count: issues.length, issues: issues };
  }

  function analyzeSentenceComplexity(text) {
    if (!text) return { avgLength: 0, complexCount: 0, variety: 0 };
    var sentences = splitSentences(text);
    if (sentences.length === 0) return { avgLength: 0, complexCount: 0, variety: 0 };

    var totalWords = 0;
    var complexCount = 0;
    var clauseWords = ['because', 'although', 'while', 'whereas', 'since', 'if', 'when', 'before', 'after', 'unless', 'where'];
    sentences.forEach(function(s) {
      var wc = countWords(s);
      totalWords += wc;
      var lower = s.toLowerCase();
      var matched = false;
      for (var i = 0; i < clauseWords.length; i++) {
        if (lower.indexOf(clauseWords[i]) >= 0) {
          matched = true;
          break;
        }
      }
      if (matched) complexCount++;
    });

    return {
      avgLength: Math.round(totalWords / sentences.length),
      complexCount: complexCount,
      variety: Math.round((complexCount / sentences.length) * 100) / 100
    };
  }

  // ---------------- Sentence-level Highlighting ----------------
  function scoreSentence(s) {
    var wc = countWords(s);
    var lower = s.toLowerCase();
    var advWords = ['however', 'moreover', 'furthermore', 'consequently', 'therefore', 'thus', 'hence', 'nevertheless', 'significantly', 'substantially'];
    var advCount = 0;
    advWords.forEach(function(w) { if (lower.indexOf(w) >= 0) advCount++; });
    var clauseWords = ['because', 'although', 'while', 'whereas', 'since', 'unless', 'where'];
    var clauseCount = 0;
    clauseWords.forEach(function(w) { if (lower.indexOf(w) >= 0) clauseCount++; });
    // simple score: 0-100
    var score = 0;
    if (wc >= 12 && wc <= 30) score += 35;
    else if (wc >= 8) score += 20;
    else score += 5;
    if (advCount > 0) score += 25;
    if (clauseCount > 0) score += 20;
    if (/[A-Z]/.test(s.charAt(0))) score += 10;
    if (/[.!?]$/.test(s)) score += 10;
    return Math.min(100, score);
  }

  function extractHighlights(text, max) {
    max = max || 3;
    var sentences = splitSentences(text);
    var scored = sentences.map(function(s, idx) {
      return { idx: idx, text: s, score: scoreSentence(s) };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    var highs = scored.slice(0, max);
    var lows = scored.slice().sort(function(a, b) { return a.score - b.score; }).slice(0, max);
    return { high: highs, low: lows };
  }

  // ---------------- Per-Dimension Band (0-9) ----------------
  function bandTaskResponse(text, type) {
    var wordCount = countWords(text);
    var wordTarget = 150;
    if (type === 'TOEFL Independent' || type === 'IELTS Task 2') wordTarget = 250;
    else if (type === 'IELTS Task 1') wordTarget = 150;
    else if (type === 'AP FRQ') wordTarget = 300;

    var ratio = wordCount / wordTarget;
    var band = 0;
    if (ratio >= 1.0) band = 8;
    else if (ratio >= 0.85) band = 7;
    else if (ratio >= 0.7) band = 6;
    else if (ratio >= 0.55) band = 5;
    else if (ratio >= 0.4) band = 4;
    else if (ratio >= 0.25) band = 3;
    else band = 2;
    if (wordCount < 20) band = 1;
    return band;
  }

  function bandCoherence(text) {
    var conn = detectConnectives(text);
    var complexity = analyzeSentenceComplexity(text);
    var sentences = countSentences(text);
    var band = 4;
    if (conn.count >= 6) band += 3;
    else if (conn.count >= 4) band += 2;
    else if (conn.count >= 2) band += 1;
    if (complexity.variety >= 0.3) band += 1;
    if (sentences >= 4) band += 1;
    if (sentences < 3) band -= 2;
    return Math.max(1, Math.min(9, band));
  }

  function bandLexical(text) {
    var div = lexicalDiversity(text);
    var wc = countWords(text);
    var band = 4;
    if (div >= 0.6) band += 3;
    else if (div >= 0.5) band += 2;
    else if (div >= 0.4) band += 1;
    else band += 0;
    if (wc >= 200 && div >= 0.55) band += 1;
    return Math.max(1, Math.min(9, band));
  }

  function bandGrammatical(text) {
    var grammar = detectGrammarIssues(text);
    var complexity = analyzeSentenceComplexity(text);
    var band = 6;
    band -= Math.min(3, grammar.count);
    if (complexity.avgLength >= 15 && complexity.avgLength <= 25) band += 2;
    else if (complexity.avgLength >= 10) band += 1;
    if (complexity.complexCount >= 2) band += 1;
    return Math.max(1, Math.min(9, band));
  }

  // Map 0-9 band to legacy 0-25 (×2.78) for back-compat
  function bandToLegacy(band) {
    return Math.round((band / 9) * 25);
  }

  // ---------------- Local Template Feedback ----------------
  function buildImprovements(rubric, detail, type) {
    var items = [];
    // TR
    if (rubric.taskResponse <= 5) {
      items.push({
        dimension: 'Task Response',
        severity: 'high',
        text: '字数未达目标（' + (type || '') + '），建议补充更多实质性内容或举例。'
      });
    } else if (rubric.taskResponse >= 7) {
      items.push({ dimension: 'Task Response', severity: 'low', text: '任务回应充分，保持当前结构。' });
    }
    // CC
    if (rubric.coherenceCohesion <= 4) {
      items.push({
        dimension: 'Coherence & Cohesion',
        severity: 'high',
        text: '连接词使用不足（仅 ' + detail.connectives + ' 处）。建议增加 however, moreover, for example 等过渡词。'
      });
    } else {
      items.push({
        dimension: 'Coherence & Cohesion',
        severity: 'low',
        text: '连贯性良好，可进一步强化段落间的逻辑递进。'
      });
    }
    // LR
    if (rubric.lexicalResource <= 5) {
      items.push({
        dimension: 'Lexical Resource',
        severity: 'medium',
        text: 'TTR 仅 ' + detail.ttr + '，词汇重复率偏高。建议同义替换基础词（important→crucial, show→demonstrate）。'
      });
    } else {
      items.push({ dimension: 'Lexical Resource', severity: 'low', text: '词汇使用丰富，继续保持。' });
    }
    // GRA
    if (rubric.grammaticalRange <= 5) {
      items.push({
        dimension: 'Grammatical Range',
        severity: detail.grammarErrors > 2 ? 'high' : 'medium',
        text: '检测到 ' + detail.grammarErrors + ' 处语法问题，且 ' + (detail.avgSentenceLength < 10 ? '句长偏短' : '建议引入更多复合句') + '。'
      });
    } else {
      items.push({ dimension: 'Grammatical Range', severity: 'low', text: '语法结构稳定，可尝试更复杂句式。' });
    }
    return items;
  }

  // ---------------- Main: grade() ----------------
  function grade(text, type) {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        band: 0,
        feedback: [{ type: 'error', text: '请输入要批改的文本' }],
        rubric: {
          taskResponse: 0,
          coherenceCohesion: 0,
          lexicalResource: 0,
          grammaticalRange: 0
        },
        bandRubric: { taskResponse: 0, coherenceCohesion: 0, lexicalResource: 0, grammaticalRange: 0 },
        detail: { sentences: 0, words: 0, ttr: 0, avgSentenceLength: 0, connectives: 0, grammarErrors: 0 },
        highlights: { high: [], low: [] },
        improvements: [],
        aiNote: null,
        type: type || 'TOEFL Independent',
        ts: Date.now()
      };
    }

    if (!type || GRADING_TYPES.indexOf(type) < 0) {
      type = 'TOEFL Independent';
    }

    // Bands (0-9)
    var tr = bandTaskResponse(text, type);
    var cc = bandCoherence(text);
    var lr = bandLexical(text);
    var gra = bandGrammatical(text);
    var totalBand = tr + cc + lr + gra; // 0-36
    // Legacy mapping (0-100)
    var totalScore = Math.round((totalBand / 36) * 100);

    // Detail
    var sentences = countSentences(text);
    var words = countWords(text);
    var ttr = lexicalDiversity(text);
    var avgSent = sentences > 0 ? Math.round(words / sentences) : 0;
    var conn = detectConnectives(text);
    var grammar = detectGrammarIssues(text);
    var complexity = analyzeSentenceComplexity(text);

    var detail = {
      sentences: sentences,
      words: words,
      ttr: ttr,
      avgSentenceLength: complexity.avgLength || avgSent,
      connectives: conn.count,
      grammarErrors: grammar.count,
      complexSentences: complexity.complexCount,
      connectiveDetail: conn.found.slice(0, 6),
      grammarDetail: grammar.issues.slice(0, 6)
    };

    var rubric = {
      taskResponse: bandToLegacy(tr),
      coherenceCohesion: bandToLegacy(cc),
      lexicalResource: bandToLegacy(lr),
      grammaticalRange: bandToLegacy(gra)
    };

    var bandRubric = {
      taskResponse: tr,
      coherenceCohesion: cc,
      lexicalResource: lr,
      grammaticalRange: gra
    };

    var highlights = extractHighlights(text, 3);
    var improvements = buildImprovements(bandRubric, detail, type);

    // Compose feedback (legacy format + new structured items)
    var feedback = [];
    feedback.push({ type: 'info', text: '总词数: ' + words + '，句子数: ' + sentences });
    feedback.push({ type: 'info', text: 'TTR: ' + ttr.toFixed(2) + ' · 平均句长: ' + detail.avgSentenceLength + ' · 连接词: ' + conn.count + ' 处' });
    if (grammar.count > 0) {
      feedback.push({ type: 'warning', text: '发现 ' + grammar.count + ' 处语法/格式问题' });
    } else {
      feedback.push({ type: 'success', text: '未检测到明显语法错误' });
    }
    if (conn.count >= 2) {
      feedback.push({ type: 'success', text: '连接词使用恰当，文章连贯性好' });
    } else {
      feedback.push({ type: 'warning', text: '建议增加连接词使用（however, moreover, for example 等）' });
    }
    if (complexity.complexCount >= 2) {
      feedback.push({ type: 'success', text: '句子结构多样，包含复合句和复杂句' });
    } else {
      feedback.push({ type: 'warning', text: '建议使用更多复合句结构' });
    }
    if (ttr >= 0.5) {
      feedback.push({ type: 'success', text: '词汇使用丰富' });
    } else if (ttr >= 0.35) {
      feedback.push({ type: 'info', text: '词汇多样性一般，可尝试使用更多高级词汇' });
    } else {
      feedback.push({ type: 'warning', text: '词汇重复率偏高，建议扩大词汇量' });
    }

    var result = {
      score: totalScore,
      band: totalBand,
      rubric: rubric,
      bandRubric: bandRubric,
      feedback: feedback,
      detail: detail,
      highlights: highlights,
      improvements: improvements,
      aiNote: null,
      type: type,
      text: text,
      ts: Date.now()
    };

    // Save to history (skip empty / pure placeholder)
    pushHistory(result);

    return result;
  }

  // ---------------- Deep Grade (AI + Local) ----------------
  function gradeDeep(text, type, options) {
    options = options || {};
    var localResult = grade(text, type);
    if (!window.AIProvider) {
      localResult.aiNote = 'AIProvider 未加载，使用本地精评';
      return Promise.resolve(localResult);
    }

    var prompt = '你是一位经验丰富的 ' + (type || 'TOEFL/IELTS') + ' 写作评分专家。' +
      '请对以下学生作文进行 4 维 Band 评分（0-9）并给出具体改进建议。\n' +
      '严格按照以下 JSON Schema 返回（不要使用 Markdown 代码块围栏）：\n' +
      '{\n' +
      '  "taskResponse": <0-9 整数>,\n' +
      '  "coherenceCohesion": <0-9 整数>,\n' +
      '  "lexicalResource": <0-9 整数>,\n' +
      '  "grammaticalRange": <0-9 整数>,\n' +
      '  "highSentences": ["高分句1", "高分句2"],\n' +
      '  "lowSentences": ["低分句1", "低分句2"],\n' +
      '  "improvements": [\n' +
      '    {"dimension": "Task Response", "text": "具体建议"},\n' +
      '    {"dimension": "Coherence & Cohesion", "text": "..."}\n' +
      '  ],\n' +
      '  "summary": "整体评价（中文 2-3 句）"\n' +
      '}\n\n' +
      '学生作文：\n"""' + (text || '').slice(0, 4000) + '"""';

    return window.AIProvider.complete(prompt, {
      systemPrompt: 'You are a writing assessment expert. Reply only with valid JSON.',
      temperature: 0.3,
      maxTokens: 1200,
      cache: true
    }).then(function(ai) {
      var parsed = parseAIResponse(ai.text);
      if (!parsed) {
        localResult.aiNote = 'AI 返回解析失败（provider=' + ai.provider + '），使用本地精评';
        return localResult;
      }
      // Merge
      var aiBands = {
        taskResponse: clampBand(parsed.taskResponse),
        coherenceCohesion: clampBand(parsed.coherenceCohesion),
        lexicalResource: clampBand(parsed.lexicalResource),
        grammaticalRange: clampBand(parsed.grammaticalRange)
      };
      var aiTotalBand = aiBands.taskResponse + aiBands.coherenceCohesion + aiBands.lexicalResource + aiBands.grammaticalRange;

      // blended: 60% AI + 40% local
      var mergedBands = {
        taskResponse: Math.round(aiBands.taskResponse * 0.6 + localResult.bandRubric.taskResponse * 0.4),
        coherenceCohesion: Math.round(aiBands.coherenceCohesion * 0.6 + localResult.bandRubric.coherenceCohesion * 0.4),
        lexicalResource: Math.round(aiBands.lexicalResource * 0.6 + localResult.bandRubric.lexicalResource * 0.4),
        grammaticalRange: Math.round(aiBands.grammaticalRange * 0.6 + localResult.bandRubric.grammaticalRange * 0.4)
      };
      var mergedBand = mergedBands.taskResponse + mergedBands.coherenceCohesion + mergedBands.lexicalResource + mergedBands.grammaticalRange;

      var mergedRubric = {
        taskResponse: bandToLegacy(mergedBands.taskResponse),
        coherenceCohesion: bandToLegacy(mergedBands.coherenceCohesion),
        lexicalResource: bandToLegacy(mergedBands.lexicalResource),
        grammaticalRange: bandToLegacy(mergedBands.grammaticalRange)
      };

      // merge highlights
      var mergedHigh = (parsed.highSentences && parsed.highSentences.length) ?
        parsed.highSentences.slice(0, 3).map(function(s, i) {
          return { idx: i, text: s, score: 100, source: 'ai' };
        }) : localResult.highlights.high;
      var mergedLow = (parsed.lowSentences && parsed.lowSentences.length) ?
        parsed.lowSentences.slice(0, 3).map(function(s, i) {
          return { idx: i, text: s, score: 0, source: 'ai' };
        }) : localResult.highlights.low;

      // merge improvements
      var mergedImprovements = localResult.improvements.slice();
      if (Array.isArray(parsed.improvements)) {
        parsed.improvements.forEach(function(it) {
          mergedImprovements.push({
            dimension: it.dimension || 'General',
            severity: 'medium',
            text: it.text || '',
            source: 'ai'
          });
        });
      }
      if (parsed.summary) {
        mergedImprovements.push({
          dimension: 'AI 总结',
          severity: 'low',
          text: parsed.summary,
          source: 'ai'
        });
      }

      var deepResult = {
        score: Math.round((mergedBand / 36) * 100),
        band: mergedBand,
        rubric: mergedRubric,
        bandRubric: mergedBands,
        aiBands: aiBands,
        localBands: {
          taskResponse: localResult.bandRubric.taskResponse,
          coherenceCohesion: localResult.bandRubric.coherenceCohesion,
          lexicalResource: localResult.bandRubric.lexicalResource,
          grammaticalRange: localResult.bandRubric.grammaticalRange
        },
        feedback: localResult.feedback.concat([
          { type: 'info', text: 'AI 评分: TR=' + aiBands.taskResponse + ' CC=' + aiBands.coherenceCohesion + ' LR=' + aiBands.lexicalResource + ' GRA=' + aiBands.grammaticalRange + ' (provider=' + ai.provider + (ai.cached ? ', cached' : '') + ')' }
        ]),
        detail: localResult.detail,
        highlights: { high: mergedHigh, low: mergedLow },
        improvements: mergedImprovements,
        aiNote: 'AI=' + ai.provider + (ai.cached ? '(cached)' : '') + ' · merged 60% AI + 40% local',
        type: type,
        text: text,
        ts: Date.now()
      };

      pushHistory(deepResult);
      return deepResult;
    }).catch(function(err) {
      localResult.aiNote = 'AI 失败: ' + (err && err.message) + '，已使用本地精评';
      return localResult;
    });
  }

  function parseAIResponse(text) {
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) {}
    var m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (e) {}
    }
    return null;
  }

  function clampBand(v) {
    var n = parseInt(v, 10);
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(9, n));
  }

  // ---------------- History ----------------
  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveHistory(arr) {
    try {
      var trimmed = arr.slice(-MAX_HISTORY);
      // store without the full text to keep size small
      var lite = trimmed.map(function(r) {
        return {
          ts: r.ts,
          type: r.type,
          score: r.score,
          band: r.band,
          bandRubric: r.bandRubric,
          rubric: r.rubric,
          detail: r.detail,
          highlights: r.highlights,
          improvements: r.improvements,
          aiNote: r.aiNote,
          textPreview: (r.text || '').slice(0, 120),
          textLength: (r.text || '').length
        };
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(lite));
    } catch (e) {}
  }

  function pushHistory(result) {
    if (!result) return;
    var hist = loadHistory();
    hist.push(result);
    saveHistory(hist);
  }

  function getHistory() { return loadHistory(); }

  function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); return true; } catch (e) { return false; }
  }

  // ---------------- Export / Compare ----------------
  function exportGrade(result, format) {
    format = (format || 'json').toLowerCase();
    if (format === 'json') {
      return JSON.stringify(result, null, 2);
    }
    if (format === 'markdown' || format === 'md') {
      return toMarkdown(result);
    }
    if (format === 'html') {
      return toHTML(result);
    }
    return JSON.stringify(result, null, 2);
  }

  function toMarkdown(r) {
    if (!r) return '';
    var lines = [];
    lines.push('# 作文精评报告');
    lines.push('');
    lines.push('- **类型**: ' + (r.type || '—'));
    lines.push('- **时间**: ' + new Date(r.ts || Date.now()).toLocaleString());
    lines.push('- **总分 (0-100)**: ' + r.score);
    lines.push('- **Band (0-36)**: ' + r.band);
    lines.push('');
    lines.push('## 4 维评分 (0-9 Band)');
    lines.push('| 维度 | Band | 百分制 |');
    lines.push('|------|------|--------|');
    lines.push('| Task Response | ' + r.bandRubric.taskResponse + ' | ' + r.rubric.taskResponse + ' |');
    lines.push('| Coherence & Cohesion | ' + r.bandRubric.coherenceCohesion + ' | ' + r.rubric.coherenceCohesion + ' |');
    lines.push('| Lexical Resource | ' + r.bandRubric.lexicalResource + ' | ' + r.rubric.lexicalResource + ' |');
    lines.push('| Grammatical Range | ' + r.bandRubric.grammaticalRange + ' | ' + r.rubric.grammaticalRange + ' |');
    lines.push('');
    lines.push('## 文本指标');
    lines.push('- 词数: ' + r.detail.words);
    lines.push('- 句数: ' + r.detail.sentences);
    lines.push('- 平均句长: ' + r.detail.avgSentenceLength);
    lines.push('- TTR (词汇多样性): ' + r.detail.ttr);
    lines.push('- 连接词: ' + r.detail.connectives + ' 处');
    lines.push('- 语法错误: ' + r.detail.grammarErrors + ' 处');
    lines.push('');
    if (r.highlights && r.highlights.high && r.highlights.high.length) {
      lines.push('## 高分句摘抄');
      r.highlights.high.forEach(function(s, i) {
        lines.push((i + 1) + '. ' + s.text);
      });
      lines.push('');
    }
    if (r.highlights && r.highlights.low && r.highlights.low.length) {
      lines.push('## 低分句定位');
      r.highlights.low.forEach(function(s, i) {
        lines.push((i + 1) + '. ' + s.text);
      });
      lines.push('');
    }
    if (r.improvements && r.improvements.length) {
      lines.push('## 改进建议');
      r.improvements.forEach(function(it, i) {
        var tag = it.source === 'ai' ? ' (AI)' : '';
        lines.push((i + 1) + '. **[' + it.dimension + ']' + tag + '** ' + it.text);
      });
      lines.push('');
    }
    if (r.aiNote) {
      lines.push('## AI 备注');
      lines.push(r.aiNote);
      lines.push('');
    }
    return lines.join('\n');
  }

  function toHTML(r) {
    if (!r) return '';
    var md = toMarkdown(r);
    // very lightweight markdown→html for the report
    var html = md
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/^\| (.*) \|$/gm, function(m) { return m; })
      .replace(/\n/g, '<br>');
    return '<div style="font-family:-apple-system,sans-serif;line-height:1.6;">' + html + '</div>';
  }

  function copyRichText(result) {
    if (!result) return Promise.resolve(false);
    var html = toHTML(result);
    var text = toMarkdown(result);
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        var item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' })
        });
        return navigator.clipboard.write([item]).then(function() { return true; });
      } catch (e) {}
    }
    // Fallback: textarea
    return new Promise(function(resolve) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(true); } catch (e) { resolve(false); }
      document.body.removeChild(ta);
    });
  }

  function compare(history) {
    history = history || loadHistory();
    if (!history.length) return { count: 0 };
    var rows = history.map(function(h) {
      return {
        ts: h.ts,
        date: new Date(h.ts).toLocaleString(),
        type: h.type,
        score: h.score,
        band: h.band,
        tr: h.bandRubric.taskResponse,
        cc: h.bandRubric.coherenceCohesion,
        lr: h.bandRubric.lexicalResource,
        gra: h.bandRubric.grammaticalRange,
        words: h.detail.words,
        ttr: h.detail.ttr
      };
    });
    // trend
    var scores = rows.map(function(r) { return r.score; });
    var avg = scores.reduce(function(a, b) { return a + b; }, 0) / scores.length;
    var best = Math.max.apply(null, scores);
    var worst = Math.min.apply(null, scores);
    var trend = '—';
    if (rows.length >= 2) {
      var half = Math.floor(rows.length / 2);
      var first = rows.slice(0, half);
      var second = rows.slice(half);
      var avg1 = first.reduce(function(a, b) { return a + b.score; }, 0) / first.length;
      var avg2 = second.reduce(function(a, b) { return a + b.score; }, 0) / second.length;
      var diff = Math.round(avg2 - avg1);
      trend = diff > 0 ? '↑ +' + diff : (diff < 0 ? '↓ ' + diff : '→ 持平');
    }
    return { count: rows.length, rows: rows, avg: Math.round(avg), best: best, worst: worst, trend: trend };
  }

  // ---------------- Public API ----------------
  window.WritingGrader = {
    grade: grade,
    gradeDeep: gradeDeep,
    TYPES: GRADING_TYPES,
    history: getHistory,
    clearHistory: clearHistory,
    exportGrade: exportGrade,
    copyRichText: copyRichText,
    compare: compare,
    _internal: {
      countWords: countWords,
      countSentences: countSentences,
      splitSentences: splitSentences,
      lexicalDiversity: lexicalDiversity,
      detectConnectives: detectConnectives,
      detectGrammarIssues: detectGrammarIssues,
      analyzeSentenceComplexity: analyzeSentenceComplexity,
      extractHighlights: extractHighlights,
      bandToLegacy: bandToLegacy,
      toMarkdown: toMarkdown,
      toHTML: toHTML
    }
  };
})();
