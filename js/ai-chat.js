/* ================================================================
 * ai-chat.js v1.0 (v41)
 * AI 对话式学习助手
 *
 * 暴露对象：window.AIChat
 *   .open()           -> 打开浮窗
 *   .close()          -> 关闭浮窗
 *   .toggle()         -> 切换浮窗
 *   .destroy()        -> 移除浮窗 DOM 与事件
 *   .send(text)       -> 发送一条用户消息，返回 Promise<{reply, provider}>
 *   .clear()          -> 清空当前对话
 *   .history()        -> 获取当前用户历史
 *
 * 内置指令：
 *   "解释这道题" -> 取当前 qid，调 AITutor.explain
 *   "推荐练习"   -> 读 yz_practice_data，调用 AITutor.diagnose
 *   "讲解 [topic-code]" -> AITutor.explain(topicCode, subject)
 *   "出 5 道 [topic] 题" -> QuestionGen.generate
 *   其他 -> 直接转发给 AIProvider
 *
 * 浮窗样式：右下角圆形按钮 (54px) + 展开 360x520 聊天窗
 * localStorage key: ai_chat_{userId} -> [{role, text, ts, provider}]
 * ================================================================ */
(function() {
  'use strict';

  var STYLE_ID = 'ai-chat-styles-v41';
  var BUBBLE_ID = 'aiChatBubble';
  var WINDOW_ID = 'aiChatWindow';

  var state = {
    open: false,
    history: [],
    userId: getUserId(),
    busy: false,
    currentSubject: 'sat',
    currentQid: null
  };

  function getUserId() {
    try {
      var raw = localStorage.getItem('auth.currentUser') || localStorage.getItem('auth_user') || localStorage.getItem('username');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (typeof parsed === 'string') return parsed;
        if (parsed && parsed.username) return parsed.username;
      }
    } catch (e) {}
    return 'guest';
  }

  function historyKey() { return 'ai_chat_' + state.userId; }

  function loadHistory() {
    try {
      var raw = localStorage.getItem(historyKey());
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveHistory() {
    try {
      // keep only last 200 entries
      var trimmed = state.history.slice(-200);
      localStorage.setItem(historyKey(), JSON.stringify(trimmed));
    } catch (e) {}
  }

  // ---------------- Built-in Command Handlers ----------------
  function cmdExplainQuestion() {
    var qid = state.currentQid;
    var subject = state.currentSubject;
    if (!window.AITutor || !qid) {
      return Promise.resolve({
        reply: '请先在 Practice 页面打开一道题（提供 qid），再发送"解释这道题"。\n' +
               '当前 qid：' + (qid || '无') + '，subject：' + subject,
        provider: 'system'
      });
    }
    // try to extract topic code from qid (e.g. q-sat-m-alg-1a-1)
    var m = String(qid).match(/-([a-z0-9-]+)-\d+$/i);
    var topicCode = m ? m[1] : qid;
    var text = window.AITutor.explain(topicCode, subject);
    return Promise.resolve({ reply: text, provider: 'local-tutor' });
  }

  function cmdRecommend() {
    if (!window.AITutor) {
      return Promise.resolve({ reply: 'AITutor 未加载。', provider: 'system' });
    }
    var raw = localStorage.getItem('yz_practice_data');
    var data = raw ? JSON.parse(raw) : { records: {} };
    var diag = window.AITutor.diagnose(data);
    if (!diag.topWeakTopics || !diag.topWeakTopics.length) {
      return Promise.resolve({
        reply: '暂无足够数据生成推荐。请先在 Practice 中完成一些题目。',
        provider: 'local-tutor'
      });
    }
    var lines = ['【AI 推荐练习 · TOP 5 薄弱 Topic】'];
    diag.topWeakTopics.forEach(function(t, i) {
      var acc = t.acc === null ? '未练习' : (t.acc + '%');
      lines.push((i + 1) + '. ' + t.subjectName + ' · ' + t.topicName + ' (' + t.topicCode + ')\n' +
        '   当前正确率：' + acc + ' · 建议刷 ' + t.recommendPrac + ' 题 · 预估提分 +' + t.estImprove);
    });
    return Promise.resolve({ reply: lines.join('\n'), provider: 'local-tutor' });
  }

  function cmdExplainTopic(text) {
    // parse "讲解 [topic-code]" or "讲解 <code>"
    var m = text.match(/讲解\s+<?\s*([A-Za-z0-9-]+)\s*>?/);
    if (!m) return null;
    var topicCode = m[1];
    if (!window.AITutor) {
      return Promise.resolve({ reply: 'AITutor 未加载。', provider: 'system' });
    }
    var subject = state.currentSubject || 'sat';
    var result = window.AITutor.explain(topicCode, subject);
    return Promise.resolve({ reply: result, provider: 'local-tutor' });
  }

  function cmdGenQuestions(text) {
    // "出 N 道 [topic] 题" or "出 N 道 [topic-code] 题"
    var m = text.match(/出\s*(\d+)?\s*道?\s*([^\s的题，,。]+)/);
    if (!m) return null;
    var count = parseInt(m[1], 10) || 5;
    if (count > 20) count = 20;
    var token = m[2];
    var subject = state.currentSubject || 'sat';
    var topicCode = token;
    // try to match token to topic name
    if (window.SYLLABUS_DATA) {
      var codes = window.SYLLABUS_DATA.getAllTopicCodes(subject) || [];
      for (var i = 0; i < codes.length; i++) {
        var t = window.SYLLABUS_DATA.getTopic(subject, codes[i]);
        if (t && t.name && (t.name === token || t.name.indexOf(token) !== -1)) {
          topicCode = codes[i];
          break;
        }
      }
    }
    if (!window.QuestionGen) {
      return Promise.resolve({ reply: 'QuestionGen 未加载。', provider: 'system' });
    }
    return window.QuestionGen.generate({
      subject: subject,
      topicCode: topicCode,
      difficulty: 'medium',
      count: count,
      useAI: true
    }).then(function(result) {
      var lines = ['【已生成 ' + result.questions.length + ' 道题 · provider=' + result.provider + '】\n'];
      result.questions.forEach(function(q, i) {
        lines.push((i + 1) + '. ' + q.stem);
        Object.keys(q.choices).forEach(function(L) {
          lines.push('   ' + L + '. ' + q.choices[L]);
        });
        lines.push('   答案：' + q.answer);
      });
      lines.push('\n前往 ai-tutor.html 查看完整解析与评分。');
      return { reply: lines.join('\n'), provider: result.provider };
    });
  }

  // ---------------- Command Router ----------------
  function routeCommand(text) {
    var t = String(text || '').trim();
    if (!t) return null;

    if (/^解释这道题/.test(t) || /^讲一下这道题/.test(t)) {
      return cmdExplainQuestion();
    }
    if (/^推荐练习|^推荐题目|^薄弱/.test(t)) {
      return cmdRecommend();
    }
    if (/^讲解\s+/.test(t)) {
      var r = cmdExplainTopic(t);
      if (r) return r;
    }
    if (/^出\s*\d*\s*道/.test(t)) {
      var r = cmdGenQuestions(t);
      if (r) return r;
    }
    return null;
  }

  // ---------------- AI Send ----------------
  function aiReply(text) {
    if (window.AIProvider) {
      var prompt = '你是 yunzhuan 学习助手。请用中文回答，保持简洁、有条理。\n' +
        '当前 subject: ' + state.currentSubject + '。\n' +
        '用户问题：' + text;
      return window.AIProvider.complete(prompt, { maxTokens: 600 })
        .then(function(r) { return { reply: r.text, provider: r.provider, cached: r.cached }; });
    }
    return Promise.resolve({
      reply: '【本地模式】AIProvider 未配置，无法直接回答。\n' +
             '请在 Dashboard → AI Provider Settings 配置，或使用内置指令。',
      provider: 'local'
    });
  }

  function send(text) {
    text = String(text || '').trim();
    if (!text || state.busy) return Promise.resolve(null);
    state.busy = true;
    state.history.push({ role: 'user', text: text, ts: Date.now() });

    var routed = routeCommand(text);
    var p = routed ? routed : aiReply(text);
    return p.then(function(result) {
      state.history.push({
        role: 'assistant',
        text: result.reply,
        provider: result.provider,
        ts: Date.now()
      });
      saveHistory();
      state.busy = false;
      if (state.open) renderMessages();
      return result;
    }).catch(function(err) {
      state.history.push({
        role: 'assistant',
        text: '[错误] ' + (err && err.message),
        provider: 'error',
        ts: Date.now()
      });
      saveHistory();
      state.busy = false;
      if (state.open) renderMessages();
      return { reply: null, error: err };
    });
  }

  function clear() {
    state.history = [];
    saveHistory();
    if (state.open) renderMessages();
  }

  function history() {
    return state.history.slice();
  }

  // ---------------- DOM & UI ----------------
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = '' +
      '#' + BUBBLE_ID + ' { position: fixed; right: 20px; bottom: 20px; width: 54px; height: 54px; ' +
      'border-radius: 50%; background: #111; color: #fff; border: 2px solid #111; cursor: pointer; ' +
      'font-size: 1.3rem; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; ' +
      'display: flex; align-items: center; justify-content: center; transition: transform 0.15s ease; font-family: -apple-system, sans-serif; }' +
      '#' + BUBBLE_ID + ':hover { transform: scale(1.06); background: #333; }' +
      '#' + WINDOW_ID + ' { position: fixed; right: 20px; bottom: 86px; width: 360px; height: 520px; ' +
      'max-width: calc(100vw - 40px); max-height: calc(100vh - 110px); background: #fff; ' +
      'border: 1px solid #111; z-index: 9998; display: none; flex-direction: column; ' +
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; color: #111; }' +
      '#' + WINDOW_ID + '.open { display: flex; }' +
      '#' + WINDOW_ID + ' .ac-header { padding: 10px 14px; border-bottom: 1px solid #111; display: flex; ' +
      'justify-content: space-between; align-items: center; background: #111; color: #fff; }' +
      '#' + WINDOW_ID + ' .ac-header .ac-title { font-weight: 700; font-size: 0.92rem; }' +
      '#' + WINDOW_ID + ' .ac-header .ac-sub { font-size: 0.7rem; opacity: 0.8; }' +
      '#' + WINDOW_ID + ' .ac-header .ac-actions button { background: transparent; color: #fff; ' +
      'border: 1px solid #fff; padding: 2px 8px; font-size: 0.7rem; margin-left: 4px; cursor: pointer; font-family: inherit; }' +
      '#' + WINDOW_ID + ' .ac-header .ac-actions button:hover { background: #fff; color: #111; }' +
      '#' + WINDOW_ID + ' .ac-messages { flex: 1; overflow-y: auto; padding: 10px 12px; background: #fafafa; }' +
      '#' + WINDOW_ID + ' .ac-msg { margin: 6px 0; padding: 8px 10px; border: 1px solid #e0e0e0; ' +
      'background: #fff; font-size: 0.85rem; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }' +
      '#' + WINDOW_ID + ' .ac-msg.user { border-color: #111; background: #111; color: #fff; margin-left: 24px; }' +
      '#' + WINDOW_ID + ' .ac-msg.assistant { margin-right: 24px; }' +
      '#' + WINDOW_ID + ' .ac-msg.system { font-size: 0.72rem; color: #888; border: 1px dashed #888; background: #fafafa; }' +
      '#' + WINDOW_ID + ' .ac-msg .ac-meta { display: block; font-size: 0.65rem; color: #888; margin-top: 4px; }' +
      '#' + WINDOW_ID + ' .ac-msg.user .ac-meta { color: rgba(255,255,255,0.7); }' +
      '#' + WINDOW_ID + ' .ac-quick { padding: 6px 10px; border-top: 1px solid #e0e0e0; background: #fff; ' +
      'display: flex; gap: 4px; flex-wrap: wrap; }' +
      '#' + WINDOW_ID + ' .ac-quick button { background: #fff; border: 1px solid #888; padding: 3px 8px; ' +
      'font-size: 0.7rem; cursor: pointer; font-family: inherit; }' +
      '#' + WINDOW_ID + ' .ac-quick button:hover { background: #111; color: #fff; border-color: #111; }' +
      '#' + WINDOW_ID + ' .ac-input { display: flex; border-top: 1px solid #111; }' +
      '#' + WINDOW_ID + ' .ac-input input { flex: 1; border: none; padding: 10px 12px; font-size: 0.88rem; ' +
      'outline: none; font-family: inherit; background: #fff; }' +
      '#' + WINDOW_ID + ' .ac-input button { background: #111; color: #fff; border: none; padding: 0 16px; ' +
      'cursor: pointer; font-family: inherit; font-size: 0.85rem; font-weight: 600; }' +
      '#' + WINDOW_ID + ' .ac-input button:disabled { background: #888; cursor: not-allowed; }' +
      '@media (max-width: 480px) { #' + BUBBLE_ID + ' { right: 12px; bottom: 12px; } #' + WINDOW_ID + ' { right: 8px; bottom: 76px; width: calc(100vw - 16px); } }';
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function renderMessages() {
    var container = document.getElementById('acMessages');
    if (!container) return;
    container.innerHTML = '';
    if (!state.history.length) {
      var empty = document.createElement('div');
      empty.className = 'ac-msg system';
      empty.textContent = '你好！我是 yunzhuan AI 学习助手。\n' +
        '可使用下方快捷指令，或直接输入问题。';
      container.appendChild(empty);
      return;
    }
    state.history.forEach(function(m) {
      var div = document.createElement('div');
      div.className = 'ac-msg ' + m.role;
      div.textContent = m.text;
      var meta = document.createElement('span');
      meta.className = 'ac-meta';
      var ts = new Date(m.ts || Date.now());
      var hh = ts.getHours().toString().padStart(2, '0');
      var mm = ts.getMinutes().toString().padStart(2, '0');
      meta.textContent = hh + ':' + mm + (m.provider ? ' · ' + m.provider : '');
      div.appendChild(meta);
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  function buildUI() {
    if (document.getElementById(BUBBLE_ID)) return;
    ensureStyles();
    // Bubble
    var bubble = document.createElement('button');
    bubble.id = BUBBLE_ID;
    bubble.type = 'button';
    bubble.setAttribute('aria-label', 'Open AI Chat');
    bubble.textContent = 'AI';
    bubble.addEventListener('click', toggle);
    document.body.appendChild(bubble);
    // Window
    var win = document.createElement('div');
    win.id = WINDOW_ID;
    win.innerHTML = '' +
      '<div class="ac-header">' +
        '<div><div class="ac-title">AI 学习助手</div><div class="ac-sub">v41 · 内置指令 + 自由提问</div></div>' +
        '<div class="ac-actions">' +
          '<button data-act="clear" type="button">清空</button>' +
          '<button data-act="close" type="button">×</button>' +
        '</div>' +
      '</div>' +
      '<div class="ac-messages" id="acMessages"></div>' +
      '<div class="ac-quick">' +
        '<button data-q="推荐练习" type="button">推荐练习</button>' +
        '<button data-q="解释这道题" type="button">解释这道题</button>' +
        '<button data-q="讲解 M-Alg-1a" type="button">讲解 M-Alg-1a</button>' +
        '<button data-q="出 5 道 SAT Math 题" type="button">出 5 道题</button>' +
      '</div>' +
      '<div class="ac-input">' +
        '<input type="text" id="acInput" placeholder="输入消息，回车发送…" maxlength="500">' +
        '<button id="acSend" type="button">发送</button>' +
      '</div>';
    document.body.appendChild(win);

    // Wire events
    win.addEventListener('click', function(e) {
      var t = e.target;
      if (!t) return;
      if (t.tagName === 'BUTTON') {
        var act = t.getAttribute('data-act');
        if (act === 'close') close();
        if (act === 'clear') { if (confirm('清空当前对话历史？')) clear(); }
        var q = t.getAttribute('data-q');
        if (q) {
          var input = document.getElementById('acInput');
          if (input) { input.value = q; doSend(); }
        }
      }
    });
    var input = document.getElementById('acInput');
    var sendBtn = document.getElementById('acSend');
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    });
    sendBtn.addEventListener('click', doSend);

    function doSend() {
      var v = input.value.trim();
      if (!v || state.busy) return;
      input.value = '';
      send(v);
    }

    // Try to detect current subject/qid from body
    var body = document.body;
    if (body) {
      var s = body.getAttribute('data-subject');
      if (s) state.currentSubject = s;
    }
    // current qid detection (best effort)
    var firstQ = document.querySelector('.q[id]');
    if (firstQ) state.currentQid = firstQ.id;
  }

  function open() {
    if (!document.getElementById(BUBBLE_ID)) buildUI();
    var win = document.getElementById(WINDOW_ID);
    if (win) { win.classList.add('open'); state.open = true; }
    state.history = loadHistory();
    renderMessages();
  }

  function close() {
    var win = document.getElementById(WINDOW_ID);
    if (win) { win.classList.remove('open'); state.open = false; }
  }

  function toggle() {
    if (state.open) close(); else open();
  }

  function destroy() {
    var b = document.getElementById(BUBBLE_ID);
    if (b) b.remove();
    var w = document.getElementById(WINDOW_ID);
    if (w) w.remove();
    state.open = false;
  }

  // ---------------- Public API ----------------
  window.AIChat = {
    open: open,
    close: close,
    toggle: toggle,
    destroy: destroy,
    send: send,
    clear: clear,
    history: history,
    setSubject: function(s) { state.currentSubject = s; },
    setCurrentQid: function(q) { state.currentQid = q; },
    routeCommand: routeCommand,
    _state: state
  };

  // Auto-mount bubble on load (any page). Comment out to disable auto-open UI.
  function tryAutoMount() {
    if (document.getElementById(BUBBLE_ID)) return;
    if (document.body) buildUI();
    else document.addEventListener('DOMContentLoaded', buildUI);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoMount);
  } else {
    tryAutoMount();
  }
})();
