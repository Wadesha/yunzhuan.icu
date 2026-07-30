# 网站承载力 · Token/密钥需求清单（供确认）

> 回答：我们网站分别需要什么承载力、什么 Token/Key、哪些是必须的、哪些可选、成本多少、有效期多久

---

## 1. 承载力评估（按阶段）

### 1.1 三阶段用户规模预估

| 阶段 | 时间窗口 | 日活 DAU | 月活 MAU | QPS（峰值）| 题库规模 | 存储需求 |
|---|---|---|---|---|---|---|
| **A · 内测期** | v1.0 ~ v10.0（现在起 2 个月）| 1 - 50 | 200 | 5 | 2k - 5k 题 | localStorage + Vercel KV 免费版 |
| **B · 种子期** | v11.0 ~ v30.0（2-8 个月）| 50 - 5000 | 2000 - 5 万 | 50 | 5k - 5 万题 | Vercel KV Pro / Supabase 免费 |
| **C · 增长期** | v31.0 ~ v50.0（8 个月 +）| 5000+ | 50 万 + | 500+ | 5 万 - 50 万题 | 需要付费方案（详见 §2）|

### 1.2 各功能模块承载力需求拆解

| 模块 | 阶段 A 需求 | 阶段 B 需求 | 阶段 C 需求 |
|---|---|---|---|
| **静态页面托管** | Vercel Hobby 完全够用（100GB 月流量） | 升级 Vercel Pro（1TB） | Vercel Enterprise / Cloudflare Pages 无限带宽 |
| **答题数据存储** | localStorage + Vercel KV 免费（1GB，3 万读/日）| Vercel KV Pro（5GB，30 万读/日）或 Supabase Postgres（免费版 500MB） | Supabase Pro / AWS DynamoDB / Cloudflare D1 |
| **用户画像&账号** | CloudSlot（免费）+ Supabase 占坑 | Supabase Auth（5 万 MAU 免费） | Supabase Auth 付费 / Clerk / Auth0 |
| **推荐算法计算** | 纯浏览器端 JS（零成本） | 每日离线训练 1 次（GitHub Actions 免费时长 2000 min/月） | 在线推理 API（Vercel Functions + 预计算模型） |
| **A/B 实验数据** | DoukeScoring + localStorage 聚合 | GrowthBook 自托管（Vercel Hobby） | Statsig / Optimizely |
| **访问统计** | Vercel Analytics 免费版 | Vercel Analytics Pro | Mixpanel / Amplitude 免费版 |
| **LLM 辅助生成（v21+）**| 不用 | 每月 50-100 美元 API 额度 | 按 10 万 MAU 估 300-1000 美元/月 |
| **图数据库（v11+）**| 不用 / JSON 前端遍历 | Neo4j Aura Free（1 万节点） | Neo4j Aura Pro / Dgraph |

---

## 2. Token / API Key / 密钥清单（完整清单）

### 2.1 开发与代码托管类 — 🔴 必须项

| Token | 用途 | 当前状态 | 有效期 | 安全级别 | 备注 |
|---|---|---|---|---|---|
| **GitHub PAT** `ghp_***` | git push、Vercel 拉代码、Actions CI | ✅ 已配置，最新 `ghp_MMR2...` | **90 天**（~2026-10-27）| 🔴 极敏感 | 仅限 Wadesha 账户，禁止写代码、禁止提交。当前存于 `~/.git-credentials`（chmod 600） |
| GitHub SSH Key | git push 备用（可选但推荐）| ❌ 未配置 | 永久（可随时吊销）| 🟡 高 | 建议补一套 ed25519 SSH Key，作为 PAT 过期的兜底 |
| GitHub Actions Secret | CI 部署、自动化脚本 | ❌ 未配置（目前手动 push） | 手动管理 | 🟡 高 | 未来 v6+ 做 LR 模型自动训练要用到 |

### 2.2 部署与域名类 — 🔴 必须项

| Token | 用途 | 当前状态 | 有效期 | 安全级别 | 备注 |
|---|---|---|---|---|---|
| Vercel 登录 Token | 手动部署、vercel CLI | ✅ 网页端登录态已激活 | 30 天（会话） | 🟡 高 | Hobby 免费版 |
| 域名注册商账户 | yunzhuan.icu 续费/解析 | ✅ 已购买 | 2027-07-18 到期 | 🔴 极敏感 | 年续费约 60-80 元 |
| DNS 解析 Token（Cloudflare / 注册商 API）| 自动化解析配置（可选）| ❌ 未配置 | 各厂商不同 | 🟡 高 | 现在手动 DNS 够用，暂不需要 |

