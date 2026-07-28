/**
 * Practice Engine v4
 * 答题 + 错题本 + localStorage 持久化
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'yz_practice_data';
  var SUBJECT = document.body.getAttribute('data-subject') || 'unknown';

  // --- Storage ---
  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return { records: {} };
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  function getRecords() {
    var data = loadData();
    if (!data.records[SUBJECT]) data.records[SUBJECT] = {};
    return data.records[SUBJECT];
  }

  function recordAnswer(qid, selected, correct, topic) {
    var data = loadData();
    if (!data.records[SUBJECT]) data.records[SUBJECT] = {};
    var recs = data.records[SUBJECT];
    recs[qid] = {
      selected: selected,
      correct: correct,
      topic: topic || '',
      ts: Date.now()
    };
    saveData(data);
  }

  function clearSubject() {
    var data = loadData();
    data.records[SUBJECT] = {};
    saveData(data);
  }

  // --- Practice Page Logic ---
  function initPracticePage() {
    var questions = document.querySelectorAll('.q');
    var recs = getRecords();

    questions.forEach(function(q, idx) {
      var qid = q.getAttribute('data-qid') || ('q' + (idx + 1));
      var choices = q.querySelectorAll('.q-choices li');
      var answerDiv = q.querySelector('.q-answer');
      var correctLetter = '';
      var topic = '';

      // Extract topic from q-num
      var qNum = q.querySelector('.q-num');
      if (qNum) {
        var parts = qNum.textContent.split('·');
        if (parts.length >= 3) topic = parts[2].trim();
      }

      // Find correct answer from existing .q-answer
      if (answerDiv) {
        var match = answerDiv.textContent.match(/Answer:\s*([A-E])/i);
        if (!match) match = answerDiv.textContent.match(/答案[：:]\s*([A-E])/i);
        if (match) correctLetter = match[1].toUpperCase();
      }

      // Mark correct letter in choices
      choices.forEach(function(li) {
        var letter = li.textContent.trim().charAt(0);
        li.setAttribute('data-letter', letter);
        li.style.cursor = 'pointer';

        // Restore previous answer
        if (recs[qid] && recs[qid].selected === letter) {
          markAnswer(li, correctLetter === letter);
        }
      });

      // Click handler
      choices.forEach(function(li) {
        li.addEventListener('click', function() {
          // Remove previous marks
          choices.forEach(function(l2) {
            l2.style.fontWeight = 'normal';
            l2.style.borderLeft = '';
            l2.style.paddingLeft = '';
          });

          var letter = li.getAttribute('data-letter');
          var isCorrect = letter === correctLetter;
          markAnswer(li, isCorrect);
          recordAnswer(qid, letter, isCorrect, topic);
        });
      });

      // Show answer button
      if (answerDiv && correctLetter) {
        answerDiv.style.display = 'none';
        var btn = document.createElement('button');
        btn.textContent = 'Show Answer';
        btn.style.cssText = 'display:block;margin-top:8px;border:1px solid #111;background:#fff;color:#111;padding:3px 10px;font-size:0.82rem;cursor:pointer;font-family:inherit;';
        btn.addEventListener('click', function() {
          answerDiv.style.display = 'block';
          btn.style.display = 'none';
        });
        q.appendChild(btn);
      }
    });

    // Stats bar
    var stats = document.createElement('div');
    stats.style.cssText = 'border:1px solid #111;padding:10px 14px;margin:16px 0;font-size:0.85rem;';
    updateStats(stats);
    var h2 = document.querySelector('h2');
    if (h2) h2.parentNode.insertBefore(stats, h2.nextSibling);

    // Clear button
    var clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Progress';
    clearBtn.style.cssText = 'display:block;margin:12px 0;border:1px dashed #888;background:#fff;color:#888;padding:3px 10px;font-size:0.8rem;cursor:pointer;font-family:inherit;';
    clearBtn.addEventListener('click', function() {
      if (confirm('Clear all answers for ' + SUBJECT + '?')) {
        clearSubject();
        location.reload();
      }
    });
    stats.appendChild(clearBtn);
  }

  function markAnswer(li, isCorrect) {
    li.style.fontWeight = '700';
    if (isCorrect) {
      li.style.borderLeft = '3px solid #111';
      li.style.paddingLeft = '21px';
    } else {
      li.style.borderLeft = '3px dashed #888';
      li.style.paddingLeft = '21px';
    }
  }

  function updateStats(statsDiv) {
    var recs = getRecords();
    var total = Object.keys(recs).length;
    var correct = 0;
    Object.keys(recs).forEach(function(k) {
      if (recs[k].correct) correct++;
    });
    var rate = total > 0 ? Math.round(correct / total * 100) : 0;
    statsDiv.innerHTML = '<strong>Progress:</strong> ' + total + ' answered · ' + correct + ' correct · ' + rate + '% accuracy';
  }

  // --- Tracker Page Logic ---
  function initTrackerPage() {
    var recs = getRecords();
    var total = Object.keys(recs).length;
    var correct = 0;
    var topics = {};

    Object.keys(recs).forEach(function(k) {
      var r = recs[k];
      if (r.correct) correct++;
      if (r.topic) {
        if (!topics[r.topic]) topics[r.topic] = { total: 0, correct: 0 };
        topics[r.topic].total++;
        if (r.correct) topics[r.topic].correct++;
      }
    });

    // Find or create summary
    var summaryEl = document.querySelector('.summary');
    if (summaryEl) {
      var rate = total > 0 ? Math.round(correct / total * 100) : 0;
      summaryEl.innerHTML = '<strong>Progress:</strong> ' + total + ' answered · ' + correct + ' correct · ' + rate + '% accuracy · Target: 120+';
    }

    // Update mastery table
    var masteryTable = document.querySelector('.mastery-table');
    if (masteryTable) {
      var rows = masteryTable.querySelectorAll('tbody tr');
      rows.forEach(function(row) {
        var topicCell = row.cells[0];
        if (!topicCell) return;
        var topicName = topicCell.textContent.trim();
        var t = topics[topicName];
        if (t) {
          if (row.cells[1]) row.cells[1].textContent = t.total;
          if (row.cells[2]) row.cells[2].textContent = t.total > 0 ? Math.round(t.correct / t.total * 100) + '%' : '—';
          if (row.cells[3]) row.cells[3].textContent = t.correct >= t.total * 0.8 ? 'Mastered' : (t.correct > 0 ? 'Learning' : 'Not Started');
        }
      });
    }

    // Update error notebook
    var errorTable = document.querySelector('.error-table');
    if (errorTable) {
      var tbody = errorTable.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = '';
        var errors = Object.keys(recs).filter(function(k) { return !recs[k].correct; });
        if (errors.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No errors recorded yet.</td></tr>';
        } else {
          errors.forEach(function(k, i) {
            var r = recs[k];
            var tr = document.createElement('tr');
            var date = new Date(r.ts);
            var dateStr = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
            tr.innerHTML = '<td>' + k + '</td><td>' + (r.topic || '—') + '</td><td>Wrong answer: ' + r.selected + '</td><td>' + dateStr + '</td><td>Review needed</td>';
            tbody.appendChild(tr);
          });
        }
      }
    }
  }

  // --- Init ---
  if (document.querySelector('.q')) {
    initPracticePage();
  } else if (document.querySelector('.mastery-table') || document.querySelector('.summary')) {
    initTrackerPage();
  }

  // Expose for manual calls
  window.YZPractice = {
    loadData: loadData,
    saveData: saveData,
    getRecords: getRecords,
    clearSubject: clearSubject
  };

})();
