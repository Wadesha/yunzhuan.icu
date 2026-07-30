/**
 * 抖科 Douke Variant Engine v1.0
 * 题目变体生成引擎 — 基于模板题的模式匹配 + 数值替换 + 答案重算
 *
 * 原理：每道数学题都有固定结构（"What is X + Y?"），
 *       只需替换数值并重算答案和干扰项，即可生成无限相似题目。
 *
 * 覆盖 15 种常见题型模式（加减乘除、方程、几何、概率等）
 * 无法匹配的题（阅读理解、语法题）返回 null，不生成变体
 *
 * 参考文献：
 *   - ε-greedy exploration/exploitation (Sutton & Barto, RL)
 *   - Content-based recommendation for cold-start (Lops et al., 2019)
 */
(function() {
  'use strict';

  var VE = {};

  // ============================================================
  // 工具函数
  // ============================================================

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function unique(arr) {
    var seen = {};
    return arr.filter(function(v) {
      var key = String(v);
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  /**
   * 生成 4 个选项（1 正确 + 3 干扰项），打乱后返回
   * @param {number} correct - 正确答案数值
   * @param {number[]} rawDistractors - 干扰项候选池
   * @returns {{choices: string[], answer: number}}
   */
  function buildChoices(correct, rawDistractors) {
    // 去重 + 排除正确答案
    var pool = unique(rawDistractors).filter(function(d) { return d !== correct; });
    // 补充兜底干扰项
    while (pool.length < 3) {
      var delta = randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
      var d = correct + delta;
      if (d !== correct && pool.indexOf(d) < 0 && d > 0) pool.push(d);
    }
    var distractors = pool.slice(0, 3);
    var all = shuffle(distractors.concat([correct]));
    var answerIdx = all.indexOf(correct);
    return {
      choices: all.map(String),
      answer: answerIdx
    };
  }

  // 按难度确定数值范围
  function rangeFor(difficulty) {
    return {
      easy:   { min: 5,  max: 25 },
      medium: { min: 10, max: 50 },
      hard:   { min: 20, max: 100 }
    }[difficulty] || { min: 5, max: 30 };
  }

  // ============================================================
  // 题型模式定义（15 种）
  // 每个模式：{ name, match(question)->bool, generate(template)->variantData }
  // ============================================================

  VE.patterns = [

    // 1. 加法 "What is X + Y?"
    {
      name: 'addition',
      match: function(q) { return /^What is (\d+) \+ (\d+)\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var a = randInt(r.min, r.max), b = randInt(r.min, r.max);
        var ans = a + b;
        return {
          question: 'What is ' + a + ' + ' + b + '?',
          explanation: a + ' + ' + b + ' = ' + ans + '.',
          correct: ans,
          distractors: [ans - 1, ans + 2, ans + 1, Math.abs(a - b)]
        };
      }
    },

    // 2. 乘法 "What is X × Y?"
    {
      name: 'multiplication',
      match: function(q) { return /^What is (\d+) [×x]\s*(\d+)\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var a = randInt(Math.max(2, r.min), Math.min(12, r.max));
        var b = randInt(Math.max(2, r.min), Math.min(12, r.max));
        var ans = a * b;
        return {
          question: 'What is ' + a + ' × ' + b + '?',
          explanation: a + ' × ' + b + ' = ' + ans + '.',
          correct: ans,
          distractors: [ans + a, ans - b, ans + 1, a + b]
        };
      }
    },

    // 3. 减法 "What is X - Y?"
    {
      name: 'subtraction',
      match: function(q) { return /^What is (\d+) - (\d+)\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var a = randInt(r.min + 5, r.max + 10), b = randInt(1, r.min);
        var ans = a - b;
        return {
          question: 'What is ' + a + ' - ' + b + '?',
          explanation: a + ' - ' + b + ' = ' + ans + '.',
          correct: ans,
          distractors: [ans + 1, ans - 1, a + b, ans + 2]
        };
      }
    },

    // 4. 除法 "What is X ÷ Y?"
    {
      name: 'division',
      match: function(q) { return /^What is (\d+) [÷/]\s*(\d+)\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var b = randInt(2, Math.min(9, r.max));
        var ans = randInt(2, Math.min(12, r.max));
        var a = b * ans; // 保证整除
        return {
          question: 'What is ' + a + ' ÷ ' + b + '?',
          explanation: a + ' ÷ ' + b + ' = ' + ans + '.',
          correct: ans,
          distractors: [ans + 1, ans - 1, a / (b + 1) | 0, ans + b]
        };
      }
    },

    // 5. 线性方程 "Solve: Ax = B. x = ?"
    {
      name: 'linear_eq',
      match: function(q) { return /Solve:\s*(\d+)x\s*=\s*(\d+)/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var x = randInt(2, Math.min(9, r.max));
        var b = x * randInt(2, Math.min(9, r.max));
        var a = b / x;
        return {
          question: 'Solve: ' + a + 'x = ' + b + '. x = ?',
          explanation: 'x = ' + b + ' ÷ ' + a + ' = ' + x + '.',
          correct: x,
          distractors: [x + 1, x - 1, a + b, b - a]
        };
      }
    },

    // 6. 方程组 "x + y = A; x - y = B. Solve x."
    {
      name: 'system_eq',
      match: function(q) { return /x \+ y = (\d+).*x - y = (\d+)/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var x = randInt(3, Math.min(15, r.max));
        var y = randInt(1, x - 1);
        var sum = x + y, diff = x - y;
        return {
          question: 'x + y = ' + sum + '; x - y = ' + diff + '. Solve x.',
          explanation: 'Add: 2x = ' + (sum + diff) + ' → x = ' + x + ', y = ' + y + '.',
          correct: x,
          distractors: [y, x + 1, x - 1, sum - x]
        };
      }
    },

    // 7. 三角形面积 "Area of triangle with base X, height Y:"
    {
      name: 'triangle_area',
      match: function(q) { return /base (\d+).*height (\d+)/i.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var base = randInt(3, Math.min(15, r.max));
        var height = randInt(3, Math.min(15, r.max));
        var ans = base * height / 2;
        return {
          question: 'Area of triangle with base ' + base + ', height ' + height + ':',
          explanation: 'A = ½ × ' + base + ' × ' + height + ' = ' + ans + '.',
          correct: ans,
          distractors: [base * height, ans + 1, ans - 1, base + height]
        };
      }
    },

    // 8. 勾股定理 "Right triangle legs X, Y. Hypotenuse?"
    {
      name: 'pythagorean',
      match: function(q) { return /legs (\d+).*(\d+)/i.test(q) && /hypotenuse/i.test(q); },
      generate: function(t) {
        // 用常见勾股数保证整数答案
        var triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[7,24,25],[9,12,15],[9,40,41],[10,24,26]];
        var tp = triples[randInt(0, triples.length - 1)];
        var scale = t.difficulty === 'hard' ? randInt(2, 3) : 1;
        var a = tp[0] * scale, b = tp[1] * scale, c = tp[2] * scale;
        return {
          question: 'Right triangle legs ' + a + ', ' + b + '. Hypotenuse?',
          explanation: a + '² + ' + b + '² = ' + (a*a+b*b) + ' = ' + c + '². Hypotenuse = ' + c + '.',
          correct: c,
          distractors: [c + 1, c - 1, a + b, Math.round(Math.sqrt(a*a+b*b)+1)]
        };
      }
    },

    // 9. 圆 "Circle area Aπ. Circumference = ?"
    {
      name: 'circle',
      match: function(q) { return /area (\d+)π/i.test(q) && /circumference/i.test(q); },
      generate: function(t) {
        var r2 = randInt(4, 25); // r²
        var r = Math.sqrt(r2);
        if (r !== Math.floor(r)) {
          r2 = randInt(2, 8) * randInt(2, 8); // 保证 r 是整数
          r = Math.sqrt(r2);
        }
        var area = r2;
        var circ = 2 * r;
        return {
          question: 'Circle area ' + area + 'π. Circumference = ?',
          explanation: 'πr² = ' + area + 'π → r = ' + r + '. C = 2πr = ' + circ + 'π.',
          correct: circ,
          distractors: [r, area, circ * 2, circ + 1],
          isPi: true
        };
      }
    },

    // 10. 韦达定理 "x² - Ax + B = 0. Sum of roots?"
    {
      name: 'vieta_sum',
      match: function(q) { return /x²\s*-\s*(\d+)x\s*\+\s*(\d+)\s*=\s*0.*sum/i.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        // 选两个整数根，反推方程
        var root1 = randInt(1, Math.min(8, r.max));
        var root2 = randInt(1, Math.min(8, r.max));
        var sum = root1 + root2; // = b
        var product = root1 * root2; // = c
        return {
          question: 'x² - ' + sum + 'x + ' + product + ' = 0. Sum of roots?',
          explanation: 'Vieta: sum = b/a = ' + sum + ' (roots ' + root1 + ', ' + root2 + ').',
          correct: sum,
          distractors: [-sum, product, sum + 1, sum - 1]
        };
      }
    },

    // 11. 百分比 "What is X% of Y?"
    {
      name: 'percentage',
      match: function(q) { return /(\d+)%\s*of\s*(\d+)/i.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        // 保证答案是整数
        var pct = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80][randInt(0, 10)];
        var base = randInt(4, Math.min(20, r.max)) * (100 / pct | 0 || 1);
        base = Math.round(base / (100 / pct)) * (100 / pct);
        var ans = pct * base / 100;
        return {
          question: 'What is ' + pct + '% of ' + base + '?',
          explanation: pct + '% × ' + base + ' = ' + ans + '.',
          correct: ans,
          distractors: [base - ans, ans + base / 4 | 0, ans + 1, base / 10 | 0]
        };
      }
    },

    // 12. 平方 "What is X²?"
    {
      name: 'square',
      match: function(q) { return /^What is (\d+)²\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var n = randInt(3, Math.min(12, r.max));
        var ans = n * n;
        return {
          question: 'What is ' + n + '²?',
          explanation: n + '² = ' + n + ' × ' + n + ' = ' + ans + '.',
          correct: ans,
          distractors: [n * 2, ans + n, ans - n, ans + 1]
        };
      }
    },

    // 13. 平方根 "What is √X?"
    {
      name: 'sqrt',
      match: function(q) { return /^What is √(\d+)\?$/.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var n = randInt(3, Math.min(12, r.max));
        var ans = n;
        var sq = n * n;
        return {
          question: 'What is √' + sq + '?',
          explanation: '√' + sq + ' = ' + n + ' (since ' + n + '² = ' + sq + ').',
          correct: ans,
          distractors: [ans + 1, ans - 1, sq / 2 | 0, ans * 2]
        };
      }
    },

    // 14. 计数 "How many integers 1 through N inclusive are divisible by D?"
    {
      name: 'counting',
      match: function(q) { return /integers 1 through (\d+).*divisible by (\d+)/i.test(q); },
      generate: function(t) {
        var r = rangeFor(t.difficulty);
        var d = randInt(2, 7);
        var n = d * randInt(5, Math.min(12, r.max));
        var ans = Math.floor(n / d);
        return {
          question: 'How many integers 1 through ' + n + ' inclusive are divisible by ' + d + '?',
          explanation: 'Multiples of ' + d + ' up to ' + n + ': floor(' + n + '/' + d + ') = ' + ans + '.',
          correct: ans,
          distractors: [ans - 1, ans + 1, n / (d + 1) | 0, d]
        };
      }
    },

    // 15. 排列组合 "C(N, K) = ?"
    {
      name: 'combination',
      match: function(q) { return /C\((\d+),\s*(\d+)\)/.test(q); },
      generate: function(t) {
        var n = randInt(4, 8);
        var k = randInt(2, Math.min(n - 1, 4));
        var ans = factorial(n) / (factorial(k) * factorial(n - k));
        return {
          question: 'C(' + n + ', ' + k + ') = ?',
          explanation: 'C(' + n + ',' + k + ') = ' + n + '!/(' + k + '!·' + (n-k) + '!) = ' + ans + '.',
          correct: ans,
          distractors: [ans + 1, ans - 1, n * k, factorial(n) / factorial(k)]
        };
      }
    }
  ];

  function factorial(n) {
    var f = 1;
    for (var i = 2; i <= n; i++) f *= i;
    return f;
  }

  // ============================================================
  // 核心接口
  // ============================================================

  /**
   * 判断模板题是否可以生成变体
   */
  VE.canGenerate = function(template) {
    if (!template || !template.question) return false;
    return VE.patterns.some(function(p) { return p.match(template.question); });
  };

  /**
   * 生成单个变体
   * @param {Object} template - 模板题（来自题库）
   * @returns {Object|null} 变体题（带 parentTemplateId），不匹配返回 null
   */
  VE.generateVariant = function(template) {
    for (var i = 0; i < VE.patterns.length; i++) {
      var p = VE.patterns[i];
      if (p.match(template.question)) {
        var data = p.generate(template);
        if (!data) return null;

        // 构建选项
        var ch = buildChoices(data.correct, data.distractors);

        // 如果是 π 相关题，给选项加 π 后缀
        var choices = ch.choices;
        if (data.isPi) {
          choices = ch.choices.map(function(c) {
            return c === '0' ? '0' : c + 'π';
          });
        }

        return {
          id: template.id + '-v' + Date.now().toString(36) + randInt(10, 99),
          type: 'question',
          subject: template.subject,
          topicCode: template.topicCode,
          topic: template.topic,
          difficulty: template.difficulty,
          weight: template.weight || 10,
          question: data.question,
          choices: choices,
          answer: ch.answer,
          explanation: data.explanation,
          score: template.score || null,
          expectedTime: template.expectedTime || null,
          parentTemplateId: template.id,
          isVariant: true
        };
      }
    }
    return null;
  };

  /**
   * 批量生成变体
   * @param {Object} template - 模板题
   * @param {number} count - 生成数量
   * @returns {Object[]} 变体数组（可能少于 count，如果模板不匹配则为空）
   */
  VE.generateVariants = function(template, count) {
    var variants = [];
    var seen = {}; // 去重：相同 question 只保留一个
    var attempts = 0;
    var maxAttempts = count * 3; // 允许重试
    while (variants.length < count && attempts < maxAttempts) {
      attempts++;
      var v = VE.generateVariant(template);
      if (v && !seen[v.question]) {
        seen[v.question] = true;
        variants.push(v);
      }
    }
    return variants;
  };

  /**
   * 为一批模板题生成变体池
   * @param {Object[]} templates - 模板题数组
   * @param {number} perTemplate - 每题生成几个变体
   * @returns {Object[]} 所有变体
   */
  VE.expandPool = function(templates, perTemplate) {
    var pool = [];
    templates.forEach(function(t) {
      var vs = VE.generateVariants(t, perTemplate);
      pool = pool.concat(vs);
    });
    return pool;
  };

  /**
   * 统计：题库中有多少题可以生成变体
   */
  VE.analyzePool = function(templates) {
    var matchable = 0;
    var byPattern = {};
    templates.forEach(function(t) {
      for (var i = 0; i < VE.patterns.length; i++) {
        if (VE.patterns[i].match(t.question)) {
          matchable++;
          var name = VE.patterns[i].name;
          byPattern[name] = (byPattern[name] || 0) + 1;
          break;
        }
      }
    });
    return {
      total: templates.length,
      matchable: matchable,
      coverage: Math.round(matchable / templates.length * 100) + '%',
      byPattern: byPattern
    };
  };

  // ============================================================
  // 偏好/愉悦度引擎（Enjoyment Engine）
  // ============================================================

  /**
   * 愉悦度评分体系（0-1）
   *
   * 理论基础：
   *   - 心流理论(Csikszentmihalyi)：能力与挑战匹配时最愉悦
   *   - ε-greedy exploration/exploitation (Sutton & Barto)
   *   - 用户"做得又快又对" = 高愉悦度信号
   *
   * 公式：
   *   enjoyment = accuracy × 0.30      // 做对率（能力信号）
   *             + speedScore × 0.25    // 速度（实际/预期用时比值，越快越高）
   *             + nonSkipRate × 0.20   // 不跳过率（投入信号）
   *             + streakScore × 0.15   // 连续做对（信心信号）
   *             + bookmarkBonus × 0.10 // 收藏（显式偏好）
   *
   * 速度分 speedScore = clamp(1.5 - ratio, 0, 1)
   *   ratio < 0.5（秒选）→ 1.0 满分
   *   ratio = 1.0（正常）→ 0.5
   *   ratio > 1.5（苦战）→ 0.0
   */

  VE.enjoymentScore = function(stats) {
    // stats = { correct, total, skipTotal, shownTotal, dwellSum, expectedSum, streak, bookmarked }
    if (!stats || stats.shownTotal === 0) return null;

    var accuracy = stats.total > 0 ? stats.correct / stats.total : 0.5;
    var nonSkipRate = stats.shownTotal > 0 ? 1 - (stats.skipTotal / stats.shownTotal) : 0.5;

    // 速度分：实际用时 vs 预期用时
    var ratio = (stats.expectedSum > 0 && stats.dwellSum > 0)
      ? (stats.dwellSum / 1000) / stats.expectedSum
      : 1.0;
    var speedScore = Math.max(0, Math.min(1, 1.5 - ratio));

    var streakScore = Math.min(1, (stats.streak || 0) / 5);
    var bookmarkBonus = stats.bookmarked ? 1 : 0;

    return Math.round(
      (accuracy * 0.30 + speedScore * 0.25 + nonSkipRate * 0.20 +
       streakScore * 0.15 + bookmarkBonus * 0.10) * 100
    ) / 100;
  };

  /**
   * 冷启动预设愉悦度（模拟数据）
   * 新用户无行为数据时，按难度预设偏好：
   *   easy → 0.65（大多数用户初始喜欢简单题）
   *   medium → 0.45
   *   hard → 0.25
   * 随真实数据积累（sampleSize >= 3），逐步用真实分替代
   */
  VE.mockEnjoyment = function(difficulty) {
    return { easy: 0.65, medium: 0.45, hard: 0.25 }[difficulty] || 0.50;
  };

  /**
   * ε-greedy 探索率（带衰减）
   * 参考：Explore-then-commit + epsilon-greedy (Sutton & Barto)
   *
   * 初始 ε=0.30（30% 探索新题目）
   * 每答 1 题衰减 0.005
   * 下限 ε=0.15（长期保持 15% 探索，避免信息茧房）
   */
  VE.computeEpsilon = function(totalAnswered) {
    return Math.max(0.15, 0.30 - totalAnswered * 0.005);
  };

  window.DoukeVariantEngine = VE;
})();