### 2.3 数据与用户系统类 — 🟡 阶段 B 必须

| Token | 用途 | 当前状态 | 免费额度 | 付费价格 | 阶段 |
|---|---|---|---|---|---|
| **Vercel KV** | 答题记录云同步、访问统计 API | ✅ 已接入（track.js / stats.js） | 1GB 存储，3 万读/日，3000 写/日 | Pro $10/月：5GB + 30 万读 | A→B 升级 |
| **Supabase URL + anon key** | 用户系统、Postgres 数据库、云同步 | ⚠️ 占坑模式，未填写真实 key | 500MB DB，5 万 MAU Auth，5GB 存储 | Pro $25/月：8GB DB，无限 MAU | v10 前补真实 key |
| **CloudSlot API**（可选） | prereq 用户模块 slots 账号 | ⚠️ 占坑模式（mock） | 免费额度未测 | 未知 | 待定（可能 Supabase 取代） |
| **Algolia / Meilisearch** | 站内搜索 | ❌ 未配置 | Algolia 免费 1 万条记录 | $29/月起 | v14 工具化阶段 |

### 2.4 AI 与推荐算法类 — 🟢 阶段 C 必须（D 方案深度学习 + LLM）

| Token | 用途 | 免费额度 | 付费预估（阶段 C 10 万 MAU） | 阶段 |
|---|---|---|---|---|
| **OpenAI API Key**（gpt-4o-mini / gpt-4o） | 题库生成、错题解析润色、个性化诊断卡、LLM rerank | $5 新账户（3 个月） | ~$300/月（题库批量生成 + 诊断卡生成） | v21 D 阶段 |
| **Anthropic Claude** | 替代/并行 OpenAI，长文处理 | $5 初始额度 | 同上 ~$200/月（备用冗余） | v21 |
| **DeepSeek / 通义千问 / 月之暗面** | 国内学生访问优化 + 低成本 | 一般有免费额度 | ~¥500/月（主用 DeepSeek，成本 1/10） | 国内访问友好 |
| **Cohere Rerank** | 推荐系统 rerank 阶段（候选 100 → 20 精排） | 免费 1000 次/月 | $49/月起 | 双塔 D2 + rerank 方案 |
| **Hugging Face Inference API**（可选） | 开源模型跑 Embedding / 双塔 embedding 计算 | 免费限频 | Pro $9/月解锁更高频 | D2 双塔模型上线 |
| **Lambda Labs / RunPod API Key**（可选） | 深度学习模型训练（D1 Transformer 序列推荐） | 无免费 | 4090 spot 约 $0.5/小时，每次训练 2-5 小时 ~$3 | D 阶段启用 |

### 2.5 分析与增长工具类 — 🟢 可选

| Token | 用途 | 免费额度 | 阶段 |
|---|---|---|---|
| **GrowthBook API Key** | 自托管 A/B 实验平台（MIT 协议） | 100% 免费（开源） | v6 B 阶段 |
| **Giscus Discussions ID** | GitHub Discussions 评论系统（contact.html 已接入） | 免费 | ✅ 已启用 |
| **Formspree 公钥** | 联系表单提交 | 50 次/月免费 | ✅ 已启用 |
| **不蒜子 busuanzi** | 总 PV/UV 展示（admin.html 已接入） | 免费 | ✅ 已启用 |
| **PostHog / Amplitude** | 行为分析、漏斗留存 | 100 万事件/月免费 | v14 之后 |
| **Sentry DSN** | 前端 JS 错误监控 | 5 千错误/月免费 | 阶段 B |

### 2.6 安全与监控类 — 🟡 阶段 B 必须

| Token | 用途 | 阶段 |
|---|---|---|
| **Cloudflare Turnstile / reCAPTCHA Key** | 登录/注册防机器人（v15 社区上线前必加） | 阶段 B |
| **Vercel Log Drains**（Datadog / Better Stack） | 错误日志、线上问题追溯 | 阶段 B |

---

## 3. 成本预估（3 档场景）

