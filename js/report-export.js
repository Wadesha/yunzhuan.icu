/* ================================================================
 * report-export.js v54
 * 学习报告导出 (PDF/Markdown/JSON)
 *
 * API:
 *   window.Report.generate({subjects, dateRange, format})  生成报告
 *     - subjects:  array, 留空 = 全部
 *     - dateRange: {from: 'YYYY-MM-DD', to: 'YYYY-MM-DD'} 留空 = 全部
 *     - format:    'json' | 'markdown' | 'html'
 *
 *   window.Report.download(report)        触发下载
 *   window.Report.history()                历史报告
 *   window.Report.getReport(reportId)      读取历史
 *   window.Report.deleteReport(reportId)   删除
 *   window.Report.getCurrentSubjects()     8 科当前数据源
 *   window.Report.formatJson|markdown|html
 * ================================================================ */
(function() {
  'use strict';

  var REPORT_HISTORY_KEY = 'yz_report_history';
  var SUBJECT_NAMES = {
    sat: 'SAT', act: 'ACT', ap: 'AP', ib: 'IB',
    alevel: 'A-Level', toefl: 'TOEFL', ielts: 'IELTS', igcse: 'IGCSE'
  };

  function lsGet(key, def) {
    try { var raw = localStorage.getItem(key); if (raw === null) return def; return JSON.parse(raw); } catch(e) { return def; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  // ============== 数据源 ==============
  function loadPracticeData() {
    return lsGet('yz_practice_data', { records: {} });
  }
  function loadSrsData() {
    return lsGet('yz_srs_data', {});
  }
  function loadPremiumAnswers() {
    return lsGet('yz_premium_answers', {});
  }
  function loadStreak() {
    return lsGet('yz_streak_data', null);
  }

  // ============== 数据聚合 ==============
  function inDateRange(ts, range) {
    if (!range || (!range.from && !range.to)) return true;
    var d = new Date(ts);
    var dStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    if (range.from && dStr < range.from) return false;
    if (range.to && dStr > range.to) return false;
    return true;
  }

  function aggregate(opts) {
    opts = opts || {};
    var subjects = opts.subjects && opts.subjects.length > 0 ? opts.subjects : Object.keys(SUBJECT_NAMES);
    var range = opts.dateRange;

    var practice = loadPracticeData();
    var srs = loadSrsData();
    var premium = loadPremiumAnswers();

    var perSubj = {};
    subjects.forEach(function(s) {
      perSubj[s] = {
        subject: s,
        subjectName: SUBJECT_NAMES[s] || s,
        total: 0,
        correct: 0,
        records: [],
        topicStats: {},
        wrongQuestions: []
      };
    });

    // yz_practice_data
    Object.keys(practice.records || {}).forEach(function(subj) {
      if (subjects.indexOf(subj) < 0) return;
      var recs = practice.records[subj] || {};
      Object.keys(recs).forEach(function(qid) {
        var r = recs[qid];
        if (!inDateRange(r.ts, range)) return;
        perSubj[subj].total++;
        if (r.correct) perSubj[subj].correct++;
        perSubj[subj].records.push({ qid: qid, ts: r.ts, correct: r.correct, topic: r.topic, selected: r.selected });
        var tk = r.topic || 'Unknown';
        if (!perSubj[subj].topicStats[tk]) perSubj[subj].topicStats[tk] = { total: 0, correct: 0 };
        perSubj[subj].topicStats[tk].total++;
        if (r.correct) perSubj[subj].topicStats[tk].correct++;
        if (!r.correct) perSubj[subj].wrongQuestions.push({ qid: qid, topic: r.topic, ts: r.ts });
      });
    });

    // yz_premium_answers
    Object.keys(premium).forEach(function(qid) {
      var r = premium[qid];
      if (subjects.indexOf(r.subject) < 0) return;
      if (!inDateRange(r.ts, range)) return;
      perSubj[r.subject].total++;
      if (r.correct) perSubj[r.subject].correct++;
      perSubj[r.subject].records.push({ qid: qid, ts: r.ts, correct: r.correct, topic: r.topicCode });
      var tk = r.topicCode || 'Unknown';
      if (!perSubj[r.subject].topicStats[tk]) perSubj[r.subject].topicStats[tk] = { total: 0, correct: 0 };
      perSubj[r.subject].topicStats[tk].total++;
      if (r.correct) perSubj[r.subject].topicStats[tk].correct++;
      if (!r.correct) perSubj[r.subject].wrongQuestions.push({ qid: qid, topic: r.topicCode, ts: r.ts });
    });

    // 汇总
    var overall = {
      totalQuestions: 0,
      totalCorrect: 0,
      accuracy: 0,
      activeSubjects: 0,
      dateRange: range || { from: 'all', to: 'all' }
    };
    Object.keys(perSubj).forEach(function(s) {
      var ps = perSubj[s];
      ps.accuracy = ps.total > 0 ? +(ps.correct / ps.total * 100).toFixed(1) : 0;
      // 按 topic 排序
      ps.topicList = Object.keys(ps.topicStats).map(function(tk) {
        var ts = ps.topicStats[tk];
        return { topic: tk, total: ts.total, correct: ts.correct, accuracy: ts.total > 0 ? +(ts.correct / ts.total * 100).toFixed(1) : 0 };
      }).sort(function(a, b) { return a.accuracy - b.accuracy; });
      // 错题按 qid 聚合
      var wrongMap = {};
      ps.wrongQuestions.forEach(function(w) {
        if (!wrongMap[w.qid]) wrongMap[w.qid] = { qid: w.qid, topic: w.topic, count: 0, lastTs: 0 };
        wrongMap[w.qid].count++;
        if (w.ts > wrongMap[w.qid].lastTs) wrongMap[w.qid].lastTs = w.ts;
      });
      ps.topWrong = Object.keys(wrongMap).map(function(k) { return wrongMap[k]; })
        .sort(function(a, b) { return b.count - a.count; })
        .slice(0, 10);
      ps.wrongCount = ps.wrongQuestions.length;

      // 时间线 (按天)
      var dayMap = {};
      ps.records.forEach(function(rec) {
        var d = new Date(rec.ts);
        var dStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        if (!dayMap[dStr]) dayMap[dStr] = { day: dStr, total: 0, correct: 0 };
        dayMap[dStr].total++;
        if (rec.correct) dayMap[dStr].correct++;
      });
      ps.timeline = Object.keys(dayMap).map(function(k) { return dayMap[k]; }).sort(function(a, b) { return a.day.localeCompare(b.day); });

      // 薄弱 Topic (accuracy < 60% 且 total >= 3)
      ps.weakTopics = ps.topicList.filter(function(t) { return t.total >= 3 && t.accuracy < 60; });

      // 强烈 Topic (accuracy >= 85% 且 total >= 5)
      ps.strongTopics = ps.topicList.filter(function(t) { return t.total >= 5 && t.accuracy >= 85; });

      overall.totalQuestions += ps.total;
      overall.totalCorrect += ps.correct;
      if (ps.total > 0) overall.activeSubjects++;
    });
    overall.accuracy = overall.totalQuestions > 0 ? +(overall.totalCorrect / overall.totalQuestions * 100).toFixed(1) : 0;

    // 整体错题 TOP10
    var allWrongMap = {};
    Object.keys(perSubj).forEach(function(s) {
      perSubj[s].wrongQuestions.forEach(function(w) {
        var key = s + '::' + w.qid;
        if (!allWrongMap[key]) allWrongMap[key] = { subject: s, qid: w.qid, topic: w.topic, count: 0 };
        allWrongMap[key].count++;
      });
    });
    var top10 = Object.keys(allWrongMap).map(function(k) { return allWrongMap[k]; })
      .sort(function(a, b) { return b.count - a.count; })
      .slice(0, 10);

    // 学习时间线 (合并所有科目, 按天)
    var allDays = {};
    Object.keys(perSubj).forEach(function(s) {
      perSubj[s].timeline.forEach(function(d) {
        if (!allDays[d.day]) allDays[d.day] = { day: d.day, total: 0, correct: 0 };
        allDays[d.day].total += d.total;
        allDays[d.day].correct += d.correct;
      });
    });
    var studyTimeline = Object.keys(allDays).map(function(k) { return allDays[k]; })
      .sort(function(a, b) { return a.day.localeCompare(b.day); });

    // 整体建议
    var suggestions = [];
    if (overall.accuracy < 50) {
      suggestions.push('整体正确率偏低 (<50%),建议回到基础题巩固,降低题目难度。');
    } else if (overall.accuracy < 70) {
      suggestions.push('整体正确率中等 (50-70%),建议针对错题进行专项练习。');
    } else if (overall.accuracy < 85) {
      suggestions.push('整体正确率良好 (70-85%),建议挑战更高难度以冲刺高分。');
    } else {
      suggestions.push('整体正确率优秀 (≥85%),建议保持节奏并尝试限时模拟。');
    }
    if (overall.totalQuestions < 50) {
      suggestions.push('总做题量偏少 (<50),建议每日保持至少 10-20 题的稳定训练量。');
    }
    if (overall.activeSubjects < 2) {
      suggestions.push('活跃科目不足 2 个,建议多科并行准备以避免单科风险。');
    }
    // 找出最弱科目
    var weakest = null, strongest = null;
    Object.keys(perSubj).forEach(function(s) {
      var ps = perSubj[s];
      if (ps.total < 5) return;
      if (!weakest || ps.accuracy < weakest.acc) weakest = { name: ps.subjectName, acc: ps.accuracy };
      if (!strongest || ps.accuracy > strongest.acc) strongest = { name: ps.subjectName, acc: ps.accuracy };
    });
    if (weakest) suggestions.push('最薄弱科目: ' + weakest.name + ' (' + weakest.acc + '%), 建议加大该科目练习。');
    if (strongest) suggestions.push('最强科目: ' + strongest.name + ' (' + strongest.acc + '%), 可作为稳定得分点。');

    return {
      meta: {
        generatedAt: new Date().toISOString(),
        reportId: 'RPT-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
        version: 'v54',
        dateRange: overall.dateRange
      },
      overall: overall,
      perSubject: perSubj,
      topWrong: top10,
      studyTimeline: studyTimeline,
      suggestions: suggestions
    };
  }

  // ============== 格式化 ==============
  function formatJson(data) {
    return JSON.stringify(data, null, 2);
  }

  function formatMarkdown(data) {
    var lines = [];
    lines.push('# 学习报告');
    lines.push('');
    lines.push('**报告 ID:** ' + data.meta.reportId);
    lines.push('**生成时间:** ' + new Date(data.meta.generatedAt).toLocaleString('zh-CN'));
    lines.push('**日期范围:** ' + (data.meta.dateRange.from || '不限') + ' ~ ' + (data.meta.dateRange.to || '不限'));
    lines.push('');
    lines.push('## 总体概览');
    lines.push('');
    lines.push('| 指标 | 数值 |');
    lines.push('| --- | --- |');
    lines.push('| 总做题数 | ' + data.overall.totalQuestions + ' |');
    lines.push('| 答对数 | ' + data.overall.totalCorrect + ' |');
    lines.push('| 整体正确率 | ' + data.overall.accuracy + '% |');
    lines.push('| 活跃科目数 | ' + data.overall.activeSubjects + ' |');
    lines.push('');
    lines.push('## 各科对比');
    lines.push('');
    lines.push('| 科目 | 题数 | 答对 | 正确率 |');
    lines.push('| --- | --- | --- | --- |');
    Object.keys(data.perSubject).forEach(function(s) {
      var ps = data.perSubject[s];
      if (ps.total === 0) return;
      lines.push('| ' + ps.subjectName + ' | ' + ps.total + ' | ' + ps.correct + ' | ' + ps.accuracy + '% |');
    });
    lines.push('');
    lines.push('## 各科详细');
    Object.keys(data.perSubject).forEach(function(s) {
      var ps = data.perSubject[s];
      lines.push('');
      lines.push('### ' + ps.subjectName + (ps.total === 0 ? ' (无数据)' : ''));
      if (ps.total === 0) return;
      lines.push('');
      lines.push('**总题数:** ' + ps.total + '  **答对:** ' + ps.correct + '  **正确率:** ' + ps.accuracy + '%');
      if (ps.weakTopics.length > 0) {
        lines.push('');
        lines.push('**薄弱 Topic:**');
        ps.weakTopics.forEach(function(t) {
          lines.push('- ' + t.topic + ' (' + t.correct + '/' + t.total + ', ' + t.accuracy + '%)');
        });
      }
      if (ps.strongTopics.length > 0) {
        lines.push('');
        lines.push('**熟练 Topic:**');
        ps.strongTopics.forEach(function(t) {
          lines.push('- ' + t.topic + ' (' + t.correct + '/' + t.total + ', ' + t.accuracy + '%)');
        });
      }
    });
    lines.push('');
    lines.push('## 错题 TOP 10');
    lines.push('');
    if (data.topWrong.length === 0) {
      lines.push('(无错题)');
    } else {
      lines.push('| 科目 | 题目 ID | Topic | 错次 |');
      lines.push('| --- | --- | --- | --- |');
      data.topWrong.forEach(function(w) {
        lines.push('| ' + (SUBJECT_NAMES[w.subject] || w.subject) + ' | ' + w.qid + ' | ' + (w.topic || '—') + ' | ' + w.count + ' |');
      });
    }
    lines.push('');
    lines.push('## 学习时间线');
    lines.push('');
    if (data.studyTimeline.length === 0) {
      lines.push('(无学习记录)');
    } else {
      lines.push('| 日期 | 题数 | 答对 | 正确率 |');
      lines.push('| --- | --- | --- | --- |');
      data.studyTimeline.forEach(function(d) {
        var acc = d.total > 0 ? +(d.correct / d.total * 100).toFixed(1) : 0;
        lines.push('| ' + d.day + ' | ' + d.total + ' | ' + d.correct + ' | ' + acc + '% |');
      });
    }
    lines.push('');
    lines.push('## 学习建议');
    lines.push('');
    data.suggestions.forEach(function(s) {
      lines.push('- ' + s);
    });
    lines.push('');
    lines.push('---');
    lines.push('*本报告由 yunzhuan.icu · v54 学习报告系统生成*');
    return lines.join('\n');
  }

  function formatHtml(data) {
    // 自包含样式, 可直接打印为 PDF
    var css = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:880px;margin:24px auto;padding:0 16px;color:#111;line-height:1.7;font-size:14px;background:#fff;}h1{font-size:1.6rem;border-bottom:2px solid #111;padding-bottom:6px;}h2{font-size:1.15rem;border-bottom:1px solid #111;padding-bottom:4px;margin-top:24px;}h3{font-size:1rem;margin-top:18px;}table{width:100%;border-collapse:collapse;font-size:0.85rem;margin:8px 0;}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;}th{background:#f5f5f5;font-weight:700;}.meta{color:#666;font-size:0.85rem;margin-bottom:12px;}.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0;}.summary-card{border:1px solid #ddd;padding:10px;text-align:center;}.summary-num{font-size:1.6rem;font-weight:700;}.summary-label{font-size:0.78rem;color:#666;}.footer{margin-top:30px;padding-top:12px;border-top:1px solid #ddd;color:#888;font-size:0.78rem;text-align:center;}.weak{color:#a00;}.strong{color:#060;}.suggestion{border-left:3px solid #111;padding:6px 12px;background:#fafafa;margin:6px 0;font-size:0.88rem;}@media print{body{margin:0;}.summary-card{break-inside:avoid;}h2{break-after:avoid;}}';
    var html = [];
    html.push('<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><title>学习报告 - ' + data.meta.reportId + '</title><style>' + css + '</style></head><body>');
    html.push('<h1>学习报告</h1>');
    html.push('<div class="meta">');
    html.push('<div>报告 ID: <code>' + data.meta.reportId + '</code></div>');
    html.push('<div>生成时间: ' + new Date(data.meta.generatedAt).toLocaleString('zh-CN') + '</div>');
    html.push('<div>日期范围: ' + (data.meta.dateRange.from || '不限') + ' ~ ' + (data.meta.dateRange.to || '不限') + '</div>');
    html.push('</div>');

    html.push('<h2>总体概览</h2>');
    html.push('<div class="summary-grid">');
    html.push('<div class="summary-card"><div class="summary-num">' + data.overall.totalQuestions + '</div><div class="summary-label">总做题数</div></div>');
    html.push('<div class="summary-card"><div class="summary-num">' + data.overall.totalCorrect + '</div><div class="summary-label">答对数</div></div>');
    html.push('<div class="summary-card"><div class="summary-num">' + data.overall.accuracy + '%</div><div class="summary-label">正确率</div></div>');
    html.push('<div class="summary-card"><div class="summary-num">' + data.overall.activeSubjects + '</div><div class="summary-label">活跃科目</div></div>');
    html.push('</div>');

    html.push('<h2>各科对比</h2>');
    html.push('<table><thead><tr><th>科目</th><th>题数</th><th>答对</th><th>正确率</th></tr></thead><tbody>');
    var hasAny = false;
    Object.keys(data.perSubject).forEach(function(s) {
      var ps = data.perSubject[s];
      if (ps.total === 0) return;
      hasAny = true;
      html.push('<tr><td>' + ps.subjectName + '</td><td>' + ps.total + '</td><td>' + ps.correct + '</td><td>' + ps.accuracy + '%</td></tr>');
    });
    if (!hasAny) html.push('<tr><td colspan="4" style="text-align:center;color:#888;">无数据</td></tr>');
    html.push('</tbody></table>');

    html.push('<h2>各科详细</h2>');
    Object.keys(data.perSubject).forEach(function(s) {
      var ps = data.perSubject[s];
      html.push('<h3>' + ps.subjectName + (ps.total === 0 ? ' (无数据)' : '') + '</h3>');
      if (ps.total === 0) return;
      html.push('<p>总题数: <strong>' + ps.total + '</strong> &nbsp; 答对: <strong>' + ps.correct + '</strong> &nbsp; 正确率: <strong>' + ps.accuracy + '%</strong></p>');
      if (ps.weakTopics.length > 0) {
        html.push('<p><span class="weak">薄弱 Topic:</span></p><ul>');
        ps.weakTopics.forEach(function(t) {
          html.push('<li>' + t.topic + ' — ' + t.correct + '/' + t.total + ' (' + t.accuracy + '%)</li>');
        });
        html.push('</ul>');
      }
      if (ps.strongTopics.length > 0) {
        html.push('<p><span class="strong">熟练 Topic:</span></p><ul>');
        ps.strongTopics.forEach(function(t) {
          html.push('<li>' + t.topic + ' — ' + t.correct + '/' + t.total + ' (' + t.accuracy + '%)</li>');
        });
        html.push('</ul>');
      }
    });

    html.push('<h2>错题 TOP 10</h2>');
    if (data.topWrong.length === 0) {
      html.push('<p>无错题记录 🎉</p>');
    } else {
      html.push('<table><thead><tr><th>科目</th><th>题目 ID</th><th>Topic</th><th>错次</th></tr></thead><tbody>');
      data.topWrong.forEach(function(w) {
        html.push('<tr><td>' + (SUBJECT_NAMES[w.subject] || w.subject) + '</td><td><code>' + w.qid + '</code></td><td>' + (w.topic || '—') + '</td><td>' + w.count + '</td></tr>');
      });
      html.push('</tbody></table>');
    }

    html.push('<h2>学习时间线</h2>');
    if (data.studyTimeline.length === 0) {
      html.push('<p>无学习记录</p>');
    } else {
      html.push('<table><thead><tr><th>日期</th><th>题数</th><th>答对</th><th>正确率</th></tr></thead><tbody>');
      data.studyTimeline.forEach(function(d) {
        var acc = d.total > 0 ? +(d.correct / d.total * 100).toFixed(1) : 0;
        html.push('<tr><td>' + d.day + '</td><td>' + d.total + '</td><td>' + d.correct + '</td><td>' + acc + '%</td></tr>');
      });
      html.push('</tbody></table>');
    }

    html.push('<h2>学习建议</h2>');
    data.suggestions.forEach(function(s) {
      html.push('<div class="suggestion">' + s + '</div>');
    });

    html.push('<div class="footer">yunzhuan.icu · v54 学习报告 · ' + data.meta.reportId + '</div>');
    html.push('</body></html>');
    return html.join('\n');
  }

  // ============== 历史 ==============
  function getHistory() {
    return lsGet(REPORT_HISTORY_KEY, []);
  }
  function setHistory(arr) {
    lsSet(REPORT_HISTORY_KEY, arr);
  }

  // ============== 公共 API ==============
  var Report = {
    SUBJECT_NAMES: SUBJECT_NAMES,

    // 聚合原始数据 (供高级用户)
    aggregate: aggregate,

    formatJson: formatJson,
    formatMarkdown: formatMarkdown,
    formatHtml: formatHtml,

    generate: function(opts) {
      var data = aggregate(opts);
      var fmt = (opts && opts.format) || 'json';
      var content;
      var ext, mime;
      if (fmt === 'markdown') {
        content = formatMarkdown(data);
        ext = 'md'; mime = 'text/markdown';
      } else if (fmt === 'html') {
        content = formatHtml(data);
        ext = 'html'; mime = 'text/html';
      } else {
        content = formatJson(data);
        ext = 'json'; mime = 'application/json';
        fmt = 'json';
      }
      // 保存到历史
      var hist = getHistory();
      hist.unshift({
        reportId: data.meta.reportId,
        generatedAt: data.meta.generatedAt,
        format: fmt,
        size: content.length,
        dateRange: data.meta.dateRange,
        subjects: (opts && opts.subjects) || Object.keys(SUBJECT_NAMES),
        overall: data.overall
      });
      if (hist.length > 30) hist = hist.slice(0, 30);
      setHistory(hist);
      return {
        meta: data.meta,
        format: fmt,
        content: content,
        filename: 'learning-report-' + data.meta.reportId + '.' + ext,
        mime: mime,
        data: data
      };
    },

    download: function(report) {
      var blob = new Blob([report.content], { type: report.mime + ';charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = report.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      return true;
    },

    history: function() { return getHistory(); },
    getReport: function(reportId) { return getHistory().find(function(r) { return r.reportId === reportId; }); },
    deleteReport: function(reportId) {
      var hist = getHistory().filter(function(r) { return r.reportId !== reportId; });
      setHistory(hist);
      return true;
    },

    getCurrentSubjects: function() {
      return Object.keys(SUBJECT_NAMES).map(function(k) {
        return { key: k, name: SUBJECT_NAMES[k] };
      });
    }
  };

  if (typeof window !== 'undefined') {
    window.Report = Report;
  }
})();
