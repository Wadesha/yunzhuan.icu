# 抖科 Douke · 产品规划与 50 版本迭代路线图

> **抖科** = 抖（swipe/刷，如抖音）+ 科（知识/科目）
> 卡片式单页滑动学习，类 Apple Wallet 切卡，算法个性化推荐
>
> 版本：v1.0 · 2026-07-29 · 状态：规划 + v1 实现

---

## 一、产品愿景

### 核心痛点
传统考纲/刷题页面的三个问题（来自用户直接反馈）：
1. **导航太少不好用** — 层级菜单/折叠目录信息密度低，用户找不到入口
2. **折叠式目录体验差** — 用户非常不喜欢折叠展开的交互模式
3. **信息过载** — 一页展开所有内容，认知负荷过高

### 解决方案
**不是给用户一个目录让他选，而是把内容推到他面前。**

抖科把考纲知识点、练习题、复习卡、进度卡打散成独立卡片，用算法根据用户每次互动（滑动速度、停留时长、答题正确率、难度反馈）实时推荐下一张卡片。用户只需**上下滑动**，像刷抖音一样学习。

### 类比
| 产品 | 交互模型 | 抖科对应 |
|---|---|---|
| 抖音/TikTok | 上滑看下一个视频 | 上滑看下一张知识卡 |
| Apple Wallet | 卡片堆叠切换 | 卡片堆叠 + 3D 缩放 |
| Duolingo | 个性化学习路径 | 基于能力动态推题 |
| Anki | 间隔重复 | 集成 SRS 算法 |

### 与现有产品的区别
| 维度 | 传统考纲页 | 抖科 |
|---|---|---|
| 导航 | 折叠目录/层级菜单 | 无导航，算法推送 |
| 内容展示 | 全文展开/单节显示 | 一次一张卡片 |
| 内容选择 | 用户手动找 | 算法自动推荐 |
| 认知负荷 | 高（一页几十节） | 低（一次一卡） |
| 个性化 | 无（所有人看一样的） | 有（根据互动调整） |
| 移动体验 | 需要缩放/滚动 | 原生手势滑动 |

---

## 二、核心交互模型

### 2.1 手势设计

**手机端（优先级最高）**
| 手势 | 动作 |
|---|---|
| ↑ 上滑 | 下一张卡片（核心手势，最高频） |
| ↓ 下滑 | 上一张卡片（回看） |
| ← 左滑 | 跳过/不感兴趣（负反馈信号） |
| → 右滑 | 收藏/标记重要 |
| 双击 | 快速答题/翻面 |
| 长按 | 弹出操作菜单 |

**PC/Pad 端**
| 操作 | 动作 |
|---|---|
| ↑↓ 方向键 | 上一张/下一张 |
| 空格 | 下一张 |
| 点击按钮 | 上一张/下一张 |
| 滚轮 | 下一张（向下滚）/上一张（向上滚） |

### 2.2 卡片堆叠动画（Apple Wallet 风格）

```
┌─────────────────────┐  ← 当前卡片（100% scale, 完全可见）
│                     │
│    卡片内容区        │
│                     │
└─────────────────────┘
  ┌─────────────────────┐  ← 下一张（95% scale, 下移 12px, 70% opacity）
  └─────────────────────┘
    ┌─────────────────────┐  ← 再下一张（90% scale, 下移 24px, 40% opacity）
    └─────────────────────┘
```

**动画参数**
- 上滑过渡：当前卡片 `translateY(-120%) + scale(0.85) + opacity(0)` → 飞出
- 下一张：从 `translateY(12px) scale(0.95) opacity(0.7)` → `translateY(0) scale(1) opacity(1)`
- 弹簧曲线：`cubic-bezier(0.25, 0.46, 0.45, 0.94)` + 300ms
- 触觉反馈：振动 API（`navigator.vibrate(10)`）在支持的设备上

### 2.3 卡片生命周期

```
推荐算法选卡 → 卡片入栈（peek 动画） → 用户看到卡片
    → 交互（答题/阅读/反馈） → 滑走（飞出动画）
    → 交互数据写入 profile → 触发下一次推荐
```

---

## 三、卡片类型

