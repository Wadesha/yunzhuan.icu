# yunzhuan.icu SEO 最佳实践 (v58)

本文档定义 yunzhuan.icu 全站的 **SEO 规范 + meta 标签模板 + 预渲染流程**。所有新增页面需遵循此规范。

---

## 1. 必加 meta 标签

每个 HTML 页面 **必须** 包含以下标签（在 `<head>` 中）：

```html
<!-- 基础 -->
<title>页面名 - 副标题 | yunzhuan.icu</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="120-160 字符，含核心关键词。">
<meta name="keywords" content="keyword1, keyword2, keyword3">
<meta name="author" content="yunzhuan.icu">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#667eea">
<link rel="canonical" href="https://yunzhuan.icu/path/to/page.html">

<!-- OpenGraph（社交分享） -->
<meta property="og:title" content="页面名 | yunzhuan.icu">
<meta property="og:description" content="同 description">
<meta property="og:type" content="website">
<meta property="og:url" content="https://yunzhuan.icu/path/to/page.html">
<meta property="og:site_name" content="yunzhuan.icu">
<meta property="og:image" content="https://yunzhuan.icu/screenshot/home-wide.png">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="zh_CN">
<meta property="og:locale:alternate" content="ja_JP">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="同 og:title">
<meta name="twitter:description" content="同 og:description">
<meta name="twitter:image" content="同 og:image">
```

---

## 2. 标签字符数规范

| 标签 | 字符数 | 备注 |
|------|--------|------|
| `<title>` | 50-60 | 超出被搜索引擎截断 |
| `<meta description>` | 120-160 | 超出/不足都会降权 |
| `<meta keywords>` | 5-10 个词 | 防止堆砌 |
| `<og:title>` | 60-90 | 移动端分享卡片显示 |
| `<og:description>` | 100-200 | 决定社交分享点击率 |
| `og:image` | 1200×630 px | 最佳展示尺寸 |

---

## 3. 页面 meta 模板（按目录）

### 3.1 首页 `/index.html`

```html
<title>yunzhuan.icu - US College Application Hub | 留学申请一站式</title>
<meta name="description" content="US college application hub: 8 subjects practice, AI tutor, mock tests, PWA. 留学申请一站式平台。">
<meta name="keywords" content="college application, US college, 留学, 申请, SAT, ACT, AP, IB, A-Level, IGCSE, TOEFL, IELTS, 刷题, 模拟考">
```

### 3.2 科目页（SAT/ACT/AP/IB/A-Level/IGCSE/TOEFL/IELTS）

```html
<title>SAT Practice - 120 题 + Mock Test | yunzhuan.icu</title>
<meta name="description" content="SAT Digital practice 120 题：Reading & Writing + Math。Mock test、错题本、AI 讲解。">
<meta name="keywords" content="SAT, SAT practice, Digital SAT, 120 questions, mock test, 刷题, 模拟考">
```

### 3.3 比赛页（AMC/AIME/USABO/UKCHO…）

```html
<title>AMC Practice - 30 题 + 解析 | yunzhuan.icu</title>
<meta name="description" content="AMC 10/12 practice 30 题。含 AIME 衔接，每题详细解析。">
<meta name="keywords" content="AMC, AMC 10, AMC 12, AIME, math competition, 数学竞赛">
```

### 3.4 Practice 子页（mock-test / dashboard / collab / vocab / notes / writing-lab…）

```html
<title>Mock Test - 模拟考 | yunzhuan.icu</title>
<meta name="description" content="按科目生成完整模拟卷：计时答题、自动评分、错题入本。">
<meta name="keywords" content="mock test, 模拟考, 计时, 自动评分">
```

### 3.5 学校页（US/UK/CA/AU/SG/HK）

```html
<title>Harvard University - 申请要求 + 录取数据 | yunzhuan.icu</title>
<meta name="description" content="Harvard 申请要求、录取率、热门专业、申请截止日期。Comprehensive application guide。">
<meta name="keywords" content="Harvard, 哈佛, 申请, 录取率, 截止日期">
```

---

## 4. 预渲染（SSR Prerender）流程

yunzhuan.icu 静态站点使用 **build-time pre-render** 提升 SEO 收录速度。

### 4.1 工具
- 脚本：`/js/ssr-prerender.js`
- 依赖：`jsdom` (npm i jsdom)
- 输出目录：`_prerendered/`

### 4.2 执行
```bash
# 安装依赖
npm i jsdom --save-dev

# 执行预渲染
node js/ssr-prerender.js --root=. --out=_prerendered --base=https://yunzhuan.icu

# 部署：将 _prerendered/ 内容覆盖到生产根目录
cp -r _prerendered/* /var/www/yunzhuan.icu/
```

