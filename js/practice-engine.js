/**
 * Practice Engine v6 (v15)
 * 答题 + 错题本 + localStorage 持久化 + Topic筛选(?topic=xxx) + 浮动导航栏 + Dark Mode
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

  // --- v14: Topic Filter from URL ?topic=xxx ---
  function getTopicFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('topic') || '';
  }

  function extractTopicCode(qNumEl) {
    if (!qNumEl) return '';
    var text = qNumEl.textContent;
    var m = text.match(/【([A-Za-z0-9_-]+)】/);
    return m ? m[1] : '';
  }

  function initTopicFilter(questions) {
    var topicParam = getTopicFromUrl();
    if (!topicParam) return null;

    var matched = 0;
    questions.forEach(function(q) {
      var qNum = q.querySelector('.q-num');
      var code = extractTopicCode(qNum);
      if (code && code === topicParam) {
        q.style.display = '';
        matched++;
      } else {
        q.style.display = 'none';
      }
    });

    // Insert filter banner
    var banner = document.createElement('div');
    banner.style.cssText = 'border:1px solid #111;padding:10px 14px;margin:12px 0;font-size:0.85rem;';
    banner.innerHTML = '<strong>Topic Filter:</strong> ' + topicParam + ' · 显示 ' + matched + ' 题 · <a href="practice.html" style="border-bottom:1px solid #ccc;">清除筛选</a>';
    var h2 = document.querySelector('h2');
    if (h2) h2.parentNode.insertBefore(banner, h2.nextSibling);

    return { topic: topicParam, matched: matched };
  }

  // --- Helper: get visible questions (display:none skipped) ---
  function getVisibleQuestions(questions) {
    var visible = [];
    questions.forEach(function(q) {
      if (q.style.display !== 'none') visible.push(q);
    });
    return visible;
  }

  // --- v6 B2: Floating Navigation Bar ---
  function initFloatingNav(questions, updateAllStats) {
    var navDiv = document.createElement('div');
    navDiv.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;background:#fff;border:1px solid #111;padding:8px 10px;font-size:0.8rem;display:flex;align-items:center;gap:6px;flex-wrap:wrap;max-width:340px;box-shadow:0 2px 8px rgba(0,0,0,0.1);';

    // Prev button
    var prevBtn = document.createElement('button');
    prevBtn.textContent = '← Prev';
    prevBtn.style.cssText = 'border:1px solid #111;background:#fff;padding:3px 8px;cursor:pointer;font-family:inherit;font-size:0.8rem;';

    // Next button
    var nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.style.cssText = 'border:1px solid #111;background:#fff;padding:3px 8px;cursor:pointer;font-family:inherit;font-size:0.8rem;';

    // Go input + button
    var goInput = document.createElement('input');
    goInput.type = 'text';
    goInput.placeholder = '#';
    goInput.style.cssText = 'border:1px solid #111;padding:3px 5px;width:38px;font-family:inherit;font-size:0.8rem;';

    var goBtn = document.createElement('button');
    goBtn.textContent = 'Go';
    goBtn.style.cssText = 'border:1px solid #111;background:#fff;padding:3px 8px;cursor:pointer;font-family:inherit;font-size:0.8rem;';

    // Counter
    var counter = document.createElement('span');
    counter.style.cssText = 'margin-left:4px;white-space:nowrap;';

    // Dark mode toggle button (B4)
    var darkBtn = document.createElement('button');
    darkBtn.textContent = '☀︎';
    darkBtn.title = 'Toggle Dark Mode';
    darkBtn.style.cssText = 'border:1px solid #111;background:#fff;padding:3px 7px;cursor:pointer;font-family:inherit;font-size:0.85rem;margin-left:2px;';

    navDiv.appendChild(prevBtn);
    navDiv.appendChild(nextBtn);
    navDiv.appendChild(goInput);
    navDiv.appendChild(goBtn);
    navDiv.appendChild(counter);
    navDiv.appendChild(darkBtn);

    document.body.appendChild(navDiv);

    // --- Navigation Logic ---
    function findCurrentVisibleIndex() {
      var visible = getVisibleQuestions(questions);
      if (visible.length === 0) return -1;
      var scrollY = window.scrollY + window.innerHeight / 3;
      for (var i = 0; i < visible.length; i++) {
        var top = visible[i].offsetTop;
        if (top >= scrollY) return i === 0 ? 0 : i - 1;
      }
      return visible.length - 1;
    }

    function scrollToVisibleIndex(idx) {
      var visible = getVisibleQuestions(questions);
      if (idx < 0) idx = 0;
      if (idx >= visible.length) idx = visible.length - 1;
      if (visible[idx]) {
        visible[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    prevBtn.addEventListener('click', function() {
      var curIdx = findCurrentVisibleIndex();
      scrollToVisibleIndex(curIdx - 1);
    });

    nextBtn.addEventListener('click', function() {
      var curIdx = findCurrentVisibleIndex();
      scrollToVisibleIndex(curIdx + 1);
    });

    function doGo() {
      var val = parseInt(goInput.value, 10);
      var visible = getVisibleQuestions(questions);
      if (!isNaN(val) && val >= 1 && val <= visible.length) {
        scrollToVisibleIndex(val - 1);
      }
      goInput.value = '';
    }

    goBtn.addEventListener('click', doGo);
    goInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doGo();
    });

    // --- Counter update function (for reuse) ---
    function updateCounter() {
      var visible = getVisibleQuestions(questions);
      var recs = getRecords();
      var answeredVisible = 0;
      visible.forEach(function(q) {
        var qid = q.getAttribute('data-qid');
        if (qid && recs[qid]) answeredVisible++;
      });
      counter.textContent = answeredVisible + ' / ' + visible.length;
    }

    // Dark mode toggle handler setup
    navDiv._darkBtn = darkBtn;
    navDiv._updateCounter = updateCounter;

    return {
      navDiv: navDiv,
      updateCounter: updateCounter
    };
  }

  // --- v6 B4: Dark Mode ---
  function initDarkMode(darkBtn, navDiv) {
    // Inject dark mode styles
    var style = document.createElement('style');
    style.textContent = [
      'html.dark { background:#111; }',
      'html.dark body { background:#0b0b0b !important; color:#e5e5e5; }',
      'html.dark a { color:#e5e5e5; border-color:#555; }',
      'html.dark h1,html.dark h2,html.dark h3 { color:#f5f5f5; border-color:#555; }',
      'html.dark th,html.dark td,html.dark .box,html.dark .box-dashed,html.dark .v-info,html.dark .card,html.dark .stat,html.dark .q,html.dark .paper-block { border-color:#444 !important; }',
      'html.dark th { background:#1a1a1a; }',
      'html.dark .muted { color:#888; }',
      'html.dark input,html.dark button { background:#1a1a1a; color:#e5e5e5; border-color:#555; }'
    ].join('\n');
    document.head.appendChild(style);

    function applyDark(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        darkBtn.textContent = '☾';
        // Update nav bar background/border for dark mode
        if (navDiv) {
          navDiv.style.background = '#1a1a1a';
          navDiv.style.border = '1px solid #555';
        }
      } else {
        document.documentElement.classList.remove('dark');
        darkBtn.textContent = '☀︎';
        if (navDiv) {
          navDiv.style.background = '#fff';
          navDiv.style.border = '1px solid #111';
        }
      }
    }

    // Restore from localStorage
    var savedDark = localStorage.getItem('darkMode');
    var isDark = savedDark === '1';
    applyDark(isDark);

    // Toggle handler
    darkBtn.addEventListener('click', function() {
      var isDarkNow = !document.documentElement.classList.contains('dark');
      localStorage.setItem('darkMode', isDarkNow ? '1' : '0');
      applyDark(isDarkNow);
    });
  }

  // --- Practice Page Logic ---
  function initPracticePage() {
    var questions = document.querySelectorAll('.q');
    var recs = getRecords();

    // v14: Apply topic filter first
    var filterResult = initTopicFilter(questions);

    questions.forEach(function(q, idx) {
      var qid = q.getAttribute('data-qid') || ('q' + (idx + 1));
      q.setAttribute('data-qid', qid); // ensure qid is set for later lookups
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

          // v6: update all stats counters after answer
          if (window._yzNavUpdater) window._yzNavUpdater();
          if (window._yzStatsUpdater) window._yzStatsUpdater();
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

    // Stats bar + controls
    var stats = document.createElement('div');
    stats.style.cssText = 'border:1px solid #111;padding:10px 14px;margin:16px 0;font-size:0.85rem;';
    var visibleCount = filterResult ? filterResult.matched : questions.length;

    function doUpdateStats() {
      updateStats(stats, visibleCount);
    }
    doUpdateStats();
    window._yzStatsUpdater = doUpdateStats;

    var h2 = document.querySelector('h2');
    if (h2) h2.parentNode.insertBefore(stats, h2.nextSibling);

    // Timer
    var timerDiv = document.createElement('div');
    timerDiv.style.cssText = 'display:inline-block;margin-right:16px;';
    var timerLabel = document.createElement('span');
    timerLabel.textContent = '⏱ 00:00';
    timerLabel.style.cssText = 'font-variant-numeric:tabular-nums;';
    var timerBtn = document.createElement('button');
    timerBtn.textContent = 'Start Timer';
    timerBtn.style.cssText = 'border:1px solid #111;background:#fff;color:#111;padding:2px 8px;font-size:0.8rem;cursor:pointer;font-family:inherit;margin-left:6px;';
    var timerInterval = null;
    var timerSeconds = 0;
    var timerRunning = false;
    timerBtn.addEventListener('click', function() {
      if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        timerBtn.textContent = 'Resume';
      } else {
        timerRunning = true;
        timerBtn.textContent = 'Pause';
        timerInterval = setInterval(function() {
          timerSeconds++;
          var m = Math.floor(timerSeconds / 60);
          var s = timerSeconds % 60;
          timerLabel.textContent = '⏱ ' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
        }, 1000);
      }
    });
    timerDiv.appendChild(timerLabel);
    timerDiv.appendChild(timerBtn);
    stats.appendChild(timerDiv);

    // Difficulty filter
    var filterDiv = document.createElement('div');
    filterDiv.style.cssText = 'display:inline-block;margin-right:16px;';
    var filterLabel = document.createElement('span');
    filterLabel.textContent = 'Filter: ';
    filterDiv.appendChild(filterLabel);
    ['All', 'Easy', 'Medium', 'Hard'].forEach(function(level) {
      var btn = document.createElement('button');
      btn.textContent = level;
      btn.style.cssText = 'border:1px solid #e0e0e0;background:#fff;color:#555;padding:1px 6px;font-size:0.78rem;cursor:pointer;font-family:inherit;margin-right:3px;';
      if (level === 'All') { btn.style.border = '1px solid #111'; btn.style.color = '#111'; btn.style.fontWeight = '700'; }
      btn.addEventListener('click', function() {
        filterDiv.querySelectorAll('button').forEach(function(b) {
          b.style.border = '1px solid #e0e0e0'; b.style.color = '#555'; b.style.fontWeight = 'normal';
        });
        btn.style.border = '1px solid #111'; btn.style.color = '#111'; btn.style.fontWeight = '700';
        questions.forEach(function(q) {
          var qNum = q.querySelector('.q-num');
          if (qNum) {
            var text = qNum.textContent.toLowerCase();
            if (level === 'All' || text.indexOf(level.toLowerCase()) >= 0) {
              q.style.display = '';
            } else {
              q.style.display = 'none';
            }
          }
        });
        // v6: refresh nav counter + top stats visible count after difficulty filter
        var newVisible = getVisibleQuestions(questions);
        visibleCount = newVisible.length;
        if (window._yzNavUpdater) window._yzNavUpdater();
        if (window._yzStatsUpdater) window._yzStatsUpdater();
      });
      filterDiv.appendChild(btn);
    });
    stats.appendChild(filterDiv);

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

    // --- v6: Initialize Floating Nav (B2) + Dark Mode (B4) ---
    var navResult = initFloatingNav(questions);
    navResult.updateCounter();
    window._yzNavUpdater = navResult.updateCounter;

    initDarkMode(navResult.navDiv._darkBtn, navResult.navDiv);
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

  function updateStats(statsDiv, totalCount) {
    var recs = getRecords();
    var total = Object.keys(recs).length;
    var correct = 0;
    Object.keys(recs).forEach(function(k) {
      if (recs[k].correct) correct++;
    });
    var rate = total > 0 ? Math.round(correct / total * 100) : 0;
    var displayTotal = totalCount || total;
    statsDiv.innerHTML = '<strong>Progress:</strong> ' + total + ' answered · ' + correct + ' correct · ' + rate + '% accuracy' + (totalCount ? ' · Showing ' + displayTotal + ' questions' : '');
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
