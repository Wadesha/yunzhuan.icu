#!/usr/bin/env node
/**
 * ssr-prerender.js v58
 *
 * 用 jsdom 渲染所有 60+ HTML 页面，每个页面追加：
 *   - <title>（若缺失则基于文件名生成）
 *   - <meta name="description">
 *   - <meta name="keywords">
 *   - OpenGraph 标签 (og:title / og:description / og:type / og:url / og:image)
 *   - Twitter Card 标签
 *   - <link rel="canonical">
 *
 * 输出到 _prerendered/<原路径>.html
 * 同时输出 _prerendered/sitemap.xml
 *
 * 用法：
 *   node js/ssr-prerender.js [--root=.] [--out=_prerendered] [--base=https://yunzhuan.icu]
 *
 * 依赖：
 *   - jsdom     (npm i jsdom)
 */
'use strict';

var fs = require('fs');
var path = require('path');
var url = require('url');

// 尝试加载 jsdom
var jsdom;
try {
  jsdom = require('jsdom');
} catch (e) {
  console.error('[ssr-prerender] 缺少依赖 jsdom，请先执行: npm i jsdom');
  process.exit(1);
}
var JSDOM = jsdom.JSDOM;

// === Args ===
function parseArgs() {
  var argv = process.argv.slice(2);
  var opts = { root: '.', out: '_prerendered', base: 'https://yunzhuan.icu' };
  for (var i = 0; i < argv.length; i++) {
    var a = argv[i];
    if (a.indexOf('--root=') === 0) opts.root = a.substring(7);
    else if (a.indexOf('--out=') === 0) opts.out = a.substring(5);
    else if (a.indexOf('--base=') === 0) opts.base = a.substring(7);
  }
  return opts;
}

// === Meta generator ===
var DEFAULT_DESC = 'yunzhuan.icu - US college application hub. 8 subjects practice, AI tutor, mock tests, PWA & mini program.';
var DEFAULT_KEYWORDS = 'college application, SAT, ACT, AP, IB, A-Level, IGCSE, TOEFL, IELTS, 留学, 申请, 刷题';
var DEFAULT_OG_IMAGE = '/screenshot/home-wide.png';

var SUBJECT_DESC = {
  'sat': 'SAT is the U.S. college admission test. Practice 120 questions across Reading & Writing and Math with detailed solutions.',
  'act': 'ACT practice: English, Math, Reading, Science. 120 questions with solutions and AI tutor.',
  'ap': 'AP practice: 38 subjects, 1-5 score system. Free Response Questions (FRQ) and study materials.',
  'ib': 'IB Diploma practice: 6 subject groups, 45-point max. HL/SL split with detailed topic coverage.',
  'alevel': 'A-Level practice: AS + A2, A*-E grading. Math, Physics, Chemistry, Biology, Economics.',
  'igcse': 'IGCSE practice: Core and Extended tiers, A*-G. Math 0580, Physics 0625, Chemistry 0620.',
  'toefl': 'TOEFL iBT practice: Reading, Listening, Speaking, Writing. 0-120 scoring with audio materials.',
  'ielts': 'IELTS practice: 4 sections, 0-9.0 band. Listening, Reading, Writing, Speaking simulation.',
  'amc': 'AMC practice: AMC 8/10/12, AIME. 30+ problems per set with detailed solutions.'
};