### 场景 1 · 内测期（当前 ~ 2 个月）= **几乎零成本**

```
Vercel Hobby  —— $0
Vercel KV 免费 —— $0
GitHub PAT    —— $0
域名续费（预付了1年）—— $0
合计：¥0
```

### 场景 2 · 种子期（2-8 个月，~5 万 MAU）= **约 350 元/月**

```
Vercel Pro      $20/月  （1TB 流量 + Pro Analytics）
Supabase Pro    $25/月  （用户系统 + Postgres 8GB）
Vercel KV Pro   $10/月  （答题记录 30 万读/日）
LLM API 杂费    $15/月  （DeepSeek 低成本生成部分题库和解析）
合计：约 $70/月 ≈ ¥350-500/月
```

### 场景 3 · 增长期（8 个月 +，50 万 MAU）= **约 5000-10000 元/月**

```
Vercel Enterprise 或 Cloudflare Pages —— 按需（$100-500/月）
Supabase 或 AWS RDS Postgres —— $100-300/月
LLM API（OpenAI + DeepSeek + Cohere 等）—— $300-800/月
GPU 模型训练（月 2-3 次）—— $50/月
监控/分析工具 —— $50/月
合计：约 $600-1700/月 ≈ ¥4000-12000/月
```

---

## 4. 安全规范（防止 Token 暴露事件再次发生）

### 4.1 三原则

| 原则 | 做法 |
|---|---|
| 1️⃣ **代码零硬编码** | 所有 token 绝不写入任何 `*.js / *.html / *.md / *.json` 文件 |
| 2️⃣ **分环境隔离** | 开发环境用 .env.local（.gitignore 已忽略），生产环境走 Vercel Project Environment Variables |
| 3️⃣ **定期轮换** | GitHub PAT 每 90 天强制换；所有 AI Key 每月轮换一次；可疑泄露立即 revoke |

### 4.2 安全检查清单（每次 push 前）

- [ ] `grep -r "ghp_\|sk-\|apiKey\|API_KEY" --include="*.js" --include="*.html" --include="*.md" .` 扫描无命中
- [ ] `.env.local` / `.env` 在 `.gitignore` 中
- [ ] `git diff --cached` 检查 staged 文件无 key
- [ ] 重要改动创建快照备份（snapshot.sh）

### 4.3 当前 Token 状态审查

| Token | 状态 | 风险评估 |
|---|---|---|
| GitHub PAT `ghp_MMR2...` | ✅ 仅存 `~/.git-credentials`（600 权限），代码中 grep 零命中 | 🟢 低风险 |
| Vercel KV REST API Token | ✅ 在 Vercel 平台加密存储，代码仅接 URL | 🟢 低风险 |
| Supabase 真实 key | ⚠️ 尚未填写真实值（占坑模式），无泄露风险 | 🟢 占位 OK |

---

## 5. 待确认决策项（请回复 A / B / C）

### 决策 1：阶段 A（当前）哪些立刻做
- **A**：只做承载力零成本（现状保持，Vercel Hobby + KV 免费）✅ 推荐
- **B**：现在就补 Supabase 真实 key
- **C**：连 GitHub SSH Key 也一起配

### 决策 2：AI LLM 接入时间点
- **A**：v21 D 阶段再接入（等 ABC 方案跑通再说）✅ 推荐
- **B**：v11 阶段先低额度接入（DeepSeek 低成本润色题目解析）
- **C**：现在就拿 DeepSeek 免费额度跑题库扩充自动化

### 决策 3：承载力付费升级触发点
- **A**：KPI 触发 — Vercel KV 免费额度用完 80% 才升级 Pro ✅ 推荐
- **B**：时间触发 — 3 个月后统一升级 Pro 全家桶
- **C**：用户触发 — MAU 破 1 万才升级

### 决策 4：Token 管理方式
- **A**：保持现状（本地文件 + 手动轮换，Wadesha 一人持有）✅ 推荐
- **B**：引入 1Password / Bitwarden 团队密码库 + 共享
- **C**：引入 Doppler / Infisical 环境变量管理平台（免费版）

---

*文档待确认，确认后：
1) 整合进 README.md §6-§7
2) 按决策执行（SSH Key / Supabase key / 安全 hook 等）
3) 推荐算法 ①-⑤ 项提升立刻动工*