### v1 实现
| 类型 | 图示 | 数据源 | 说明 |
|---|---|---|---|
| `question` | 题目卡 | practice.html + ai-question-gen.js | 题干+选项+答案+解析，可交互答题 |
| `knowledge` | 知识点卡 | syllabus-data.js | topic name + 概要 + 权重 + 前置依赖 |
| `progress` | 进度卡 | streak.js + analytics.js | 今日统计 + 连续天数 + 徽章 |

### v2-v10 扩展
| 类型 | 说明 |
|---|---|
| `review` | SRS 到期复习卡，显示上次答题信息 |
| `quiz` | 快速测验卡，3-5 题连续答 |
| `concept` | 概念图卡，知识点关联可视化 |
| `tip` | 考试技巧卡（如 SAT 猜题策略） |
| `deadline` | 申请/考试 DDL 提醒卡 |
| `badge` | 成就解锁卡 |
| `path` | 学习路径推荐卡 |

---

## 四、个性化推荐算法

### 4.1 v1 模拟算法（规则引擎）

```javascript
// 信号收集
signals = {
  accuracy: {                    // 按科目+难度统计正确率
    'sat.easy': 0.8,
    'sat.medium': 0.6,
    'ib.hard': 0.3
  },
  dwellTime: [],                 // 每张卡片停留时间（ms）
  swipeSpeed: [],                // 滑动速度（px/ms），快=不感兴趣
  explicitFeedback: [],          // 太简单/正好/太难
  bookmarks: [],                 // 收藏的卡片
  subjectRotation: [],           // 最近 5 张卡片的科目序列
  typeRotation: []               // 最近 3 张卡片的类型序列
}

// 推荐权重计算
recommend(card) {
  weight = 1.0

  // 1. 新鲜度：1 小时内看过的卡片降权
  if (seenRecently(card, 3600s)) weight *= 0.1

  // 2. 科目轮换：最近 5 张同科目降权
  if (sameSubjectInLast(5)) weight *= 0.3

  // 3. 难度自适应：正确率高→推难题，低→推简单题
  acc = getAccuracy(card.subject, card.difficulty)
  if (card.difficulty == 'hard' && acc > 0.8) weight *= 1.5
  if (card.difficulty == 'easy' && acc < 0.5) weight *= 1.5

  // 4. 类型多样性：避免连续同类型
  if (sameTypeInLast(3)) weight *= 0.5

  // 5. 用户偏好：收藏过的 topic 加权
  if (bookmarkedTopic(card.topicCode)) weight *= 1.3

  // 6. 权重高的 topic（考试占比大）优先
  if (card.weight > 0) weight *= (1 + card.weight / 100)

  return weight
}

// 加权随机选择
nextCard = weightedRandom(cards.map(c => ({card: c, weight: recommend(c)})))
```

### 4.2 算法演进路线

| 阶段 | 版本 | 算法 | 说明 |
|---|---|---|---|
| 规则引擎 | v1-v10 | 上述规则 | 基于硬编码规则，可解释 |
| 统计模型 | v11-v20 | 正确率+停留时间回归 | 简单统计模型，开始学习用户画像 |
| 协同过滤 | v21-v30 | mock 用户矩阵 | 模拟多用户数据，item-based CF |
| 知识追踪 | v31-v40 | BKT/EFKT 模拟 | 贝叶斯知识追踪，模拟掌握度 |
| 深度学习 | v41-v50 | 神经网络推荐 | （模拟）序列推荐模型 |

### 4.3 知识图谱

利用 `syllabus-data.js` 的 `prereq` 字段构建知识依赖图：

```
M-Alg-1a (Linear equations)
  ├── M-Alg-1b (Linear functions) — prereq: [M-Alg-1a]
  ├── M-Alg-1c (Absolute value) — prereq: [M-Alg-1a]
  └── M-Alg-1d (Graphing linear) — prereq: [M-Alg-1b]
```

推荐策略：如果用户在 `M-Alg-1a` 正确率高 → 推荐 `M-Alg-1b`（前置已满足）。
如果错误 → 推荐 `M-Alg-1a` 的复习卡或更基础的内容。

---

## 五、50 版本迭代路线图

### Phase 1：MVP 基础（v1-v10）

> 目标：可用的卡片滑动 + 模拟数据 + 基础推荐

