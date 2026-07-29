/**
 * Syllabus Viewer v21
 * 将单页长考纲改为结构化浏览：
 *   1) 侧边 sticky TOC（按 h2/h3 两级）
 *   2) 中间单节显示（按 h2 切块）
 *   3) 底部 Prev/Next Section 导航
 *   4) Overview 模式一键切换（回到整页展开）
 *   5) URL hash 同步（#overview 总览 / #h2-x-h3-y 具体节）
 *
 * 使用方式：
 *   <link rel="stylesheet" href="../../js/syllabus-viewer.css">
 *   <body data-subject="ib">  ...  <script src="../../js/syllabus-viewer.js"></script>  </body>
 */
(function () {
  'use strict';

  var STORE_PREFIX = 'yz_sv_';
  var body = document.body;
  var subject = body.getAttribute('data-subject') || 'generic';
  var STORAGE_KEY = STORE_PREFIX + 'mode_' + subject;

  // ------ CSS injector (standalone) ------
  function injectCSS() {
    var id = 'syllabus-viewer-css';
    if (document.getElementById(id)) return;
    var css = [
      '.sv-layout{display:flex;gap:24px;max-width:1280px;margin:0 auto;}',
      '.sv-toc{flex:0 0 260px;position:sticky;top:16px;align-self:flex-start;max-height:calc(100vh - 32px);overflow:auto;border:1px solid #e0e0e0;background:#fff;padding:16px 14px;font-size:0.85rem;}',
      '.sv-toc h3{font-size:0.9rem;margin:0 0 10px;padding-bottom:6px;border-bottom:1px solid #111;}',
      '.sv-toc ul{list-style:none;margin:0;padding-left:0;}',
      '.sv-toc li ul{padding-left:14px;margin-top:2px;}',
      '.sv-toc a{display:block;padding:3px 6px;text-decoration:none;color:#333;border-bottom:none;border-left:2px solid transparent;}',
      '.sv-toc a:hover{background:#f5f5f5;}',
      '.sv-toc a.active{border-left-color:#111;background:#fafafa;font-weight:700;color:#111;}',
      '.sv-toc .sv-h2-link{font-weight:600;margin-top:4px;}',
      '.sv-toc .sv-h3-link{font-size:0.82rem;color:#555;}',
      '.sv-main{flex:1 1 auto;min-width:0;}',
      '.sv-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:8px 12px;border:1px solid #e0e0e0;background:#fafafa;font-size:0.85rem;}',
      '.sv-toolbar button{background:#fff;border:1px solid #111;padding:3px 10px;font-family:inherit;cursor:pointer;font-weight:600;}',
      '.sv-toolbar button.active{background:#111;color:#fff;}',
      '.sv-section{border:1px solid #e0e0e0;background:#fff;padding:18px 20px;margin-bottom:12px;}',
      '.sv-section.hidden{display:none;}',
      '.sv-progress{margin-left:auto;color:#888;}',
      '.sv-nav{display:flex;justify-content:space-between;margin:16px 0 24px;}',
      '.sv-nav a,.sv-nav button{border:1px solid #111;background:#fff;padding:6px 14px;text-decoration:none;color:#111;font-weight:600;font-size:0.88rem;cursor:pointer;font-family:inherit;}',
      '.sv-nav a:hover,.sv-nav button:hover{background:#111;color:#fff;}',
      '.sv-nav .disabled{opacity:0.35;pointer-events:none;border-style:dashed;}',
      '.sv-footer-hint{color:#888;font-size:0.82rem;margin-top:24px;padding-top:12px;border-top:1px dashed #ccc;}',
      '@media (max-width:900px){',
      '  .sv-layout{flex-direction:column;}',
      '  .sv-toc{position:static;max-height:none;flex:0 0 auto;}',
      '  .sv-toc{display:none;}',
      '  body.sv-toc-open .sv-toc{display:block;}',
      '  .sv-mobile-toggle{display:block !important;}',
      '}',
      '.sv-mobile-toggle{display:none;background:#fff;border:1px solid #111;padding:4px 10px;margin-right:8px;font-size:0.85rem;cursor:pointer;}',
    ].join('\n');
    var s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ------ Data structures ------
  function slugify(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fa5\-_]/g, '');
  }

  // Extract sections: find each h2, collect content until next h2
  function extractSections() {
    // Work with the original body content (before we wrap it)
    var sections = [];
    var current = null;
    var foundH2 = false;

    // Only scan children of <body>, excluding original header/footer nav that are outside sections
    var children = Array.prototype.slice.call(body.children);
    // Pre-scan: find the area between the first <h1> / .nav end and .footer / end
    var started = false;
    var skippedStart = []; // Keep nav/h1/subtitle boxes before first h2

    children.forEach(function (el) {
      var tag = el.tagName;
      if (!tag) return;
      if (!started) {
        // Start collecting at first <h2> (unless it's just header info)
        if (tag === 'H2') {
          started = true;
          // Fall through: treat this as first h2
        } else {
          skippedStart.push(el);
          return;
        }
      }
      if (tag === 'H2') {
        foundH2 = true;
        current = {
          h2: el,
          h2Text: el.textContent.trim(),
          id: 'h2-' + (sections.length + 1) + '-' + slugify(el.textContent),
          h3s: [],
          nodes: [],
          mutedQ: null,  // 对应Q div that belongs to last h3 in this section
        };
        sections.push(current);
      } else if (tag === 'H3') {
        if (!current) return;
        var h3 = {
          h3: el,
          h3Text: el.textContent.trim(),
          id: current.id + '--h3-' + (current.h3s.length + 1) + '-' + slugify(el.textContent),
          nodes: [],
          mutedQ: null,
        };
        current.h3s.push(h3);
      } else {
        if (!current) return;
        // Classify as part of section or last h3
        if (current.h3s.length > 0) {
          var lastH3 = current.h3s[current.h3s.length - 1];
          // muted div with 对应Q -> belongs to last h3
          if (el.classList && el.classList.contains('muted') && /对应Q|Topic 锚点|刷全本Topic/.test(el.textContent || '')) {
            lastH3.mutedQ = el;
          } else {
            lastH3.nodes.push(el);
          }
        } else {
          // No h3s yet, part of section directly (e.g. overview paragraph, table)
          if (el.classList && el.classList.contains('muted') && /对应Q|Topic 锚点|刷全本Topic/.test(el.textContent || '')) {
            current.mutedQ = el;
          } else {
            current.nodes.push(el);
          }
        }
      }
    });

    return { sections: sections, skippedStart: skippedStart, foundH2: foundH2 };
  }

  // ------ Render ------
  function buildTOC(sections) {
    var nav = document.createElement('nav');
    nav.className = 'sv-toc';
    nav.setAttribute('aria-label', 'Syllabus Table of Contents');
    var html = '<h3>📚 考纲目录</h3><ul>';
    sections.forEach(function (sec, i) {
      html += '<li>';
      html += '<a class="sv-h2-link" href="#' + sec.id + '" data-sv-section="' + i + '">' +
        '<strong>' + (i + 1) + '.</strong> ' + escapeHTML(sec.h2Text) + '</a>';
      if (sec.h3s.length) {
        html += '<ul>';
        sec.h3s.forEach(function (h, j) {
          html += '<li><a class="sv-h3-link" href="#' + h.id + '" data-sv-section="' + i + '" data-sv-h3="' + j + '">' +
            escapeHTML(h.h3Text) + '</a></li>';
        });
        html += '</ul>';
      }
      html += '</li>';
    });
    html += '</ul>';
    nav.innerHTML = html;
    return nav;
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cloneNodesInto(container, nodes) {
    nodes.forEach(function (n) {
      container.appendChild(n);
    });
  }

  function buildSectionCard(sec, idx) {
    var card = document.createElement('section');
    card.className = 'sv-section';
    card.id = sec.id;
    card.setAttribute('data-sv-section', String(idx));

    // h2
    var h2 = document.createElement('h2');
    h2.textContent = sec.h2Text;
    // Copy original classes
    if (sec.h2.getAttribute('class')) h2.setAttribute('class', sec.h2.getAttribute('class'));
    card.appendChild(h2);

    // Top-level content (before any h3)
    if (sec.nodes.length) {
      var wrapper = document.createElement('div');
      wrapper.className = 'sv-section-head';
      cloneNodesInto(wrapper, sec.nodes);
      card.appendChild(wrapper);
    }
    if (sec.mutedQ) {
      card.appendChild(sec.mutedQ);
    }

    // Each h3 block
    sec.h3s.forEach(function (h, j) {
      var h3el = document.createElement('h3');
      h3el.textContent = h.h3Text;
      if (h.h3.getAttribute('class')) h3el.setAttribute('class', h.h3.getAttribute('class'));
      h3el.id = h.id;
      h3el.setAttribute('data-sv-h3', String(j));
      card.appendChild(h3el);

      var h3wrap = document.createElement('div');
      h3wrap.className = 'sv-h3-body';
      cloneNodesInto(h3wrap, h.nodes);
      card.appendChild(h3wrap);
      if (h.mutedQ) card.appendChild(h.mutedQ);
    });

    return card;
  }

  function render(sections, skippedStart) {
    // 1) Clear body
    var frag = document.createDocumentFragment();

    // Keep original nav/h1/subtitle intro
    skippedStart.forEach(function (el) { frag.appendChild(el); });

    // 2) Layout
    var layout = document.createElement('div');
    layout.className = 'sv-layout';

    //   A) Toolbar (goes above layout, inside main)
    var toolbar = document.createElement('div');
    toolbar.className = 'sv-toolbar';
    var mobileToggle = document.createElement('button');
    mobileToggle.className = 'sv-mobile-toggle';
    mobileToggle.textContent = '☰ 目录';
    mobileToggle.type = 'button';
    mobileToggle.onclick = function () { body.classList.toggle('sv-toc-open'); };
    toolbar.appendChild(mobileToggle);

    var btnSingle = document.createElement('button');
    btnSingle.textContent = '按节浏览';
    btnSingle.type = 'button';
    var btnAll = document.createElement('button');
    btnAll.textContent = '总览模式';
    btnAll.type = 'button';
    toolbar.appendChild(btnSingle);
    toolbar.appendChild(btnAll);

    var prog = document.createElement('span');
    prog.className = 'sv-progress';
    toolbar.appendChild(prog);

    //   B) TOC
    var toc = buildTOC(sections);

    //   C) Main column
    var main = document.createElement('div');
    main.className = 'sv-main';
    main.appendChild(toolbar);

    //      Cards container
    var cardsWrap = document.createElement('div');
    cardsWrap.className = 'sv-cards';
    sections.forEach(function (sec, i) {
      cardsWrap.appendChild(buildSectionCard(sec, i));
    });
    main.appendChild(cardsWrap);

    //      Nav (Prev/Next)
    var nav = document.createElement('div');
    nav.className = 'sv-nav';
    var prev = document.createElement('button');
    prev.textContent = '← 上一节';
    prev.type = 'button';
    prev.className = 'sv-prev';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'sv-next';
    next.textContent = '下一节 →';
    nav.appendChild(prev);
    var spacer = document.createElement('span');
    spacer.style.flex = '1';
    nav.appendChild(spacer);
    nav.appendChild(next);
    main.appendChild(nav);

    var hint = document.createElement('div');
    hint.className = 'sv-footer-hint';
    hint.innerHTML = '提示：点击 <strong>按节浏览</strong> 仅显示当前章节，适合顺序阅读；<strong>总览模式</strong> 回到整页展开。<br>' +
      '键盘快捷键：<kbd>←</kbd> 上一节 / <kbd>→</kbd> 下一节 / <kbd>O</kbd> 模式切换';
    main.appendChild(hint);

    layout.appendChild(toc);
    layout.appendChild(main);

    frag.appendChild(layout);

    body.innerHTML = '';
    body.appendChild(frag);

    // ------ State ------
    var mode = (localStorage && localStorage.getItem(STORAGE_KEY)) || 'single'; // single | overview
    var current = 0;

    function applyMode() {
      var cards = cardsWrap.querySelectorAll('.sv-section');
      if (mode === 'overview') {
        cards.forEach(function (c) { c.classList.remove('hidden'); });
      } else {
        cards.forEach(function (c, idx) {
          c.classList.toggle('hidden', idx !== current);
        });
      }
      btnSingle.classList.toggle('active', mode === 'single');
      btnAll.classList.toggle('active', mode === 'overview');
      prog.textContent = (current + 1) + ' / ' + sections.length;
      prev.classList.toggle('disabled', mode === 'single' && current === 0);
      next.classList.toggle('disabled', mode === 'single' && current === sections.length - 1);
      if (localStorage) localStorage.setItem(STORAGE_KEY, mode);
      // Update TOC active
      var links = toc.querySelectorAll('a.sv-h2-link');
      links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    }

    function gotoSection(i, focusTop) {
      current = Math.max(0, Math.min(sections.length - 1, i));
      applyMode();
      if (focusTop !== false) {
        cardsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Sync hash
      var h = history;
      try { h.replaceState(null, '', '#' + sections[current].id); } catch (e) {}
    }

    btnSingle.onclick = function () { mode = 'single'; applyMode(); gotoSection(current, false); };
    btnAll.onclick = function () {
      mode = 'overview';
      applyMode();
      try { history.replaceState(null, '', '#overview'); } catch (e) {}
      toc.scrollTop = 0;
    };
    prev.onclick = function () { gotoSection(current - 1); };
    next.onclick = function () { gotoSection(current + 1); };

    // TOC clicks
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      e.preventDefault();
      var si = parseInt(a.getAttribute('data-sv-section'), 10);
      if (!isNaN(si)) {
        if (mode === 'overview') {
          mode = 'single';
          applyMode();
        }
        gotoSection(si);
        // Scroll to h3 anchor if present
        var h3i = a.getAttribute('data-sv-h3');
        if (h3i !== null) {
          setTimeout(function () {
            var card = cardsWrap.querySelector('.sv-section[data-sv-section="' + si + '"]');
            if (!card) return;
            var tgt = card.querySelector('[data-sv-h3="' + h3i + '"]');
            if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
        body.classList.remove('sv-toc-open');
      }
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft' && mode === 'single') { e.preventDefault(); gotoSection(current - 1); }
      else if (e.key === 'ArrowRight' && mode === 'single') { e.preventDefault(); gotoSection(current + 1); }
      else if (e.key === 'o' || e.key === 'O') {
        mode = (mode === 'overview') ? 'single' : 'overview';
        applyMode();
      }
    });

    // Initial section from hash
    function parseInitial() {
      var h = (location.hash || '').replace(/^#/, '');
      if (!h) return 0;
      if (h === 'overview') { mode = 'overview'; return 0; }
      // h2-x-...
      var m = h.match(/^h2-(\d+)/);
      if (m) return Math.min(sections.length - 1, parseInt(m[1], 10) - 1);
      // Fallback: try to find by id
      var el = document.getElementById(h);
      if (el) {
        var secEl = el.closest('.sv-section');
        if (secEl) return parseInt(secEl.getAttribute('data-sv-section') || '0', 10);
      }
      return 0;
    }
    var initial = parseInitial();
    gotoSection(initial, false);
    applyMode();
  }

  // ------ Init ------
  function init() {
    injectCSS();
    var data = extractSections();
    if (!data.foundH2) {
      // No h2 found — keep page as-is
      return;
    }
    if (data.sections.length === 0) return;
    render(data.sections, data.skippedStart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