function generateMeta(filePath, html) {
  // 从文件路径推导信息
  var relative = filePath.replace(/\\/g, '/');
  var basename = path.basename(relative, '.html');
  var parts = relative.split('/');
  var section = parts[parts.length - 2] || 'home';

  // Title 推导
  var title = '';
  var titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    title = titleMatch[1].trim();
  } else {
    title = basename.charAt(0).toUpperCase() + basename.slice(1) + ' | yunzhuan.icu';
  }

  // Description
  var desc = DEFAULT_DESC;
  var subjKey = Object.keys(SUBJECT_DESC).find(function (k) {
    return relative.toLowerCase().indexOf('/' + k + '/') !== -1 || basename.toLowerCase().indexOf(k) === 0;
  });
  if (subjKey) desc = SUBJECT_DESC[subjKey];
  else if (/index\.html$/.test(relative)) desc = 'yunzhuan.icu - ' + section + ' hub. 留学申请一站式平台。';

  // Keywords
  var keywords = DEFAULT_KEYWORDS;
  if (subjKey) keywords = subjKey.toUpperCase() + ', ' + keywords;

  return {
    title: title,
    description: desc,
    keywords: keywords
  };
}

function buildMetaTags(meta, fileUrl) {
  var lines = [];
  lines.push('<title>' + escapeHtml(meta.title) + '</title>');
  lines.push('<meta name="description" content="' + escapeHtml(meta.description) + '">');
  lines.push('<meta name="keywords" content="' + escapeHtml(meta.keywords) + '">');
  lines.push('<meta name="author" content="yunzhuan.icu">');
  lines.push('<meta name="robots" content="index, follow">');
  lines.push('<meta name="theme-color" content="#667eea">');
  // canonical
  lines.push('<link rel="canonical" href="' + fileUrl + '">');
  // OpenGraph
  lines.push('<meta property="og:title" content="' + escapeHtml(meta.title) + '">');
  lines.push('<meta property="og:description" content="' + escapeHtml(meta.description) + '">');
  lines.push('<meta property="og:type" content="website">');
  lines.push('<meta property="og:url" content="' + fileUrl + '">');
  lines.push('<meta property="og:site_name" content="yunzhuan.icu">');
  lines.push('<meta property="og:image" content="' + DEFAULT_OG_IMAGE + '">');
  lines.push('<meta property="og:locale" content="en_US">');
  lines.push('<meta property="og:locale:alternate" content="zh_CN">');
  lines.push('<meta property="og:locale:alternate" content="ja_JP">');
  // Twitter Card
  lines.push('<meta name="twitter:card" content="summary_large_image">');
  lines.push('<meta name="twitter:title" content="' + escapeHtml(meta.title) + '">');
  lines.push('<meta name="twitter:description" content="' + escapeHtml(meta.description) + '">');
  lines.push('<meta name="twitter:image" content="' + DEFAULT_OG_IMAGE + '">');
  return lines.join('\n    ');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectMetaIntoHead(html, metaBlock) {
  // 若已存在 title，则替换 <title> 标签并在其后插入其他 meta
  var hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
  var hasDescription = /<meta\s+name=["']description["']/i.test(html);

  if (hasTitle) {
    // 替换 title，并在其后插入缺失的 meta
    var titleMatch = html.match(/<title[^>]*>[\s\S]*?<\/title>/i);
    var titleLine = metaBlock.split('\n')[0];
    html = html.replace(titleMatch[0], titleLine);
    // 检查缺失项，单独插入
    var insertIdx = html.indexOf('</title>') + '</title>'.length;
    var before = html.substring(0, insertIdx);
    var after = html.substring(insertIdx);
    // 其余 meta
    var otherMeta = metaBlock.split('\n').slice(1).join('\n');
    // 过滤掉已有的 description / canonical
    if (hasDescription) {
      otherMeta = otherMeta.split('\n').filter(function (l) {
        return !/name=["']description["']/i.test(l) && !/rel=["']canonical["']/i.test(l);
      }).join('\n');
    }
    return before + '\n    ' + otherMeta + after;
  } else {
    // 插入到 <head> 末尾
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, '<head$1>\n    ' + metaBlock);
    } else {
      // 没有 head，则插入
      return html.replace(/<html([^>]*)>/i, '<html$1>\n<head>\n    ' + metaBlock + '\n</head>');
    }
  }
}

// === Walk html files ===
function walkHtml(root) {
  var result = [];
  function recurse(dir) {
    var entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var ent = entries[i];
      var full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        // 跳过 _prerendered / node_modules / .git
        if (ent.name === '_prerendered' || ent.name === 'node_modules' || ent.name === '.git' || ent.name === '__pycache__') continue;
        // 跳过 snapshots 体积过大
        if (ent.name === 'snapshots') continue;
        recurse(full);
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.html')) {
        result.push(full);
      }
    }
  }
  recurse(root);
  return result;
}