| 版本 | 交付物 | 反馈检查点 |
|---|---|---|
| **v1** | 卡片堆叠 UI + 上下滑动手势 + 30 张模拟卡 + 基础规则推荐 + 难度反馈 | 动画手感、滑动流畅度 |
| v2 | 卡片飞出/入栈弹簧动画优化 + 触觉反馈 | 动画自然度 |
| v3 | 题目卡可交互答题（选项点击+答案揭示） | 答题体验 |
| v4 | 科目筛选器 + 卡片类型混合 | 筛选是否好用 |
| v5 | 会话统计（已看/正确率/时长） | 数据是否有用 |
| v6 | 收藏/跳过手势 + localStorage 持久化 | 手势是否直觉 |
| v7 | 进度卡 + 连续打卡集成 streak.js | 动力感 |
| v8 | 推荐算法 v2（科目轮换+难度自适应） | 推荐是否合理 |
| v9 | PC/Pad 适配（键盘+滚轮+按钮） | 多端体验 |
| v10 | 每卡片反馈面板（太简单/正好/太难 + 喜欢/不喜欢） | 反馈收集效率 |

### Phase 2：数据集成（v11-v20）

> 目标：接入真实数据源，不再只用模拟数据

| 版本 | 交付物 | 反馈检查点 |
|---|---|---|
| v11 | 接入 syllabus-data.js → 知识点卡从真实考纲生成 | 内容准确性 |
| v12 | 接入 practice.html DOM → 题目卡从真实题库生成 | 题目质量 |
| v13 | 接入 practice-engine.js → 答题记录同步 | 数据一致性 |
| v14 | 接入 spaced-repetition.js → SRS 复习卡 | 复习时机 |
| v15 | 接入 streak.js → 真实连续打卡数据 | 打卡动力 |
| v16 | 接入 app-data.js → 申请进度/DDL 卡片 | 信息相关性 |
| v17 | 知识图谱可视化（prereq 链推荐） | 路径是否合理 |
| v18 | 多科目切换 + 全科目覆盖（11 科） | 覆盖完整性 |
| v19 | 卡片搜索 + 标签筛选 | 检索效率 |
| v20 | 离线缓存（Service Worker） | 离线可用性 |

### Phase 3：个性化算法（v21-v30）

> 目标：真正"懂用户"的推荐

| 版本 | 交付物 | 反馈检查点 |
|---|---|---|
| v21 | 用户画像（兴趣标签+能力等级+偏好科目） | 画像准确性 |
| v22 | 互动信号采集器（停留/速度/正确率/反馈） | 信号质量 |
| v23 | 模拟协同过滤（mock 100 用户数据） | 推荐多样性 |
| v24 | 自适应难度引擎（BKT 模拟） | 难度曲线 |
| v25 | Topic 推荐器（基于 prereq 图谱） | 学习路径 |
| v26 | 弱项检测 + 针对性推送 | 弱项改善 |
| v27 | 学习路径生成器（A→B→C 序列推荐） | 路径连贯性 |
| v28 | A/B 测试框架（推荐策略对比） | 实验能力 |
| v29 | 算法参数调优（权重自动调整） | 推荐准确率 |
| v30 | 冷启动策略（新用户问卷+快速校准） | 新用户留存 |

### Phase 4：内容丰富度（v31-v40）

> 目标：卡片不只是文字

| 版本 | 交付物 | 反馈检查点 |
|---|---|---|
| v31 | 公式渲染（KaTeX/MathJax） | 数学公式可读性 |
| v32 | 图片/图表卡片 | 视觉信息 |
| v33 | 概念地图卡（mini 知识图谱） | 关联理解 |
| v34 | 成就/徽章卡片（解锁动画） | 成就感 |
| v35 | 学习小组卡片（social signal） | 社交动力 |
| v36 | 排行榜卡片（mock 数据） | 竞争动力 |
| v37 | 分享卡片（生成图片分享） | 传播性 |
| v38 | 评论/讨论入口 | 社区活跃度 |
| v39 | AI 导师集成（ai-tutor.js） | AI 互动质量 |
| v40 | AI 出题集成（ai-question-gen.js） | 题目生成质量 |

### Phase 5：打磨与上线（v41-v50）

> 目标：生产级品质