### 4.3 CI 集成（GitHub Actions 示例）
```yaml
- name: Prerender
  run: |
    npm ci
    node js/ssr-prerender.js --root=. --out=_prerendered
- name: Deploy
  run: |
    rsync -av _prerendered/ user@server:/var/www/yunzhuan.icu/
```

### 4.4 输出验证
```bash
# 验证 title 数量
grep -c "<title>" _prerendered/index.html

# 验证 description
grep -c 'name="description"' _prerendered/index.html

# 验证 canonical
grep -c 'rel="canonical"' _prerendered/index.html

# 验证 sitemap
xmllint --noout _prerendered/sitemap.xml
```

---

## 5. sitemap.xml 规范

- 文件位置：`/sitemap.xml`（生产环境必须可访问）
- 自动生成：每次部署前由 `ssr-prerender.js` 重写
- 单文件限制：50,000 URL / 50MB（yunzhuan 当前约 864 个，远未触限）
- 提交到：
  - Google Search Console: https://search.google.com/search-console
  - 百度搜索资源平台: https://ziyuan.baidu.com/

---

## 6. robots.txt 规范

- 文件位置：`/robots.txt`
- 必须 `Allow: /` + `Sitemap:` 指令
- 排除重复/低质目录：`/snapshots/` `/__pycache__/` 等
- 当前配置见 `/robots.txt`

---

## 7. 多语言 SEO（hreflang）

i18n 三个语言版本通过 `<html lang>` + `og:locale:alternate` 标识：

```html
<html lang="zh-CN">
<meta property="og:locale" content="zh_CN">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="ja_JP">
```

**进阶方案（URL 级）**：为每语言建独立子目录（如 `/en/` `/ja/`），加 `<link rel="alternate" hreflang="...">`：

```html
<link rel="alternate" hreflang="zh-CN" href="https://yunzhuan.icu/page.html">
<link rel="alternate" hreflang="en-US" href="https://yunzhuan.icu/en/page.html">
<link rel="alternate" hreflang="ja-JP" href="https://yunzhuan.icu/ja/page.html">
<link rel="alternate" hreflang="x-default" href="https://yunzhuan.icu/page.html">
```

---

## 8. 性能指标（Core Web Vitals）

- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

措施：
- 字体：`preload` + `display=swap`
- 图片：`width/height` 属性 + `loading="lazy"`
- 第三方脚本：`defer` / `async` / 延迟到 `DOMContentLoaded` 后

---

## 9. 结构化数据（JSON-LD）

首页推荐加 Organization + WebSite schema：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "yunzhuan.icu",
  "alternateName": "云转",
  "url": "https://yunzhuan.icu/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yunzhuan.icu/search.html?q={query}",
    "query-input": "required name=query"
  }
}
</script>
```

刷题页推荐加 Course schema：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "SAT Practice 2026",
  "description": "120 道 SAT 题目 + 解析",
  "provider": { "@type": "Organization", "name": "yunzhuan.icu" }
}
</script>
```

---

## 10. 检测与监控

- Google Search Console: 索引覆盖、Core Web Vitals、手动操作
- Bing Webmaster Tools: 索引、SEO 问题
- 百度搜索资源平台: 国内 SEO
- Lighthouse CI: 每周跑一次性能审计

---

## 11. SEO Meta 表（v58 新增页面）

| 页面 | Title | Description | OG Image |
|------|-------|-------------|----------|
| `/index.html` | yunzhuan.icu - US College Application Hub | US college application hub... | home-wide.png |
| `/academics/practice/index.html` | Practice - 刷题中心 | 考纲 · 模拟考题 · 刷题追踪 | home-wide.png |
| `/academics/practice/dashboard.html` | Dashboard - 学习仪表盘 | 全科目数据分析 | home-wide.png |
| `/academics/practice/mock-test.html` | Mock Test - 模拟考 | 完整模拟卷 + 计时 | home-wide.png |
| `/academics/practice/install.html` | Install yunzhuan App · 教程 | 添加到桌面，离线可用 | home-wide.png |
| `/academics/practice/i18n-demo.html` | i18n Demo - 国际化演示 | 中/英/日三语切换 | home-wide.png |
| `/analytics.html` | Analytics Dashboard | 数据统计与事件追踪 | home-wide.png |
| `/miniprogram/` | yunzhuan.icu 微信小程序 | 留学申请小程序 | home-wide.png |
| 8 科目页 | `<SUBJECT> Practice - 120 题` | 120 道题 + 解析 | home-wide.png |
| 学校页 | `<学校> - 申请要求` | 申请要求 + 录取数据 | home-wide.png |

---

## 12. 维护清单

- [ ] 新增页面时同步 sitemap（PR 阶段自动检查）
- [ ] title 改版 → 同步 OG / Twitter Card
- [ ] 文案修改 → 同步 description（120-160 字符）
- [ ] 季度 review Core Web Vitals
- [ ] 半年 review robots.txt / sitemap

---

> 最后更新：v58 · 2026-07-29