// === Prerender one file ===
function prerenderFile(srcPath, opts) {
  var rel = path.relative(opts.root, srcPath).replace(/\\/g, '/');
  var outPath = path.join(opts.out, rel);
  var outDir = path.dirname(outPath);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  var html;
  try { html = fs.readFileSync(srcPath, 'utf-8'); } catch (e) {
    console.warn('[skip] ' + srcPath + ' (' + e.message + ')');
    return { ok: false, src: rel };
  }

  // 用 jsdom 解析（不改 DOM，只为校验合法性）
  try {
    var dom = new JSDOM(html);
    // 校验通过
  } catch (e) {
    console.warn('[parse-error] ' + rel + ' - ' + e.message);
  }

  var meta = generateMeta(rel, html);
  var fileUrl = opts.base + '/' + rel;
  var metaBlock = buildMetaTags(meta, fileUrl);
  var newHtml = injectMetaIntoHead(html, metaBlock);

  try {
    fs.writeFileSync(outPath, newHtml, 'utf-8');
    return { ok: true, src: rel, out: path.relative(opts.root, outPath) };
  } catch (e) {
    console.warn('[write-error] ' + outPath + ' - ' + e.message);
    return { ok: false, src: rel };
  }
}

// === Sitemap ===
function buildSitemap(urls, opts) {
  var xml = [];
  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (var i = 0; i < urls.length; i++) {
    var u = urls[i];
    xml.push('  <url>');
    xml.push('    <loc>' + escapeHtml(u.loc) + '</loc>');
    xml.push('    <lastmod>' + (u.lastmod || new Date().toISOString().slice(0, 10)) + '</lastmod>');
    xml.push('    <changefreq>' + (u.changefreq || 'weekly') + '</changefreq>');
    xml.push('    <priority>' + (u.priority || '0.7') + '</priority>');
    xml.push('  </url>');
  }
  xml.push('</urlset>');
  return xml.join('\n');
}

// === Main ===
function main() {
  var opts = parseArgs();
  console.log('[ssr-prerender] root=' + opts.root + ' out=' + opts.out + ' base=' + opts.base);

  if (!fs.existsSync(opts.out)) fs.mkdirSync(opts.out, { recursive: true });

  var files = walkHtml(opts.root);
  console.log('[ssr-prerender] found ' + files.length + ' html files');

  var success = 0, fail = 0;
  var urls = [];
  for (var i = 0; i < files.length; i++) {
    var r = prerenderFile(files[i], opts);
    if (r.ok) {
      success++;
      var rel = r.out || path.relative(opts.root, files[i]).replace(/\\/g, '/');
      var loc = opts.base + '/' + rel;
      // 优先级：index 0.9，子页面 0.7
      var priority = /index\.html$/.test(rel) ? '0.9' : '0.7';
      urls.push({ loc: loc, priority: priority });
    } else {
      fail++;
    }
  }
  console.log('[ssr-prerender] done: ' + success + ' ok, ' + fail + ' fail');

  // 写 sitemap
  var sitemap = buildSitemap(urls, opts);
  fs.writeFileSync(path.join(opts.out, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('[ssr-prerender] sitemap.xml written (' + urls.length + ' urls)');
}

if (require.main === module) {
  main();
}

module.exports = { prerenderFile: prerenderFile, buildMetaTags: buildMetaTags, generateMeta: generateMeta, walkHtml: walkHtml };