| 版本 | 交付物 | 反馈检查点 |
|---|---|---|
| v41 | 动画微调（60fps + 减少动画偏好） | 流畅度 |
| v42 | 性能优化（虚拟列表 + 懒加载） | 大数据量性能 |
| v43 | 无障碍（ARIA + 键盘导航 + 屏幕阅读器） | a11y 合规 |
| v44 | 国际化（i18n.js 集成） | 多语言 |
| v45 | 深色/浅色主题切换 | 视觉偏好 |
| v46 | PWA 安装（manifest + sw.js） | 可安装性 |
| v47 | 数据分析仪表盘（个人学习报告） | 数据洞察 |
| v48 | 导出/导入学习数据 | 数据可迁移 |
| v49 | 设置面板（推荐策略/难度/科目偏好） | 可配置性 |
| **v50** | 正式发布 + 全站导航集成 | 整体满意度 |

---

## 六、反馈收集机制

### 6.1 产品内反馈（用户→系统）

**每张卡片的即时反馈**
```
┌─────────────────────────────┐
│  这张卡片对你来说：          │
│  [ 太简单 ] [ 正好 ] [ 太难 ] │
│                              │
│  [ 👍 喜欢 ]    [ 👎 跳过 ]   │
└─────────────────────────────┘
```
- 3 档难度反馈 → 调整推荐难度
- 喜欢/跳过 → 内容偏好信号
- 数据写入 `localStorage: douke_feedback`

**每会话结束反馈**
```
┌─────────────────────────────┐
│  本次学习 12 张卡片 · 8 分钟  │
│  正确率 75% · 连续 3 天       │
│                              │
│  这次体验如何？               │
│  [ 😊 ] [ 😐 ] [ 😞 ]        │
│                              │
│  [ 填写建议（可选）]          │
└─────────────────────────────┘
```

**隐式信号（用户不主动操作）**
| 信号 | 含义 | 采集方式 |
|---|---|---|
| 停留时长 | >10s = 深度阅读，<2s = 快速跳过 | cardVisible → cardSwipe 时间差 |
| 滑动速度 | 快 = 不感兴趣 | touchstart→touchend 时间 / 距离 |
| 答题正确率 | 能力水平 | question 卡答题结果 |
| 收藏率 | 内容质量 | bookmark 操作 |
| 回看率 | 卡片吸引力 | 下滑（prev）操作 |
| 会话长度 | 产品粘性 | sessionStart → sessionEnd |
| 次日留存 | 产品价值 | localStorage 记录上次访问日期 |

### 6.2 版本迭代反馈（用户→开发者）

**版本更新提示卡**
```
┌─────────────────────────────┐
│  ✨ 抖科 v2 更新              │
│                              │
│  · 卡片动画更流畅             │
│  · 新增触觉反馈              │
│  · 修复滑动卡顿              │
│                              │
│  试试看 →                     │
└─────────────────────────────┘
```

**反馈表单（可导出）**
- `douke_feedback` localStorage key
- 结构：`{ version, session_id, card_feedbacks[], session_rating, suggestion_text, ts }`
- 导出按钮：生成 JSON 下载，用户可发给开发者
- v20+ 上传到服务端（`Analytics.track('douke_feedback', data)`）

**A/B 测试（v28+）**
- 50% 用户用算法 A，50% 用算法 B
- 对比会话长度、正确率、留存率
- 结果写入 `douke_ab_results`

### 6.3 开发者侧反馈处理流程

```
用户反馈 → 分类（bug/feature/content/UX）
  → bug → 立即修复，下个版本
  → feature → 评估优先级，加入路线图
  → content → 修正卡片内容/数据
  → UX → 调整交互/动画参数
  → 记录到 CHANGELOG → 版本更新卡通知用户
```

---

## 七、数据源

### 7.1 现有数据源（已验证可用）

| 数据源 | 文件 | 卡片类型 | 数据量 |
|---|---|---|---|
| 考纲 Topic | `js/syllabus-data.js` | knowledge | 8 科 × ~40 topic = 320+ |
| 练习题 | `academics/practice/*/practice.html` | question | 8 科 × 120 + 3 竞赛 = 1040 题 |
| AI 出题 | `js/ai-question-gen.js` | question | 无限（模板+AI） |
| SRS 复习 | `js/spaced-repetition.js` | review | 按用户答题量增长 |
| 连续打卡 | `js/streak.js` | progress | 5 级徽章 |
| 申请进度 | `js/app-data.js` | progress/deadline | 按用户数据 |
| 行为追踪 | `js/analytics.js` | (埋点) | 全事件 |

