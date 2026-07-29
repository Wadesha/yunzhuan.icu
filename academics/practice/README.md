# Practice 刷题中心

## 项目简介

Practice 是一个面向国际课程体系（IB / A-Level / IGCSE / AP）和标准化考试（SAT / ACT / TOEFL / IELTS）的在线刷题与学习追踪平台。

## 功能列表

| 模块 | 说明 |
|------|------|
| **8 科题库** | SAT / ACT / AP / IB / A-Level / TOEFL / IELTS / IGCSE 共 960+ 题 |
| **考纲浏览** | 按 Paper / Unit / Topic 三级结构浏览官方考纲 |
| **在线答题** | 计时答题 / 难度分级 / 错题自动入本 / 进度 localStorage 持久化 |
| **模拟考试** | Mock Test 按权重智能组卷 / 自动评分 / 自适应难度调整 |
| **数据仪表盘** | 知识点掌握度热力图 / 7 天自适应排期 / 错题专练 |
| **AI 辅导** | 薄弱项诊断 / 题目解析 / 写作评分 |
| **家长查看** | 只读模式查看学生数据 / 周报 / 成绩单 / 学习建议 |
| **小组协作** | 创建房间 / 共享题库 / 讨论聊天 / 排行榜 |
| **开放 API** | `window.SYLLABUS_DATA` / `YZPractice` / `Collab` 等对外接口 |

## 快速开始

```bash
# 克隆项目后直接用浏览器打开
cd academics/practice
python3 -m http.server 8080

# 访问
open http://localhost:8080/index.html
```

## 目录结构

```
academics/practice/
├── index.html          # 练习中心首页（8 科入口）
├── mock-test.html      # 模拟考试
├── dashboard.html      # 数据仪表盘
├── collab.html         # 小组协作（v35）
├── parent.html         # 家长/导师查看模式（v36）
├── api.html            # API 开放文档（v37）
├── 404.html            # 404 页面（v38）
├── build.sh            # 打包脚本（v38）
├── README.md
├── sat/                # SAT 专区
├── act/                # ACT 专区
├── ap/                 # AP 专区
├── ib/                 # IB 专区
├── alevel/             # A-Level 专区
├── toefl/              # TOEFL 专区
├── ielts/              # IELTS 专区
└── igcse/              # IGCSE 专区
```

## 技术栈

- **前端**：原生 HTML / CSS / JavaScript（无框架依赖）
- **存储**：localStorage 本地持久化
- **数据层**：`SYLLABUS_DATA` v13 · 结构化考纲 JSON
- **练习引擎**：`practice-engine.js` v6 · 答题 + 错题本 + Dark Mode
- **协作**：`collab.js` v1 · localStorage 模拟多人协作
- **主题**：CSS 变量驱动的 Light / Dark 主题切换

## 开放 API

所有核心功能通过 `window.*` 对象暴露，可在浏览器控制台或第三方 MCP 工具中直接调用：

```javascript
// 获取 SAT 考纲
var sat = SYLLABUS_DATA.getSubject('sat');

// 查看答题记录
var records = YZPractice.getRecords();

// 创建协作房间
var room = Collab.createRoom('我的房间', '昵称');
```

详细 API 文档见 [api.html](api.html)。

## 打包发布

```bash
# 运行打包脚本
bash build.sh

# 产物：dist/ 目录 + practice-site-YYYYMMDD-HHMMSS.zip
```

## 版本历史

| 版本 | 核心功能 |
|------|----------|
| v10 | 8 科 960 题定稿 |
| v11-v12 | 考纲细分到 Topic 级 + 题目双向对齐 |
| v13-v14 | 结构化考纲 JSON + URL Topic 筛选 |
| v15-v16 | 覆盖率仪表盘 + 数据互通 |
| v17-v18 | 体验升级 + 逐题解析 + 主观题 |
| v35 | 小组协作（localStorage 模拟） |
| v36 | 家长/导师查看模式 |
| v37 | API 开放 + MCP 集成 |
| v38 | 打包发布 + 性能优化 |