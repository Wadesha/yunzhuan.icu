(function() {
  'use strict';

  var GRADING_TYPES = ['TOEFL Integrated', 'TOEFL Independent', 'IELTS Task 1', 'IELTS Task 2', 'AP FRQ'];

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
    var sentences = text.split(/[.!?]+/).map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
    if (sentences.length === 0) return { avgLength: 0, complexCount: 0, variety: 0 };

    var totalWords = 0;
    var complexCount = 0;
    var clauseWords = ['because', 'although', 'while', 'whereas', 'since', 'if', 'when', 'before', 'after', 'unless', 'where'];
    sentences.forEach(function(s) {
      var wc = countWords(s);
      totalWords += wc;
      var lower = s.toLowerCase();
      clauseWords.forEach(function(cw) {
        if (lower.indexOf(cw) >= 0) {
          complexCount++;
          return;
        }
      });
    });

    return {
      avgLength: Math.round(totalWords / sentences.length),
      complexCount: complexCount,
      variety: Math.round((complexCount / sentences.length) * 100) / 100
    };
  }

  function scoreTaskResponse(text, type) {
    var wordCount = countWords(text);
    var sentenceCount = countSentences(text);
    var diversity = lexicalDiversity(text);
    var connectives = detectConnectives(text);
    var grammar = detectGrammarIssues(text);
    var complexity = analyzeSentenceComplexity(text);

    var wordTarget = 150;
    if (type === 'TOEFL Independent' || type === 'IELTS Task 2') wordTarget = 250;
    else if (type === 'IELTS Task 1') wordTarget = 150;
    else if (type === 'AP FRQ') wordTarget = 300;

    var taskScore = 0;
    if (wordCount >= wordTarget) taskScore = 25;
    else if (wordCount >= wordTarget * 0.8) taskScore = 20;
    else if (wordCount >= wordTarget * 0.6) taskScore = 15;
    else if (wordCount >= wordTarget * 0.4) taskScore = 10;
    else taskScore = 5;

    if (wordCount < 20) taskScore = 2;

    return taskScore;
  }

  function scoreCoherence(text) {
    var score = 15;
    var connectives = detectConnectives(text);
    var complexity = analyzeSentenceComplexity(text);
    var sentences = countSentences(text);

    if (connectives.count >= 4) score += 5;
    else if (connectives.count >= 2) score += 3;
    else score += 1;

    if (complexity.variety >= 0.3) score += 3;
    else if (complexity.variety >= 0.15) score += 2;
    else score += 1;

    if (sentences < 3) score = Math.max(5, score - 5);

    return Math.min(25, score);
  }

  function scoreLexical(text) {
    var score = 15;
    var diversity = lexicalDiversity(text);
    var wordCount = countWords(text);

    if (diversity >= 0.6) score += 8;
    else if (diversity >= 0.5) score += 6;
    else if (diversity >= 0.4) score += 4;
    else score += 2;

    if (wordCount >= 200 && diversity >= 0.55) score = Math.min(25, score + 2);

    return Math.min(25, score);
  }

  function scoreGrammatical(text) {
    var score = 20;
    var grammar = detectGrammarIssues(text);
    var complexity = analyzeSentenceComplexity(text);

    score -= grammar.count * 2;

    if (complexity.avgLength >= 15 && complexity.avgLength <= 25) score += 3;
    else if (complexity.avgLength >= 10) score += 1;

    if (complexity.complexCount >= 2) score += 2;

    return Math.max(0, Math.min(25, score));
  }

  function generateFeedback(text, type) {
    var feedback = [];
    var wordCount = countWords(text);
    var sentenceCount = countSentences(text);
    var diversity = lexicalDiversity(text);
    var connectives = detectConnectives(text);
    var grammar = detectGrammarIssues(text);
    var complexity = analyzeSentenceComplexity(text);

    feedback.push({ type: 'info', text: '总词数: ' + wordCount + '，句子数: ' + sentenceCount });
    feedback.push({ type: 'info', text: '词汇多样性 (TTR): ' + diversity.toFixed(2) });
    feedback.push({ type: 'info', text: '连接词使用: ' + connectives.count + ' 处' });

    if (grammar.count > 0) {
      feedback.push({ type: 'warning', text: '发现 ' + grammar.count + ' 处语法/格式问题' });
      grammar.issues.slice(0, 5).forEach(function(issue) {
        if (issue.text) feedback.push({ type: 'error', text: '疑似错误: "' + issue.text + '"' });
        else if (issue.words) feedback.push({ type: 'error', text: '疑似拼写错误: ' + issue.words.join(', ') });
        else if (issue.count) feedback.push({ type: 'error', text: issue.type + ': ' + issue.count + ' 处' });
      });
    } else {
      feedback.push({ type: 'success', text: '未检测到明显语法错误' });
    }

    if (connectives.count >= 2) {
      feedback.push({ type: 'success', text: '连接词使用恰当，文章连贯性好' });
    } else {
      feedback.push({ type: 'warning', text: '建议增加连接词使用（however, moreover, for example 等）' });
    }

    if (complexity.complexCount >= 2) {
      feedback.push({ type: 'success', text: '句子结构多样，包含复合句和复杂句' });
    } else {
      feedback.push({ type: 'warning', text: '建议使用更多复合句结构（although, because, while 等引导）' });
    }

    if (diversity >= 0.5) {
      feedback.push({ type: 'success', text: '词汇使用丰富' });
    } else if (diversity >= 0.35) {
      feedback.push({ type: 'info', text: '词汇多样性一般，可尝试使用更多高级词汇' });
    } else {
      feedback.push({ type: 'warning', text: '词汇重复率偏高，建议扩大词汇量' });
    }

    return feedback;
  }

  function grade(text, type) {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        feedback: [{ type: 'error', text: '请输入要批改的文本' }],
        rubric: {
          taskResponse: 0,
          coherenceCohesion: 0,
          lexicalResource: 0,
          grammaticalRange: 0
        }
      };
    }

    if (!type || GRADING_TYPES.indexOf(type) < 0) {
      type = 'TOEFL Independent';
    }

    var taskResponse = scoreTaskResponse(text, type);
    var coherenceCohesion = scoreCoherence(text);
    var lexicalResource = scoreLexical(text);
    var grammaticalRange = scoreGrammatical(text);

    var totalScore = Math.round(taskResponse + coherenceCohesion + lexicalResource + grammaticalRange);

    return {
      score: totalScore,
      feedback: generateFeedback(text, type),
      rubric: {
        taskResponse: taskResponse,
        coherenceCohesion: coherenceCohesion,
        lexicalResource: lexicalResource,
        grammaticalRange: grammaticalRange
      }
    };
  }

  window.WritingGrader = {
    grade: grade,
    TYPES: GRADING_TYPES,
    _internal: {
      countWords: countWords,
      countSentences: countSentences,
      lexicalDiversity: lexicalDiversity,
      detectConnectives: detectConnectives,
      detectGrammarIssues: detectGrammarIssues,
      analyzeSentenceComplexity: analyzeSentenceComplexity
    }
  };

})();