### 7.2 数据结构映射

```
syllabus-data.js topic → knowledge card
  { code → topicCode, name → title, weight → badge, prereq → pathHint }

practice.html .q → question card
  { q-num【code】→ topicCode, q-text → stem, q-choices → choices,
    q-answer → answer, q-explanation → explanation, 难度 → difficulty }

SRS getDueQuestions() → review card
  { qid → cardId, info.ease → difficulty, info.nextReview → urgency }

Streak getData() → progress card
  { current → streakCount, max → bestStreak, history → heatmap }
```

### 7.3 竞赛科目补充

`amc/usabo/ukmt` 3 科的 topic-code 不在 `syllabus-data.js` 中（独立前缀 A-/B-/U-），v18 补建。

---

## 八、技术架构

### 8.1 v1 架构（单文件）

```
douke.html
├── <style>  — 全部 CSS（卡片堆叠 + 动画 + 响应式）
├── <body>
│   ├── .dk-topbar     — 顶部栏（logo + 科目筛选 + streak）
│   ├── .dk-stack      — 卡片堆叠容器
│   ├── .dk-controls   — 底部控制（prev/next + 计数器）
│   └── .dk-session    — 会话统计浮层
└── <script>  — 全部 JS（数据 + 推荐 + 交互 + 持久化）
```

### 8.2 演进架构（v10+）

```
douke/
├── index.html          — 入口
├── css/
│   ├── douke.css       — 主样式
│   ├── cards.css       — 卡片样式
│   └── animation.css   — 动画
├── js/
│   ├── douke-app.js    — 主控制器
│   ├── douke-data.js   — 数据层（对接 syllabus-data/practice-engine）
│   ├── douke-recommend.js — 推荐算法
│   ├── douke-gesture.js   — 手势/交互
│   └── douke-feedback.js  — 反馈收集
└── cards/              — 卡片模板（v31+ 动态加载）
```

### 8.3 性能考量

- **卡片预加载**：当前卡 + 后 2 张在 DOM 中，更远的卡延迟创建
- **动画**：只用 `transform` + `opacity`（GPU 加速），避免 layout/paint
- **触摸**：`passive: true` 事件监听，不阻塞滚动
- **数据**：mock 数据硬编码在 JS 中（v1），v11+ 动态从 DOM/API 加载

---

## 九、成功指标

### v1 验收标准
- [ ] 手机端上下滑动流畅（60fps）
- [ ] 卡片堆叠动画自然（弹簧感）
- [ ] 30 张模拟卡覆盖 5+ 科目
- [ ] 题目卡可答题（选选项→揭示答案）
- [ ] 每张卡有难度反馈按钮
- [ ] 会话统计正确（已看数/正确率）
- [ ] PC 端键盘/按钮可用
- [ ] localStorage 持久化（刷新不丢）

### v10 验收标准
- [ ] 推荐算法体现个性化（不同操作→不同推送）
- [ ] 反馈数据可导出
- [ ] 移动端手势完整（上下左右双击长按）
- [ ] 无 console error

### v50 验收标准
- [ ] 日活用户刷卡 >50 张/天
- [ ] 次日留存 >40%
- [ ] 推荐准确率（用户"喜欢"率）>60%
- [ ] 全科目覆盖（11 科）
- [ ] PWA 可安装
- [ ] 无障碍合规

---

## 十、文件索引

| 文件 | 说明 |
|---|---|
| `/workspace/douke.html` | v1 实现（单文件） |
| `/workspace/docs/DOUKE-ROADMAP.md` | 本文档 |
| `/workspace/js/syllabus-data.js` | 考纲数据源（v11+ 接入） |
| `/workspace/js/practice-engine.js` | 题库数据源（v12+ 接入） |
| `/workspace/js/spaced-repetition.js` | SRS 数据源（v14+ 接入） |
| `/workspace/js/streak.js` | 打卡数据源（v15+ 接入） |

---

> **下一步**：实现 v1，浏览器实测，发布推送。然后等待用户反馈，按路线图迭代。
