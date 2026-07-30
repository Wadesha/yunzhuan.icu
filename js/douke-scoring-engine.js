/**
 * 抖科 Douke Scoring Engine v1.0
 * 出题效果打分系统 — 用于测试阶段后台评分和效果展示
 *
 * 核心功能：
 *  1. 题目质量静态评分（每题自带 clarity/optionQuality/difficultyMatch/coverage/discrimination）
 *  2. 答题行为动态评分（正确率/答题时长/选项分布/反馈信号）
 *  3. 推荐引擎效果评分（多样性/难度曲线拟合度/个性化指标）
 *  4. 整体题库健康度评分
 *  5. A/B 多方案并行对比评分面板
 *
 * 所有分数 1-5，最终汇总为 0-100 便于展示
 */
(function() {
  'use strict';

  var Engine = {
    // ---- Data stores ----
    records: [],       // [{cardId, subject, difficulty, correct, dwellMs, userFeedback, ts}]
    config: {
      idealDwellEasy:   8000,   // ms, 简单题理想用时
      idealDwellMedium: 16000,
      idealDwellHard:   30000,
      targetAccEasy:    0.85,   // 简单题目标正确率
      targetAccMedium:  0.65,
      targetAccHard:    0.4
    }
  };

  // ============================================================
  // 1. 题目质量静态评分（Question Quality Score）
  // ============================================================
  Engine.questionQualityScore = function(card) {
    if (!card || !card.score) return { overall: 60, breakdown: null };
    var s = card.score;
    // 5维度各占 20% 权重 → 换算到 0-100
    var weights = { clarity:0.22, optionQuality:0.22, difficultyMatch:0.20, coverage:0.18, discrimination:0.18 };
    var breakdown = {};
    var overall = 0;
    for (var dim in weights) {
      var v = (s[dim] || 3) / 5;        // 1-5 → 0-1
      var scaled = v * 100;              // → 0-100
      breakdown[dim] = Math.round(scaled);
      overall += scaled * weights[dim];
    }
    return { overall: Math.round(overall), breakdown: breakdown };
  };

  // 批量评估题库
  Engine.questionBankQualityReport = function(cards) {
    var self = this;
    if (!cards || !cards.length) return null;
    var scores = cards.map(function(c) { return self.questionQualityScore(c).overall; });
    var sum = scores.reduce(function(a,b){return a+b;}, 0);
    var bySubject = {};
    var byDifficulty = { easy:[], medium:[], hard:[] };
    cards.forEach(function(c) {
      var q = self.questionQualityScore(c).overall;
      if (!bySubject[c.subject]) bySubject[c.subject] = [];
      bySubject[c.subject].push(q);
      if (byDifficulty[c.difficulty]) byDifficulty[c.difficulty].push(q);
    });
    function avg(arr) { return arr.length ? Math.round(arr.reduce(function(a,b){return a+b;},0) / arr.length) : 0; }
    var report = {
      totalCards: cards.length,
      avgOverall: Math.round(sum / scores.length),
      minOverall: Math.min.apply(null, scores),
      maxOverall: Math.max.apply(null, scores),
      grade: this.gradeLetter(Math.round(sum / scores.length)),
      bySubject: {},
      byDifficulty: {
        easy:   avg(byDifficulty.easy),
        medium: avg(byDifficulty.medium),
        hard:   avg(byDifficulty.hard)
      },
      distribution: this.scoreDistribution(scores)
    };
    for (var sub in bySubject) report.bySubject[sub] = avg(bySubject[sub]);
    return report;
  };

  // ============================================================
  // 2. 答题行为动态评分（Behavioral Scoring）
  // ============================================================
  Engine.recordAnswer = function(card, correct, dwellMs, userFeedback) {
    this.records.push({
      cardId: card.id, subject: card.subject, difficulty: card.difficulty,
      correct: correct, dwellMs: dwellMs || 0, userFeedback: userFeedback || null,
      ts: Date.now()
    });
    if (this.records.length > 5000) this.records = this.records.slice(-5000);
  };

  Engine.clearRecords = function() { this.records = []; };

  // 单题行为分（结合正确率和用时，skip 记为 null correct）
  Engine.behaviorScoreForCard = function(cardId) {
    var samples = this.records.filter(function(r) { return r.cardId === cardId; });
    if (samples.length === 0) return null;
    // 区分：answered 样本 vs skip 样本
    var answered = samples.filter(function(r){return r.correct === true || r.correct === false;});
    var skipped = samples.filter(function(r){return r.correct === null || r.correct === undefined;});
    var skipRate = skipped.length / samples.length;
    var acc = answered.length > 0
      ? answered.filter(function(r){return r.correct;}).length / answered.length
      : 0.5; // 全是 skip 的题目，按 0.5 中性处理
    var avgDwell = samples.reduce(function(s,r){return s+(r.dwellMs||0);},0) / samples.length;
    var sampleFirst = samples[0];
    var diff = sampleFirst ? sampleFirst.difficulty : 'medium';
    var target = { easy: this.config.targetAccEasy, medium: this.config.targetAccMedium, hard: this.config.targetAccHard }[diff] || 0.6;
    var idealDwell = { easy:this.config.idealDwellEasy, medium:this.config.idealDwellMedium, hard:this.config.idealDwellHard }[diff] || 15000;

    // Accuracy vs target: 命中target得满分，过高（题太简单）或过低（题过难）都扣分
    var accGap = Math.abs(acc - target);
    var accScore = Math.max(0, 100 - accGap * 200); // 每差5%扣10分

    // Dwell vs ideal: 偏离程度 → 0-100
    var dwellRatio = avgDwell / idealDwell;
    var dwellScore;
    if (dwellRatio < 0.3) dwellScore = 30;   // 秒选 = 没认真做
    else if (dwellRatio < 1) dwellScore = 100; // 比理想快没问题
    else if (dwellRatio < 2) dwellScore = 100 - (dwellRatio - 1) * 60; // 略慢减分
    else dwellScore = Math.max(10, 40 - (dwellRatio - 2) * 30); // 太慢 = 题目不清晰/太难

    // 综合：行为健康度 = 55% 合适的正确率 + 45% 用时合理性
    var overall = accScore * 0.55 + dwellScore * 0.45;

    // skip 率惩罚：高 skip 率说明题目不受欢迎（太难/不相关/无聊）→ 降分
    if (skipRate > 0) {
      overall = overall * (1 - skipRate * 0.4); // skip 率 100% → 行为分打 6 折
    }

    // 用户反馈加权（太简单/太难扣分，正好加分）
    var fbHits = samples.filter(function(r){return r.userFeedback;});
    if (fbHits.length) {
      var okRatio = fbHits.filter(function(r){return r.userFeedback==='ok';}).length / fbHits.length;
      var hardRatio = fbHits.filter(function(r){return r.userFeedback==='hard';}).length / fbHits.length;
      var easyRatio = fbHits.filter(function(r){return r.userFeedback==='easy';}).length / fbHits.length;
      var fbAdj = (okRatio - hardRatio*0.6 - easyRatio*0.3) * 20;
      overall = Math.min(100, Math.max(0, overall + fbAdj));
    }

    return {
      sampleSize: samples.length,
      answeredCount: answered.length,
      skipCount: skipped.length,
      skipRate: Math.round(skipRate*100),
      accuracy: Math.round(acc*100),
      targetAccuracy: Math.round(target*100),
      avgDwellMs: Math.round(avgDwell),
      idealDwellMs: idealDwell,
      overall: Math.round(overall)
    };
  };

  // ============================================================
  // 3. 推荐引擎效果评分（Recommender Effectiveness）
  // ============================================================
  Engine.recommenderScore = function(historyCardIds, fullCards) {
    if (!historyCardIds || historyCardIds.length < 5) return null;
    var self = this;
    var hist = historyCardIds.map(function(id) {
      return fullCards.find(function(c) { return c.id === id; });
    }).filter(Boolean);
    if (hist.length < 5) return null;

    // 3.1 类型多样性（避免连续同类型/同科目/同难度）
    var subjectTransitions = 0, difficultyTransitions = 0;
    for (var i = 1; i < hist.length; i++) {
      if (hist[i].subject !== hist[i-1].subject) subjectTransitions++;
      if (hist[i].difficulty !== hist[i-1].difficulty) difficultyTransitions++;
    }
    var stScore = (subjectTransitions / (hist.length-1)) * 100;
    var dtScore = (difficultyTransitions / (hist.length-1)) * 100;
    var diversityScore = stScore * 0.55 + dtScore * 0.45;

    // 3.2 难度曲线平滑度（不应突跳）
    var order = { easy:1, medium:2, hard:3 };
    var diffJumps = 0;
    for (var j = 1; j < hist.length; j++) {
      var gap = Math.abs((order[hist[j].difficulty]||2) - (order[hist[j-1].difficulty]||2));
      if (gap >= 2) diffJumps++;
    }
    var curveScore = Math.max(0, 100 - (diffJumps / (hist.length-1)) * 100);

    // 3.3 新鲜度（重复少）
    var unique = {}; hist.forEach(function(c){ unique[c.id]=true; });
    var freshnessScore = (Object.keys(unique).length / hist.length) * 100;

    // 3.4 实际命中率（正确率是否趋稳在目标区间）
    var recs = this.records.slice(-hist.length);
    var accuracyScore = 60;
    if (recs.length >= 5) {
      var acc = recs.filter(function(r){return r.correct;}).length / recs.length;
      // 理想区间 55%-80%
      if (acc >= 0.55 && acc <= 0.80) accuracyScore = 100;
      else accuracyScore = Math.max(30, 100 - Math.abs(acc - 0.675) * 250);
    }

    var overall = diversityScore * 0.30 + curveScore * 0.25 + freshnessScore * 0.20 + accuracyScore * 0.25;

    return {
      sampleSize: hist.length,
      diversity:    Math.round(diversityScore),
      curveSmooth:  Math.round(curveScore),
      freshness:    Math.round(freshnessScore),
      accuracyFit:  Math.round(accuracyScore),
      overall:      Math.round(overall),
      grade:        this.gradeLetter(Math.round(overall))
    };
  };

  // ============================================================
  // 4. 整体题库健康度（Bank Health）
  // ============================================================
  Engine.bankHealthScore = function(cards) {
    var qr = this.questionBankQualityReport(cards);
    if (!qr) return null;

    // 4.1 覆盖率（各科目/各难度分布均衡）
    var countBySubj = {}, countByDiff = {easy:0, medium:0, hard:0};
    cards.forEach(function(c) {
      if (!countBySubj[c.subject]) countBySubj[c.subject] = 0;
      countBySubj[c.subject]++;
      if (countByDiff[c.difficulty] != null) countByDiff[c.difficulty]++;
    });
    var subjCount = Object.keys(countBySubj).length;
    var total = cards.length;
    // 科目分布方差越小越好
    var subjAvg = total / Math.max(1, subjCount);
    var subjVarianceSum = 0;
    for (var s in countBySubj) subjVarianceSum += Math.pow(countBySubj[s] - subjAvg, 2);
    var subjStd = Math.sqrt(subjVarianceSum / subjCount);
    var coverageSubj = Math.max(0, 100 - (subjStd / subjAvg) * 50);

    // 难度分布目标比例 5:4:1 (easy 50%, medium 40%, hard 10%)
    var diffTarget = { easy:0.50, medium:0.40, hard:0.10 };
    var diffFitErr = 0;
    for (var d in diffTarget) {
      var actual = countByDiff[d] / total;
      diffFitErr += Math.abs(actual - diffTarget[d]);
    }
    var coverageDiff = Math.max(0, 100 - diffFitErr * 120);

    var coverageScore = coverageSubj * 0.55 + coverageDiff * 0.45;

    // 4.2 质量均值（已经算）
    var qualityScore = qr.avgOverall;

    // 4.3 题量充足性（每科目至少 30 题为满分）
    var suffPerSubject = 0;
    var subjects = Object.keys(countBySubj);
    subjects.forEach(function(s) {
      var score = Math.min(100, countBySubj[s] / 30 * 100);
      suffPerSubject += score;
    });
    var suffScore = subjects.length ? suffPerSubject / subjects.length : 0;

    var overall = qualityScore * 0.45 + coverageScore * 0.30 + suffScore * 0.25;
    return {
      totalCards: total,
      subjectCount: subjCount,
      countBySubject: countBySubj,
      countByDifficulty: countByDiff,
      qualityAvg: qualityScore,
      coverage:   Math.round(coverageScore),
      sufficiency:Math.round(suffScore),
      overall:    Math.round(overall),
      grade:      this.gradeLetter(Math.round(overall))
    };
  };

  // ============================================================
  // 5. A/B 方案并行对比评分
  // ============================================================
  /**
   * 模拟多个推荐策略，输出对比报告
   * strategies: [{name, getNextCard(cards, history)}]
   */
  Engine.simulateAB = function(cards, strategies, sessionLength) {
    var self = this;
    sessionLength = sessionLength || 50;
    var results = [];
    strategies.forEach(function(strat) {
      // 模拟一个会话
      var history = [];
      var virtualAnswers = [];
      var virtualProfile = { accuracy: {} };
      for (var step = 0; step < sessionLength; step++) {
        var card = strat.getNextCard(cards, history, virtualProfile);
        if (!card) break;
        history.push(card.id);
        // 模拟答题：按难度+历史正确率生成虚拟结果
        var diffKey = card.subject + '.' + card.difficulty;
        var prof = virtualProfile.accuracy[diffKey] || {correct:0, total:0};
        var expectedAcc = { easy: 0.78 + Math.random()*0.15, medium: 0.55 + Math.random()*0.20, hard: 0.35 + Math.random()*0.15 }[card.difficulty] || 0.6;
        var correct = Math.random() < expectedAcc;
        if (correct) prof.correct++; prof.total++;
        virtualProfile.accuracy[diffKey] = prof;
        var dwell = { easy:7000+Math.random()*5000, medium:14000+Math.random()*8000, hard:25000+Math.random()*15000 }[card.difficulty] || 15000;
        virtualAnswers.push({cardId:card.id, correct:correct, dwellMs:Math.round(dwell), subject:card.subject, difficulty:card.difficulty});
      }
      // 使用引擎评分
      var savedRecs = self.records;
      self.records = virtualAnswers;
      var recScore = self.recommenderScore(history, cards);
      self.records = savedRecs;
      // 计算该策略的会话质量
      var sessionAcc = virtualAnswers.filter(function(a){return a.correct;}).length / Math.max(1, virtualAnswers.length);
      results.push({
        strategy: strat.name,
        cardsSeen: history.length,
        uniqueCards: Object.keys(history.reduce(function(o,id){o[id]=1;return o;},{})).length,
        sessionAccuracy: Math.round(sessionAcc*100),
        recommenderScore: recScore ? recScore.overall : 0,
        breakdown: recScore,
        rankScore: recScore ? Math.round(recScore.overall * 0.6 + Math.min(100, sessionAcc*100) * 0.4) : 0
      });
    });
    results.sort(function(a,b){return b.rankScore - a.rankScore;});
    results.forEach(function(r, i) { r.rank = i+1; });
    return results;
  };

  // ============================================================
  // 6. 辅助：评级字母 / 分数段分布 / Dashboard HTML
  // ============================================================
  Engine.gradeLetter = function(score) {
    if (score >= 93) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 87) return 'A-';
    if (score >= 83) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 77) return 'B-';
    if (score >= 73) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 67) return 'C-';
    if (score >= 60) return 'D';
    return 'F';
  };

  Engine.scoreDistribution = function(scores) {
    var buckets = {'90-100':0,'80-89':0,'70-79':0,'60-69':0,'<60':0};
    scores.forEach(function(s) {
      if (s >= 90) buckets['90-100']++;
      else if (s >= 80) buckets['80-89']++;
      else if (s >= 70) buckets['70-79']++;
      else if (s >= 60) buckets['60-69']++;
      else buckets['<60']++;
    });
    return buckets;
  };

  // 生成 Dashboard HTML 字符串（方便插入页面展示打分系统）
  Engine.renderDashboard = function(cards, options) {
    options = options || {};
    var self = this;
    var qr = this.questionBankQualityReport(cards);
    var bh = this.bankHealthScore(cards);
    var histIds = options.historyIds || [];
    var rec = this.recommenderScore(histIds, cards);
    var html = [];
    html.push('<div class="dk-dashboard" style="font-family:inherit;padding:16px;color:var(--dk-text,#e8e8e8);">');
    html.push('<h3 style="margin:0 0 12px;font-size:18px;">📊 出题效果打分系统 · Scoring Dashboard</h3>');
    if (qr) {
      html.push(this._renderCard('题库质量 (Question Quality)', [
        ['平均分', qr.avgOverall + ' / 100 · ' + qr.grade],
        ['题目数', qr.totalCards + ' 题'],
        ['最低 / 最高', qr.minOverall + ' / ' + qr.maxOverall]
      ], qr.grade));
      html.push('<div style="margin:8px 0 14px;"><strong>分数分布:</strong> ');
      for (var bk in qr.distribution) {
        html.push('<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 8px;border-radius:6px;background:rgba(255,255,255,.06);font-size:12px;">' +
          bk + ': ' + qr.distribution[bk] + '</span>');
      }
      html.push('</div>');
      var subjRows = [];
      for (var ss in qr.bySubject) subjRows.push([ss.toUpperCase(), qr.bySubject[ss] + ' / 100']);
      subjRows.push(['简单题', qr.byDifficulty.easy + '']);
      subjRows.push(['中等题', qr.byDifficulty.medium + '']);
      subjRows.push(['困难题', qr.byDifficulty.hard + '']);
      html.push(this._renderMiniTable('各科目/难度 质量均分', subjRows));
    }
    if (bh) {
      html.push(this._renderCard('题库健康度 (Bank Health)', [
        ['整体评分', bh.overall + ' / 100 · ' + bh.grade],
        ['题目质量 (45%)', bh.qualityAvg + ''],
        ['覆盖均衡 (30%)', bh.coverage + ''],
        ['题量充足 (25%)', bh.sufficiency + '']
      ], bh.grade));
      var diffRows = [];
      for (var d in bh.countByDifficulty) diffRows.push([d, bh.countByDifficulty[d] + ' 题']);
      var subj2Rows = [];
      for (var s2 in bh.countBySubject) subj2Rows.push([s2.toUpperCase(), bh.countBySubject[s2] + ' 题']);
      html.push(this._renderMiniTable('难度分布 (目标 50%/40%/10%)', diffRows));
      html.push(this._renderMiniTable('科目分布', subj2Rows));
    }
    if (rec) {
      html.push(this._renderCard('推荐引擎效果 (Recommender)', [
        ['综合分', rec.overall + ' / 100 · ' + rec.grade],
        ['多样性 Diverse', rec.diversity + ''],
        ['难度曲线 Smooth', rec.curveSmooth + ''],
        ['新鲜度 Fresh', rec.freshness + ''],
        ['正确率适配 Fit', rec.accuracyFit + '']
      ], rec.grade));
    } else if (histIds.length < 5) {
      html.push('<div style="margin:8px 0;padding:10px 12px;border-radius:10px;background:rgba(249,177,21,.1);border-left:3px solid var(--yellow,#f9b115);font-size:13px;">');
      html.push('💡 完成 5+ 次滑动答题后，此处将展示推荐引擎效果评分。');
      html.push('</div>');
    }
    html.push('</div>');
    return html.join('');
  };

  Engine._renderCard = function(title, rows, grade) {
    var color = this._gradeColor(grade);
    var html = ['<div style="margin:10px 0;padding:14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);">'];
    html.push('<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">');
    html.push('<strong style="font-size:14px;">' + title + '</strong>');
    if (grade) html.push('<span style="font-weight:800;color:' + color + ';background:' + color + '22;padding:3px 10px;border-radius:8px;">' + grade + '</span>');
    html.push('</div>');
    rows.forEach(function(r) {
      html.push('<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;"><span style="color:#aaa;">' + r[0] + '</span><strong>' + r[1] + '</strong></div>');
    });
    html.push('</div>');
    return html.join('');
  };

  Engine._renderMiniTable = function(title, rows) {
    var html = ['<div style="margin:8px 0 12px;"><div style="font-size:12px;color:#aaa;margin-bottom:4px;">' + title + '</div>'];
    html.push('<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 14px;">');
    rows.forEach(function(r) {
      html.push('<div style="display:flex;justify-content:space-between;padding:3px 8px;font-size:12px;background:rgba(255,255,255,.03);border-radius:4px;"><span>' + r[0] + '</span><strong>' + r[1] + '</strong></div>');
    });
    html.push('</div></div>');
    return html.join('');
  };

  Engine._gradeColor = function(g) {
    if (!g) return '#888';
    if (g.indexOf('A') === 0) return '#00d4aa';
    if (g.indexOf('B') === 0) return '#4e8aff';
    if (g.indexOf('C') === 0) return '#f9b115';
    return '#e94560';
  };

  // ============================================================
  // 7. 导出 / 持久化
  // ============================================================
  Engine.saveToStorage = function() {
    try {
      localStorage.setItem('douke_scoring_records', JSON.stringify(this.records));
    } catch(e) {}
  };
  Engine.loadFromStorage = function() {
    try {
      var raw = localStorage.getItem('douke_scoring_records');
      if (raw) this.records = JSON.parse(raw);
    } catch(e) {}
  };
  Engine.exportAll = function() {
    return JSON.stringify({
      records: this.records,
      config: this.config,
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  window.DoukeScoring = Engine;
})();
