# yunzhuan.icu

> 最后更新：2026-07-27 00:00:00  
> 域名：yunzhuan.icu  
> 日期：2026/7/19 - 2027/7/18  
> 状态：✅ 已部署上线  
> 访问地址：https://yunzhuan.icu

---

## 目录

1. [项目简介](#1-项目简介)
2. [需求分析](#2-需求分析)
3. [方案选型](#3-方案选型)
4. [网站功能](#4-网站功能)
5. [目录结构](#5-目录结构)
6. [GitHub 仓库配置](#6-github-仓库配置)
7. [Vercel 部署](#7-vercel-部署)
8. [DNS 域名解析配置](#8-dns-域名解析配置)
9. [SSL 证书配置](#9-ssl-证书配置)
10. [快照机制](#10-快照机制)
11. [访问统计与管理后台](#11-访问统计与管理后台)
12. [微信访问说明](#12-微信访问说明)
13. [部署流程图](#13-部署流程图)
14. [常见问题与解决方案](#14-常见问题与解决方案)
15. [版本历史](#15-版本历史)
16. [开发规范](#16-开发规范)

---

## 1. 项目简介

yunzhuan.icu 是一个美国大学本科专业导航网站，涵盖 8 大类 44 个专业，每个专业有中英文介绍和 7 门核心课程详情。网站采用纯静态 HTML 开发，部署在 Vercel 上，绑定自定义域名 yunzhuan.icu。

---

## 2. 需求分析

### 2.1 用户需求

| 需求编号 | 需求描述 | 优先级 |
|---------|---------|--------|
| R001 | 创建一个 Hello World HTML 页面 | P0 |
| R002 | 使用免费托管平台部署网站 | P0 |
| R003 | 绑定自定义域名 yunzhuan.icu | P0 |
| R004 | 支持后续更新网站内容 | P1 |
| R005 | 创建美国大学专业导航（8大类44专业） | P0 |
| R006 | 每个专业中英文介绍 | P0 |
| R007 | 紧凑纯文本超链接样式，无任何 icon/emoji | P0 |
| R008 | 每个专业增加核心课程链接 | P0 |
| R009 | 每门课程有详情页（介绍+大作业），中英文双语 | P0 |
| R010 | 接入访问统计系统 | P0 |
| R011 | 管理后台仪表盘 | P1 |
| R012 | 微信内置浏览器检测和跳转提示 | P0 |

### 2.2 技术要求

| 要求类型 | 具体要求 |
|---------|---------|
| 托管平台 | 免费、支持自定义域名、自动 HTTPS |
| 部署方式 | Git 驱动，自动部署 |
| 网站特性 | 响应式设计、纯静态 HTML |
| 样式风格 | 紧凑排列、纯文本超链接、无任何 icon |

---

## 3. 方案选型

### 3.1 托管平台对比

| 平台 | 免费额度 | 自定义域名 | HTTPS | 部署方式 | 推荐度 |
|------|---------|-----------|-------|---------|--------|
| Vercel | 无限带宽/100GB月流量 | ✅ 免费 | ✅ 自动 | Git / CLI | 🏆 |
| Netlify | 100GB月流量 | ✅ 免费 | ✅ 自动 | Git / 拖拽上传 | 👍 |
| Cloudflare Pages | 无限带宽 | ✅ 免费 | ✅ 自动 | Git / 直传 | 👍 |
| GitHub Pages | 1GB空间/100GB月流量 | ✅ 免费 | ✅ | Git | ⚠️ |

**最终选择：Vercel + GitHub**

理由：自动部署、免费额度充足、HTTPS 自动配置、全球 CDN、专业级部署体验。

---

## 4. 网站功能

### 4.0 板块导航总览

站点当前由以下板块组成，所有页面底部导航统一提供跨板块跳转：

| 板块 | 路径 | 用途 |
|------|------|------|
| 专业导航 | `/` | 8 大类 44 个美国本科专业及核心课程 |
| **Academics · 学术体系** | `/academics/` | IB / A-Level / AP / IGCSE / SAT / TOEFL / IELTS 七大学术体系总览 |
| **Practice · 练习中心** | `/academics/practice/` | 国际课程真题练习 + 题目导航 |
| **Simulate · 模拟考试** | `/simulate/` | 标化/国际课程模拟考试、试卷发布、限时答题 |
| **Competitions · 竞赛中心** | `/competitions/` | AMC / UKMT / Physics Bowl / NEC / FBLA 等竞赛导航 |
| **抖科 Douke** | `/douke.html` | ⚡ 卡片式滑动刷题（Apple Wallet 风格），算法个性化推荐 |
| 先修课程导航 | `/prerequisite/` | 各专业先修课程与题库 |
| International Exams | `/intl-exams/` | AL / IG / IB / AP 国际学科考试 |
| Standardized Tests | `/tests/` | SAT / ACT / TOEFL / IELTS / DET / PTE 标化考试 |
| Universities | `/schools/` | 美 / 英 / 加 / 澳 / 港 / 新 选校数据库 |
| Timeline | `/timeline/` | 9-10 / 11 / 12 年级申请时间线 |
| Essays | `/essays/` | 个人陈述 / Common App / 补充文书 / UCAS |

### 4.0.1 抖科 Douke · 卡片式滑动刷题

**访问地址**：https://yunzhuan.icu/douke.html （首页最底部版权栏不起眼入口）

> **抖科 = 抖（swipe 刷）+ 科（知识/科目）**
> Apple Wallet 风格卡片堆叠，手势滑动，算法个性化推荐，后台打分引擎闭环。

| 特性 | 说明 |
|---|---|
| **交互** | 手机端手势上下滑切卡；PC 端 ↑↓ 键 / 鼠标滚轮 / 屏幕按钮 |
| **当前题库** | 275 道广泛简单题干，覆盖 8 科目（SAT/IB/A-Level/IGCSE/AP/TOEFL/IELTS/AMC），共 280 张卡片 |
| **推荐算法** | v1：规则引擎 8 条权重（新鲜度/科目轮换/难度自适应/类型多样/考试权重…）+ DoukeScoring 质量/行为双闭环 |
| **打分引擎** | 后台静默运行 5 维评分：① 题目静态质量 ② 答题行为动态 ③ 推荐引擎效果 ④ 题库健康度 ⑤ A/B 多方案模拟对比 |
| **用户数据** | localStorage 本地持久化 + 打分引擎记录自动归档 |
| **文档** | [产品规划与 50 版本路线图](docs/DOUKE-ROADMAP.md) · [引擎 20 版本迭代规划](docs/DOUKE-ENGINE-v1-to-v20.md) · [推荐算法方案选型](docs/DOUKE-RECO-ALGO-SELECTION.md) · [承载力与 Token 需求](docs/INFRA-CAPACITY-AND-TOKENS.md) |

### 4.0.2 Academics · 学术体系 & Practice · 练习 & Simulate · 模考 & Competitions · 竞赛

| 板块 | 路径 | 核心内容 |
|---|---|---|
| Academics 总览 | `/academics/` | IB Diploma Programme / A-Level / AP / IGCSE / SAT / TOEFL / IELTS 七大学术体系框架 |
| Practice 练习中心 | `/academics/practice/` | 国际课程题目导航、章节练习、真实题库接入点 |
| Simulate 模考中心 | `/simulate/` | 试卷发布、限时答题、自动批改、分数诊断 |
| Competitions 竞赛中心 | `/competitions/` | AMC（美国数学竞赛）、UKMT、Physics Bowl、NEC（经济竞赛）、FBLA（商赛）等导航 |

### 4.1 专业导航

基于 NCES（美国国家教育统计中心）数据，选择了最受欢迎的 44 个本科专业，分为 8 个分类：

| 分类 | 数量 | 专业列表 |
|------|------|---------|
| 计算机类 | 7 | 计算机科学、软件工程、人工智能、数据科学、网络安全、信息系统、人机交互 |
| 工程类 | 7 | 电气工程、机械工程、生物医学工程、土木工程、化学工程、工业工程、航空航天工程 |
| 商科类 | 7 | 金融学、会计学、商业分析、市场营销、管理学、国际商务、供应链管理 |
| 生物与健康类 | 6 | 生物医学科学、护理学、分子生物学、公共卫生、神经科学、生物化学 |
| 社会科学类 | 6 | 经济学、心理学、政治学、社会学、历史学、人类学 |
| 自然科学类 | 4 | 物理学、化学、数学、环境科学 |
| 艺术类 | 4 | 艺术、音乐、设计、传媒 |
| 教育类 | 3 | 教育学、特殊教育、幼儿教育 |

### 4.2 课程详情

每个专业 7 门核心课程，共 308 门课程详情页。每门课程包含：
- 课程介绍（中英文）- 学分、先修课、学期信息
- 大作业（中英文）- 贴近真实大学课程的模拟作业

### 4.3 样式规范

- 紧凑 flex 布局，自动换行
- 左侧紫色边框装饰
- 悬停背景色变化
- **无任何 icon/emoji**，纯文字风格

### 4.4 先修课程导航子站

**访问地址**：https://yunzhuan.icu/prerequisite/

| 功能 | 说明 |
|------|------|
| 专业分类导航 | 8 大类 44 个专业 |
| 先修课程列表 | 每专业 7 门先修课程，按顺序排列 |
| 课程详情页 | 介绍 + 学习示例 demo |

### 4.5 题库系统

**访问地址**：https://yunzhuan.icu/prerequisite/quiz/

| 功能 | 说明 |
|------|------|
| 题目数量 | 35 门课程，每门 10 题，共 350 题 |
| 题型 | 单选题、判断题 |
| 朗读功能 | 点击朗读题干（Web Speech API） |
| 即时反馈 | 答题后立即显示正确答案和解析 |

### 4.6 数值系统（游戏化设计）

| 元素 | 说明 |
|------|------|
| 金币 | 答对一题获得 1 金币 |
| 等级 | 每 100 金币升一级 |
| 用户档案 | 查看金币、等级、答题统计、课程进度 |
| 数据存储 | localStorage（预留云端同步） |

### 4.7 登录注册（占坑模式）

**访问地址**：https://yunzhuan.icu/prerequisite/login.html

| 功能 | 说明 |
|------|------|
| 注册 | 手机号 + 可选 PIN |
| 登录 | 手机号 + 可选 PIN |
| 云同步 | 预留 Supabase 接口，登录后自动同步数据 |
| 数据结构 | slots（账号）+ kv_slot（KV 存储） |

### 4.8 International Exams（国际学科考试）

**访问地址**：https://yunzhuan.icu/intl-exams/

为申请海外本科的学生整理的国际学科考试体系，覆盖主流四类：

| 体系 | 子目录 | 考试局 / 说明 |
|------|--------|------|
| A-Level | `intl-exams/al/` | CAIE / Edexcel IAL / AQA / OCR 四个考试局，每局 12 门学科 |
| IGCSE | `intl-exams/ig/` | 12 门学科 |
| IB | `intl-exams/ib/` | 12 门学科（HL/SL 通用框架） |
| AP | `intl-exams/ap/` | 12 门学科 |

每门学科页面包含：考试代码、AS/A2 分级、考纲主题列表、考试结构、评分机制、备考要点。全英文为主、中文要点辅助，便于申请季直接引用。

### 4.9 Standardized Tests（标化考试中心）

**访问地址**：https://yunzhuan.icu/tests/

**考试介绍页：**

| 考试 | 页面 | 说明 |
|------|------|------|
| SAT | `tests/sat.html` | 美本入学学术能力测试，1600 分制 |
| ACT | `tests/act.html` | 美本入学测试，36 分制 |
| TOEFL | `tests/toefl.html` | 英语能力测试，120 分制 |
| IELTS | `tests/ielts.html` | 英语能力测试，9 分制 |
| DET | `tests/det.html` | Duolingo 英语测试，160 分制 |
| PTE | `tests/pte.html` | 培生学术英语考试，10-90 分制，AI 评分 |

**备考资源页：**

| 考试 | 页面 | 说明 |
|------|------|------|
| SAT 备考 | `tests/sat-prep.html` | 官方资源、推荐教材、12-16 周备考节奏、错题本规范 |
| ACT 备考 | `tests/act-prep.html` | 官方资源、推荐教材、4 模块策略、送分策略 |
| TOEFL 备考 | `tests/toefl-prep.html` | TPO 模考、推荐教材、4 模块策略、MyBest 拼分 |
| IELTS 备考 | `tests/ielts-prep.html` | Cambridge 真题、推荐教材、4 模块策略、TRF 送分 |
| DET 备考 | `tests/det-prep.html` | 官方 Practice Test、7 题型策略、自适应节奏 |
| PTE 备考 | `tests/pte-prep.html` | 官方 Scored Practice Test、20 题型策略、高分值题型模板 |

**工具页：**

| 工具 | 页面 | 说明 |
|------|------|------|
| 分数换算 | `tests/score-conversion.html` | SAT↔ACT、TOEFL↔IELTS↔DET 官方对照表 + 各梯队门槛 + 送分策略 |

每个考试介绍页包含：课程介绍、基本信息、考试结构、评分机制、考试时间与报名、备考策略。`tests/index.html` 提供五考试对比表。

### 4.10 Universities（选校数据库）

**访问地址**：https://yunzhuan.icu/schools/

按国家/地区分类的选校导航，目前提供 6 个区域索引页：

| 地区 | 路径 | 说明 |
|------|------|------|
| US | `schools/us/` | Common App 体系，按梯队+文理学院分组 |
| UK | `schools/uk/` | UCAS 体系 |
| Canada | `schools/ca/` | 加拿大本科 |
| Australia | `schools/au/` | 澳洲本科 |
| Hong Kong | `schools/hk/` | 香港本科 |
| Singapore | `schools/sg/` | 新加坡本科 |

**美国大学详情页（样板 8 所）：**

| 学校 | 页面 | 说明 |
|------|------|------|
| Harvard | `schools/us/harvard.html` | 哈佛大学详情卡 |
| MIT | `schools/us/mit.html` | 麻省理工学院详情卡 |
| Stanford | `schools/us/stanford.html` | 斯坦福大学详情卡 |
| Yale | `schools/us/yale.html` | 耶鲁大学详情卡 |
| Princeton | `schools/us/princeton.html` | 普林斯顿大学详情卡 |
| Columbia | `schools/us/columbia.html` | 哥伦比亚大学详情卡 |
| UChicago | `schools/us/uchicago.html` | 芝加哥大学详情卡 |
| UPenn | `schools/us/upenn.html` | 宾夕法尼亚大学详情卡 |

每所学校详情页包含：学校简介、录取率、标化分数范围、热门专业、特色项目、申请要点。

### 4.11 Application Timeline（申请时间线）

**访问地址**：https://yunzhuan.icu/timeline/

**阶段总览页：**

| 阶段 | 页面 | 重点 |
|------|------|------|
| 探索期 | `timeline/grade-9-10.html` | 学科探索、活动起步、首次标化试水 |
| 准备期 | `timeline/grade-11.html` | GPA / 标化 / 活动 / 推荐信 / 选校 |
| 申请期 | `timeline/grade-12.html` | ED/EA/RD 提交、文书定稿、面试、录取决策 |

**月度清单页：**

| 阶段 | 页面 | 重点 |
|------|------|------|
| 9-10 年级 | `timeline/grade-9-10-monthly.html` | 按月份拆解探索期任务 |
| 11 年级 | `timeline/grade-11-monthly.html` | 按月份拆解准备期任务 |
| 12 年级 | `timeline/grade-12-monthly.html` | 按月份拆解申请期任务 |

每个月度清单页包含：当月核心任务、标化考试安排、活动规划、文书进度、选校进度等。

### 4.12 Essay Resources（文书资源库）

**访问地址**：https://yunzhuan.icu/essays/

**通用文书页：**

| 类型 | 页面 | 说明 |
|------|------|------|
| Personal Statement | `essays/personal-statement.html` | 通用个人陈述框架 |
| Common App Essay | `essays/common-app.html` | 7 题 650 字主文书，含题目分析与修改清单 |
| Supplemental Essay | `essays/supplemental.html` | 学校特定补充文书总览 |
| UCAS Personal Statement | `essays/ucas.html` | 英国 UCAS 4000 字符个人陈述 |
| Essay Process | `essays/process.html` | 文书写作全流程指南 |
| Essay Pitfalls | `essays/pitfalls.html` | 文书避坑指南与常见错误 |

**各校补充文书页（样板 8 所）：**

| 学校 | 页面 | 说明 |
|------|------|------|
| Harvard | `essays/supplemental-harvard.html` | 哈佛大学补充文书 |
| MIT | `essays/supplemental-mit.html` | 麻省理工学院补充文书 |
| Stanford | `essays/supplemental-stanford.html` | 斯坦福大学补充文书 |
| Yale | `essays/supplemental-yale.html` | 耶鲁大学补充文书 |
| Princeton | `essays/supplemental-princeton.html` | 普林斯顿大学补充文书 |
| Columbia | `essays/supplemental-columbia.html` | 哥伦比亚大学补充文书 |
| UChicago | `essays/supplemental-uchicago.html` | 芝加哥大学补充文书 |
| UPenn | `essays/supplemental-upenn.html` | 宾夕法尼亚大学补充文书 |

每所学校补充文书页包含：必答题、选答题、题目分析、写作策略、范文思路。

---

## 5. 目录结构

```
/workspace/
├── index.html                    # 首页（专业分类导航）
├── admin.html                    # 管理后台仪表盘
├── computer/                     # 计算机类（7个专业 + 49门课程）
├── engineering/                  # 工程类（7个专业 + 49门课程）
├── business/                     # 商科类（7个专业 + 49门课程）
├── biology/                      # 生物与健康类（6个专业 + 42门课程）
├── social/                       # 社会科学类（6个专业 + 42门课程）
├── science/                      # 自然科学类（4个专业 + 28门课程）
├── arts/                         # 艺术类（4个专业 + 28门课程）
├── education/                    # 教育类（3个专业 + 21门课程）
├── prerequisite/                 # 先修课程导航子站
│   ├── index.html                # 子站首页
│   ├── profile.html              # 用户档案页面
│   ├── login.html                # 登录/注册页面
│   ├── css/
│   │   ├── user.css              # 用户相关样式（金币栏、档案页）
│   │   └── collapse.css          # 折叠功能样式
│   ├── js/
│   │   ├── user.js               # 用户模块（CloudSlot API + Storage）
│   │   ├── collapse.js           # 折叠展开脚本
│   │   └── random-*.js           # 随机跳转脚本
│   ├── quiz/                     # 题库系统
│   │   ├── index.html            # 刷题页面
│   │   ├── js/
│   │   │   ├── quiz-engine.js    # 刷题引擎
│   │   │   ├── tts.js            # 文本朗读
│   │   │   └── storage.js        # 数据存储
│   │   └── data/
│   │       └── questions.json    # 题库数据（350题）
│   └── [学科]/                   # 各学科专业页和课程页
├── intl-exams/                   # 国际学科考试（AL/IG/IB/AP）
│   ├── index.html                # 板块首页
│   ├── al/                       # A-Level，分 caie / edexcel-ial / aqa / ocr 四考试局
│   ├── ig/                       # IGCSE
│   ├── ib/                       # IB
│   └── ap/                       # AP
├── tests/                        # 标化考试中心
│   ├── index.html                # 板块首页 + 六考试对比
│   ├── sat.html / act.html / toefl.html / ielts.html / det.html / pte.html
│   ├── sat-prep.html / act-prep.html / toefl-prep.html / ielts-prep.html / det-prep.html / pte-prep.html
│   └── score-conversion.html     # 分数换算对照表
├── schools/                      # 选校数据库
│   ├── index.html                # 板块首页
│   ├── compare.html              # 选校对比工具
│   ├── us/                       # 美国本科
│   │   ├── index.html            # 美国大学列表
│   │   └── harvard.html / mit.html / stanford.html / yale.html / princeton.html / columbia.html / uchicago.html / upenn.html
│   └── uk/ ca/ au/ hk/ sg/       # 其他国家/地区
├── timeline/                     # 申请时间线
│   ├── index.html                # 板块首页
│   ├── grade-9-10.html / grade-11.html / grade-12.html
│   └── grade-9-10-monthly.html / grade-11-monthly.html / grade-12-monthly.html
├── essays/                       # 文书资源库
│   ├── index.html                # 板块首页
│   ├── personal-statement.html / common-app.html / supplemental.html / ucas.html
│   ├── process.html / pitfalls.html
│   └── supplemental-harvard.html / supplemental-mit.html / supplemental-stanford.html / supplemental-yale.html / supplemental-princeton.html / supplemental-columbia.html / supplemental-uchicago.html / supplemental-upenn.html
├── js/
│   ├── track.js                  # 访问跟踪脚本
│   └── wechat-redirect.js        # 微信浏览器检测跳转
├── api/
│   ├── track.js                  # 访问记录 API（Vercel KV）
│   └── stats.js                  # 统计数据 API（Vercel KV）
├── snapshots/                    # 历史快照目录
├── snapshot.sh                   # 快照脚本
├── gen_schools.py                # 批量生成学校详情页脚本
├── gen_test_prep.py              # 批量生成备考页脚本
├── gen_supplemental.py           # 批量生成补充文书页脚本
├── gen_monthly.py                # 批量生成月度清单脚本
├── gen_q.py                      # 批量生成题目脚本
├── douke.html                    # 抖科 · 卡片式滑动刷题主页面
├── academics/                    # Academics 学术体系总览
│   ├── index.html                # 7大学术体系（IB/AL/AP/IG/SAT/TOEFL/IELTS）
│   └── practice/                 # Practice 练习中心
│       └── index.html            # 国际课程题目导航 + 真实题库
├── simulate/                     # Simulate 模考中心
│   └── index.html                # 试卷发布 / 限时答题 / 自动批改
├── competitions/                 # Competitions 竞赛中心
│   └── index.html                # AMC / UKMT / Physics Bowl / NEC / FBLA 等导航
├── interviews/                   # 面试与校友资源
│   └── index.html                # 面试指南 + 模拟面试
├── guides/                       # 申请指南
│   └── index.html                # 本科申请全流程指南
├── scholarships/                 # 奖学金中心
│   └── index.html                # 奖学金导航
├── contact.html                  # 联系与反馈
├── roadmap.html                  # 产品路线图
├── search.html                   # 学校搜索
├── rankings.html                 # 学校排名
├── js/
│   ├── track.js                  # 访问跟踪脚本
│   ├── wechat-redirect.js        # 微信浏览器检测跳转
│   ├── douke-question-bank.js    # 抖科题库（275题 8科目，每题5维元数据）
│   └── douke-scoring-engine.js   # 抖科出题效果打分引擎（5维度 + A/B模拟）
├── docs/                         # 产品文档
│   ├── DOUKE-ROADMAP.md              # 抖科产品 50 版本路线图
│   ├── DOUKE-ENGINE-v1-to-v20.md     # 抖科引擎 20 版本迭代规划
│   ├── DOUKE-RECO-ALGO-SELECTION.md  # ✅ 推荐算法方案选型（6大流派对比，待确认）
│   ├── INFRA-CAPACITY-AND-TOKENS.md  # ✅ 承载力与 Token 需求清单（待确认）
│   ├── APP-SHELL.md                  # 前端架构说明
│   └── SEO.md                        # SEO 规范
├── DEV_GUIDE.md                  # 开发规范文档
└── README.md                     # 本文档
```

---

## 6. GitHub 仓库配置

### 6.1 仓库地址

https://github.com/Wadesha/yunzhuan.icu

### 6.2 Git 配置

```bash
git config user.name "Wadesha"
git config user.email "wadesha@users.noreply.github.com"
```

### 6.3 认证方式

GitHub Personal Access Token（PAT），有效期 **90 天**。当前 Token 仅绑定 Wadesha 账户。

### 6.4 Token 安全规范（硬性要求）

> **禁止在任何代码/文档/Markdown 中硬编码 Token**，历史事件：之前的推送曾把 Token 直接写入仓库导致暴露。

| 原则 | 具体做法 |
|---|---|
| ① 代码零硬编码 | 所有 `ghp_`、`sk-`、`apiKey` 绝不写入 `*.js/*.html/*.md/*.json`。每次提交前必须执行：<br>`grep -r "ghp_\|sk-\|API_KEY" --include="*.js" --include="*.html" --include="*.md" .` |
| ② 本地凭证存储 | 仅存于 `~/.git-credentials`（chmod 600）+ `git config credential.helper store` |
| ③ 环境变量隔离 | 生产 Token 走 Vercel Project Environment Variables，开发环境 `.env.local` 且加入 `.gitignore` |
| ④ 定期轮换 | GitHub PAT 每 90 天强制换；AI Key 每月轮换；可疑泄露立即 revoke |

### 6.5 Token 与密钥清单（完整）

详见 [docs/INFRA-CAPACITY-AND-TOKENS.md](docs/INFRA-CAPACITY-AND-TOKENS.md)，包括：
- 开发托管类：GitHub PAT / SSH Key / Vercel Token
- 数据存储类：Vercel KV / Supabase / CloudSlot
- AI 推荐类：OpenAI / Anthropic / DeepSeek / Cohere / HuggingFace / Lambda Labs
- 分析增长类：GrowthBook / Giscus / Formspree / PostHog / Sentry
- 安全监控类：Turnstile / Cloudflare

---

## 7. 承载力规划（分三阶段）

### 7.1 阶段与成本预估

| 阶段 | 时间窗口 | 日活 | 月活 | 月成本 | 基础设施 |
|---|---|---|---|---|---|
| **A · 内测期（当前）** | v1 ~ v10（2个月内）| 1-50 | 200 | ¥0 | Vercel Hobby + KV 免费 + localStorage |
| **B · 种子期** | v11 ~ v30（2-8个月）| 50-5k | 200-50k | ¥350-500 | Vercel Pro + Supabase Pro + Vercel KV Pro + 低额度 LLM |
| **C · 增长期** | v31+（8个月+）| 5k+ | 50万+ | ¥4k-12k | Vercel Enterprise + AWS RDS + 多家 LLM + GPU 训练 |

详细承载力与 Token 需求见 [docs/INFRA-CAPACITY-AND-TOKENS.md](docs/INFRA-CAPACITY-AND-TOKENS.md)。

---

## 8. 推荐算法体系 · 方案选型

抖科推荐算法分 **5 阶段 · 6 大流派**演进，当前处于 v1.1「规则引擎 v1（加权随机）」。

### 8.1 推荐算法总览（方案选型对比）

| 流派 | 方案 | 适用阶段 | 推荐度 |
|---|---|---|---|
| **A 规则引擎系列** | A1手工规则 → A2自动调优 → A3ELO画像 → A4多臂老虎机MAB | v1.0 ~ v5.0 | ⭐⭐⭐⭐⭐ 现阶段最优 |
| **B 统计学习模型** | B1逻辑回归LR → B2因子分解机FM → B3Item-CF → B4User-CF | v6.0 ~ v10.0 | ⭐⭐⭐⭐ v6必做，性价比最高 |
| **C 知识图谱+路径** | C1前置DAG → C2BFS/DFS路径 → C3SRS间隔重复 → C4Dijkstra最短路径 | v11.0 ~ v15.0 | ⭐⭐⭐⭐ v11必做，打通prereq |
| **D 深度学习** | D1Transformer序列 → D2双塔 → D3LLM多模态 | v21.0 ~ v30.0 | ⭐⭐ 过早，ABC先跑通 |
| **E 因果+学习科学** | E1Uplift → E2BKT贝叶斯知识追踪 → E3IRT项目反应理论 | v31.0+ | ⭐⭐⭐ v10已部分包含 |
| **F 第三方集成** | Algolia / Amazon Personalize / Cohere Rerank | 视情况 | ⭐ 现阶段自研足够 |

### 8.2 立刻可做的 5 项提升（v1.1 → v3.0 短期）

| 编号 | 提升项 | 预期收益 | 工作量 |
|---|---|---|---|
| ① | 参数 Θ 自动寻优（爬山法+模拟退火，200 会话仿真）| 推荐效果分 +8~12 | 0.5 天 |
| ② | 新题冷启动 MAB（Thompson Sampling 前 3 次曝光公平分配）| 新题曝光公平度 +30% | 0.3 天 |
| ③ | Item-CF 雏形（400×400 共现矩阵，Top-K 预存）| 连续同主题命中率 +15% | 0.5 天 |
| ④ | accuracy 从 subject.difficulty 升级到 topicCode 粒度 | 难度自适应精度 ↑ | 0.2 天 |
| ⑤ | DoukeScoring.records 云同步（Vercel KV）| 换机不丢数据，仿真有真实样本 | 0.3 天 |

完整方案选型、承载力、Token 需求与待确认决策见：
- [docs/DOUKE-RECO-ALGO-SELECTION.md](docs/DOUKE-RECO-ALGO-SELECTION.md)
- [docs/DOUKE-ENGINE-v1-to-v20.md](docs/DOUKE-ENGINE-v1-to-v20.md)
- [docs/INFRA-CAPACITY-AND-TOKENS.md](docs/INFRA-CAPACITY-AND-TOKENS.md)

---

## 9. Vercel 部署

### 7.1 部署方式

通过 Vercel Dashboard 连接 GitHub 仓库，每次 push 到 main 分支自动触发部署。

### 7.2 项目地址

https://vercel.com/wadesha/yunzhuan-icu

### 7.3 自动部署流程

1. 代码 push 到 GitHub
2. Vercel 检测到变更
3. 自动构建和部署
4. 全球 CDN 分发

---

## 8. DNS 域名解析配置

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | 216.198.79.1 |

---

## 9. SSL 证书配置

Vercel 自动申请和续期 Let's Encrypt 证书，HTTPS 自动启用。

---

## 10. 快照机制与版本管理

### 10.1 全站快照备份

每次重要更新前创建全站 HTML 快照备份，方便回溯历史版本和快速回退。

### 10.2 快照命名规则

```
snapshots/snapshot_YYYYMMDD_HHMMSS/
```

每个快照目录下保留完整的网站目录结构，包含所有 HTML 文件。

### 10.3 使用方式

```bash
./snapshot.sh
git add .
git commit -m "描述更新内容"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

### 10.4 版本号规则

采用语义化版本号：`主版本.次版本.修订号`（如 v13.1.0）

| 级别 | 说明 | 示例 |
|------|------|------|
| 主版本 | 重大架构变更、板块级新增 | v13.0.0 → v14.0.0 |
| 次版本 | 新功能、新页面批量新增 | v13.0.0 → v13.1.0 |
| 修订号 | Bug 修复、小范围内容更新 | v13.1.0 → v13.1.1 |

### 10.5 回退机制

| 回退方式 | 适用场景 | 操作方法 |
|---------|---------|---------|
| Git Tag 回退 | 代码级回退 | `git revert <tag>` 创建反向提交，或 `git reset --hard <tag>` 后 force push |
| Vercel 回退 | 生产环境回退 | Vercel Dashboard → Deployments → 选择历史版本 → "Promote to Production" |
| 快照恢复 | 单文件/局部恢复 | 从 `snapshots/` 目录找到对应版本文件，复制覆盖即可 |

### 10.6 发布流程

1. 本地开发和测试
2. 运行 `./snapshot.sh` 创建全站快照
3. `git add . && git commit -m "描述"`
4. `git tag vX.Y.Z` 打版本标签
5. `git push origin main && git push origin vX.Y.Z`
6. Vercel 自动部署到生产环境

---

## 11. 访问统计与管理后台

### 11.1 统计方案

采用**双通道统计**：

| 方案 | 用途 | 数据来源 |
|------|------|---------|
| Vercel Analytics | 后台详细查看（来源/地区/设备/热门页面） | Vercel 原生 |
| 不蒜子 busuanzi | 仪表盘展示（总PV/总UV） | 第三方免费服务 |

### 11.2 管理后台

**访问地址**：https://yunzhuan.icu/admin.html

**默认密码**：yunzhuan2026

**功能**：
- 登录验证
- 顶部实时滚动条（总PV/总UV/更新时间）
- 统计卡片（总访问量、独立访客）
- 每 30 秒自动刷新
- Vercel Analytics 跳转链接

---

## 12. 微信访问说明

### 12.1 问题

新域名 `yunzhuan.icu` 在微信内置浏览器中会显示"无法确认该网页的安全性"的安全提示，这是微信对新注册域名的风控拦截，与网站代码无关。

### 12.2 解决方案

1. **申请恢复访问**：在微信提示页点击"申请恢复访问"，按流程提交网站用途说明，一般 1-3 个工作日审核通过
2. **等待自然收录**：新域名使用 1-2 周后，微信安全评分会自然提高
3. **使用系统浏览器打开**：用户点击右上角"..."选择在浏览器中打开

### 12.3 状态

微信引导跳转功能已全部移除，网站在微信中直接显示内容（需通过微信安全校验后）。

---

## 13. 部署流程图

```
用户需求 → 方案选型 → HTML开发 → GitHub配置 → Vercel部署
                                                      ↓
                                            DNS域名配置 → SSL证书配置
                                                      ↓
                                                功能更新迭代
                                                      ↓
                                                  部署完成 ✅
```

---

## 14. 常见问题与解决方案

### 14.1 GitHub 连接超时

**解决方案**：切换网络（手机热点、VPN），或使用 Vercel CLI 直接部署

### 14.2 Git 推送认证失败

**解决方案**：使用 GitHub Personal Access Token 配置远程地址

### 14.3 DNS 配置后网站无法访问

**解决方案**：等待 DNS 传播（通常 5-30 分钟），强制刷新浏览器缓存

### 14.4 Vercel Analytics 无数据

**解决方案**：确保部署了 Analytics 脚本，且有人访问了网站（等待 30 秒）

---

## 15. 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0 | 2026-07-19 | 初始版本：Hello World 页面 |
| v2.0 | 2026-07-19 | 添加互动效果：粒子、主题切换、打字机、计数器 |
| v2.1 | 2026-07-19 | 添加部署记录文档 |
| v2.2 | 2026-07-19 | 添加快照机制：自动保存带时间戳的 HTML 备份 |
| v3.0 | 2026-07-19 | 创建美国大学专业导航：44个专业，8个分类，中英文介绍 |
| v4.0 | 2026-07-19 | 新增 308 门课程详情页：每专业 7 门核心课程，含课程介绍和大作业 |
| v5.0 | 2026-07-19 | 接入 Vercel Analytics + 创建管理后台仪表盘 admin.html |
| v5.1 | 2026-07-20 | 新增微信内置浏览器检测和跳转提示 |
| v5.2 | 2026-07-20 | 修复微信白屏问题：重写微信检测脚本v2，移除 Vercel Insights 和 track.js 脚本 |
| v5.3 | 2026-07-20 | 移除全部微信检测跳转代码（微信安全拦截导致前端检测无法生效） |
| v6.0 | 2026-07-20 | 新增折叠展开功能：专业介绍折叠、课程大作业增加步骤分解+折叠 |
| v6.1 | 2026-07-20 | 修复专业页面中英文独立折叠问题：合并为单一折叠区域，共用一个展开按钮 |
| v7.0 | 2026-07-20 | 课程页面大作业实施步骤升级：按课程类型定制针对性步骤模板（数据结构、操作系统、投资学等15+模板） |
| v7.1 | 2026-07-20 | 新增导航链接：课程页面底部增加"返回本专业"、"下一个课程"、"随机课程"；专业页面底部增加"首页"、"下一个专业"、"随机专业" |
| v7.2 | 2026-07-20 | 修复随机课程跳转404错误：修正路径计算逻辑，从"../学科/courses/"改为"../../学科/courses/" |
| v8.0 | 2026-07-20 | 大作业实施步骤开头新增简短demo：精准对应大作业要求，包含具体场景、任务、方法和预期结果 |
| v8.1 | 2026-07-20 | 优化demo表述：去除AI化、论文化语言，改为自然易懂的介绍风格 |
| v8.2 | 2026-07-20 | 丰富demo内容：从单句扩展为2-3句，增加具体事例和信息量 |
| v8.3 | 2026-07-20 | 彻底重构课程页面大作业部分：修复步骤重复问题，统一HTML结构 |
| v9.0 | 2026-07-21 | 创建先修课程导航子站（prerequisite/）：展示学生需要先修的课程，按顺序排列 |
| v9.1 | 2026-07-21 | 新增题库系统：35门课程、350道题目，支持单选题、判断题、题干朗读功能 |
| v9.2 | 2026-07-21 | 实现数值系统（游戏化设计）：金币、等级、用户档案页面 |
| v9.3 | 2026-07-21 | 全局金币展示：所有页面顶部显示金币和等级 |
| v9.4 | 2026-07-21 | 主站底部增加常用链接：先修课程导航、回到顶部、网站首页 |
| v10.0 | 2026-07-21 | 占坑模式登录注册：手机号+可选PIN，预留Supabase云同步接口 |
| v11.0 | 2026-07-25 | 新增 International Exams 板块：AL/IG/IB/AP 四类国际学科考试，A-Level 覆盖 CAIE/Edexcel IAL/AQA/OCR 四考试局，每局 12 门学科 |
| v11.1 | 2026-07-25 | 全站底部导航统一加入 International Exams 入口，覆盖 542 个 HTML 页面 |
| v12.0 | 2026-07-26 | 新增申请季四大板块：Standardized Tests（SAT/ACT/TOEFL/IELTS/DET）、Universities（美英加澳港新）、Timeline（9-10/11/12 年级）、Essays（PS/Common App/Supplemental/UCAS） |
| v13.0 | 2026-07-27 | 新增 21 个详情页：8 所美国大学详情卡（Harvard/MIT/Stanford/Yale/Princeton/Columbia/UChicago/UPenn）、5 个标化备考页（SAT/ACT/TOEFL/IELTS/DET）、8 所学校补充文书页、3 个年级月度清单；新增分数换算工具页、文书流程/避坑页；新增 4 个 Python 批量生成脚本（gen_schools/gen_test_prep/gen_supplemental/gen_monthly） |
| v13.1 | 2026-07-27 | 新增 PTE Academic 板块：介绍页 + 备考页，含 20 种题型全解析和高分值题型策略；tests 首页考试对比表从 5 个扩展为 6 个 |
| v13.1.0 | 2026-07-27 | 正式版本：版本管理系统上线（全站快照 + Git Tag + 三重回退机制）；版本历史索引页 snapshots/index.html |
| v13.2 | 2026-07-27 | 新增 Contact & Feedback 页面：Formspree 在线表单、GitHub Issues 入口、Email、Giscus 评论区、贡献指南；首页底部导航新增 Contact 入口 |
| v13.2.0 | 2026-07-27 | 正式版本：Contact & Feedback 系统上线（Giscus 评论 + 4 种反馈渠道 + 全站 596 页底部 Contact 导航）；快照脚本升级支持版本号命名 |
| v13.3.0 | 2026-07-27 | 美国大学扩充：新增 12 所大学详情页（JHU/Northwestern/Duke/UCB/UCLA/UMich/CMU/NYU/BU/UIUC/GaTech/UW）；全站底部导航英文化（352 页从中文改为英文） |
| v13.4.0 | 2026-07-27 | 英国大学板块上线：8 所大学详情页（Oxford/Cambridge/IC/UCL/LSE/KCL/Edinburgh/Manchester），UCAS 申请体系、A-Level/IB 成绩要求、英国特色内容；专业导航核心课程上移到页面顶部（28 个专业页） |
| v13.5.0 | 2026-07-27 | 标化考试扩充：新增 AP 备考指南、标化考试全年时间轴、7 大考试报名指南；首页移动端样式优化（专业卡片更紧凑）；修复首页版本入口显示 |
| v13.6.0 | 2026-07-27 | 文书资源扩充：新增 PS 写作指南（万能结构公式、Show Don't Tell、6 步修改流程）、文书范例库（10+ 篇按主题分类的优秀文书节选+分析框架） |
| v13.7.0 | 2026-07-27 | 国际学科扩充：新增 IGCSE 备考指南（三大考试局、70+科目、2年备考规划）、IB 文凭备考指南（六大学科组+TOK/EE/CAS核心、IA考试比例、生存指南） |
| v13.8.0 | 2026-07-27 | 加澳港新大学板块扩充：11 所大学详情页（加拿大4所：Toronto/UBC/McGill/Waterloo；澳洲3所：Melbourne/Sydney/UNSW；香港2所：HKU/CUHK；新加坡2所：NUS/NTU） |
| v20.5.0 | 2026-07-28 | 考纲→样题深度关联：120/科联网获取课程子分类+细分；考纲结构化+双向锚点+局部刷题+覆盖率分析；5小版本规划落地；syllabus结构化（顶部目录+上一节/下一节导航+中间分节展示）+ 总览页 |
| v20.6.0 | 2026-07-28 | 首页产品化改造；Demo：个人中心+学习路径+申请Tracker+提醒+收藏；Community问答+UGC+评论；竞赛组队+个性化推荐；AI选校+AI文书润色；移动端+中介SaaS；协作架构+核心成员小范围测试平台；全流程模拟+个性化档案+学校专属模拟页 |
| v20.6.1 | 2026-07-29 | Simulate 模拟考试发布修复：试卷 startTime/endTime 默认值，解决 UTC 偏移校验失败（参考经验 407468）；localStorage 双写+校验+备份回填（参考经验 548283，解决 iOS 抖音平台数据丢失风险）；PTE 上线 |
| v21.0 Demo | 2026-07-29 | Academics & Practice & Simulate & Competitions 四板块上线；考纲结构化导航（顶部目录+分节展示+上一节/下一节），syllabus 结构化替代全文展开 |
| v21.1 Douke MVP | 2026-07-29 | **抖科 Douke v1.0 上线**：Apple Wallet 卡片堆叠，手机手势/PC键盘；DoukeQB 275 题 8 科目题库；DoukeScoring 5 维打分引擎后台闭环；规则引擎 v1（8 权重+质量/行为双闭环）；20 版本引擎迭代文档落地 |
| v21.2 Douke v1.1 | 2026-07-30 | 打分系统改为后台引擎闭环（移除前端Dashboard，算法权重直接接入 recommend）；首页底部版权栏添加抖科不起眼入口；推荐算法方案选型文档 & 承载力 Token 需求文档 & README 补齐 |

---

## 15.1 版本规划（Roadmap）

> ⚠️ 以下为初步规划，实际内容和顺序可能根据需求调整

### v13.x — 内容扩充期（次版本迭代）

| 版本 | 预计内容 | 优先级 |
|------|---------|--------|
| v13.3 | 美国大学扩充：再新增 10-15 所美国大学详情页（如 Chicago、Johns Hopkins、Northwestern、Duke 等）；学校列表页完善筛选和排序 | 高 |
| v13.4 | 英国大学板块：英国大学列表页 + 5-8 所英国名校详情页（Oxford、Cambridge、Imperial、UCL 等） | 高 |
| v13.5 | 标化考试扩充：增加 AP/SAT2 科目备考内容、标化考试时间轴、报名指南 | 中 |
| v13.6 | 文书资源扩充：增加更多学校补充文书、文书范例库、PS 写作课 | 中 |
| v13.7 | 国际学科扩充：IG/IB/AP 各学科页面内容深化，增加真题、笔记、备考策略 | 中 |
| v13.8 | 加拿大/澳洲/香港/新加坡大学板块扩充 | 低 |

### v14.0 — 工具化升级（主版本）

- **选校对比工具**：支持多所学校横向对比（录取率、标化、学费、专业等）
- **申请 checklist 仪表盘**：用户可勾选任务、记录进度、设置提醒
- **标化分数计算器**：SAT/ACT/TOEFL/IELTS/PTE 分数换算+定位
- **时间线个性化**：根据目标年级自动生成申请时间线

### v15.0 — 社区与内容生态

- **用户系统**：注册登录、个人申请档案（基于 Supabase）
- **经验分享区**：学长学姐申请经验帖
- **题库系统**：标化/国际学科练习题、模考
- **站内搜索**：全站内容搜索
- **移动端适配优化**

### v16.0+ — 远期规划

- 研究生申请板块（Master/PhD）
- 留学就业板块（OPT、H1B、回国就业）
- 奖学金/助学金信息
- AI 辅助选校/文书修改
- 多语言支持（英文为主）

---

*文档更新时间：2026-07-30*

---

## 16. 开发规范

详细开发规范请参考 [DEV_GUIDE.md](file:///workspace/DEV_GUIDE.md)，包含：

- 项目结构原则和路径约定
- 链接检查规范和检测脚本
- 批量脚本开发规范（命名、防重复执行、字符编码）
- 内容生成规范（题目数据格式、demo要求）
- 样式一致性（配色、组件风格、无emoji）
- 数据存储规范（localStorage、Supabase占坑模式）
- 云同步架构设计（实时同步、安全设计、分阶段实施计划）

---

## 17. 待确认决策项（请回复方案编号）

详见 [DOUKE-RECO-ALGO-SELECTION.md](docs/DOUKE-RECO-ALGO-SELECTION.md) + [INFRA-CAPACITY-AND-TOKENS.md](docs/INFRA-CAPACITY-AND-TOKENS.md)

### 决策 1：推荐算法立刻执行项
- **A**：5 项提升全做（①-⑤，合计 ~2 天）
- **B**：先做 ① 参数自动寻优 + ④ 精度升级（高性价比，~0.7 天）✅ 推荐
- **C**：现阶段不做，等更多用户数据

### 决策 2：承载力升级触发点
- **A**：KPI 触发（KV 免费额度 80% 用完升级）✅ 推荐
- **B**：3 个月后统一升级
- **C**：MAU 破 1 万再升级

### 决策 3：AI LLM 接入时间点
- **A**：v21 D 阶段再接入（ABC 先跑通）✅ 推荐
- **B**：v11 阶段先低额度 DeepSeek 润色解析
- **C**：现在就拿 DeepSeek 免费额度跑题库自动化扩充

### 决策 4：Token 管理方式
- **A**：现状（本地文件 + 手动轮换，Wadesha 一人持有）✅ 推荐
- **B**：1Password/Bitwarden 团队密码库 + 共享
- **C**：Doppler/Infisical 环境变量平台（免费版）

*文档更新时间：2026-07-30*
