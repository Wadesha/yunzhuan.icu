# 云转网站部署完整记录

> 域名：yunzhuan.icu  
> 日期：2026-07-19  
> 状态：✅ 已部署上线

---

## 目录

1. [需求分析](#1-需求分析)
2. [方案选型](#2-方案选型)
3. [HTML 页面开发](#3-html-页面开发)
4. [GitHub 仓库配置](#4-github-仓库配置)
5. [Vercel 部署](#5-vercel-部署)
6. [DNS 域名解析配置](#6-dns-域名解析配置)
7. [SSL 证书配置](#7-ssl-证书配置)
8. [互动效果更新](#8-互动效果更新)
9. [部署流程图](#9-部署流程图)
10. [常见问题与解决方案](#10-常见问题与解决方案)

---

## 1. 需求分析

### 1.1 用户需求

| 需求编号 | 需求描述 | 优先级 | 来源 |
|---------|---------|--------|------|
| R001 | 创建一个 Hello World HTML 页面 | P0 | 用户初次请求 |
| R002 | 使用免费托管平台部署网站 | P0 | 用户初次请求 |
| R003 | 绑定自定义域名 yunzhuan.icu | P0 | 用户提供域名 |
| R004 | 支持后续更新网站内容 | P1 | 用户询问更新方式 |
| R005 | 添加互动效果（主题切换、粒子、动画等） | P1 | 用户更新请求 |

### 1.2 技术要求

| 要求类型 | 具体要求 | 说明 |
|---------|---------|------|
| 托管平台 | 免费、支持自定义域名、自动 HTTPS | 预算有限，需生产可用 |
| 部署方式 | 支持后续更新、操作简单 | 用户非专业开发者 |
| 网站特性 | 响应式设计、视觉美观、互动效果 | 提升用户体验 |
| 域名配置 | DNS 解析、SSL 证书自动配置 | 安全访问 |

---

## 2. 方案选型

### 2.1 托管平台对比

| 平台 | 免费额度 | 自定义域名 | HTTPS | 部署方式 | 推荐度 |
|------|---------|-----------|-------|---------|--------|
| Vercel | 无限带宽/100GB月流量 | ✅ 免费 | ✅ 自动 | Git / CLI | 🏆 |
| Netlify | 100GB月流量 | ✅ 免费 | ✅ 自动 | Git / 拖拽上传 | 👍 |
| Cloudflare Pages | 无限带宽 | ✅ 免费 | ✅ 自动 | Git / 直传 | 👍 |
| GitHub Pages | 1GB空间/100GB月流量 | ✅ 免费 | ✅ | Git | ⚠️ |

### 2.2 最终方案选择

**选择 Vercel + GitHub** 的理由：

1. **自动部署**：GitHub push 后自动触发部署，无需手动操作
2. **免费额度充足**：100GB 月流量，足够个人网站使用
3. **HTTPS 自动配置**：Let's Encrypt 证书自动申请和续期
4. **全球 CDN**：访问速度快，覆盖全球节点
5. **专业级部署**：支持预览环境、分支部署等高级功能

---

## 3. HTML 页面开发

### 3.1 初始版本（v1.0）

**文件路径**：`/workspace/index.html`

**创建时间**：2026-07-19

**实现内容**：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>云转 - Hello World</title>
    <style>
        /* 渐变背景 */
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        /* 卡片容器 */
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }
        
        /* 渐变文字 */
        h1 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        /* 脉冲动画 */
        .status {
            animation: pulse 2s infinite;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <p class="domain">🌐 yunzhuan.icu</p>
        <div class="status">部署成功 ✓</div>
        <p class="footer">欢迎来到云转的世界</p>
    </div>
</body>
</html>
```

**设计要点**：
- 使用紫色渐变背景，现代感视觉
- 玻璃拟态卡片设计
- 渐变文字效果
- 部署成功状态脉冲动画
- 响应式布局适配移动端

---

## 4. GitHub 仓库配置

### 4.1 环境检查

**执行时间**：2026-07-19

**检查命令**：

```bash
# 检查 Git 配置
git config --global --list

# 检查 SSH Key
ls -la ~/.ssh/

# 检查 GitHub CLI
which gh && gh auth status
```

**检查结果**：
- Git 已安装，但未配置用户名/邮箱
- 无 SSH Key
- GitHub CLI 已安装，但未登录

### 4.2 GitHub CLI 登录

**执行时间**：2026-07-19

**登录命令**：

```bash
gh auth login
```

**登录流程**：
1. CLI 生成一次性验证码：`BEA1-3C9F`
2. 用户在浏览器访问 `https://github.com/login/device`
3. 输入验证码并授权
4. CLI 显示登录成功：`✓ Authentication complete. Logged in as Wadesha`

### 4.3 初始化 Git 仓库

**执行时间**：2026-07-19

**执行命令**：

```bash
cd /workspace
git init
git remote add origin https://github.com/Wadesha/yunzhuan.icu.git
git config user.name "Wadesha"
git config user.email "wadesha@users.noreply.github.com"
git add index.html
git commit -m "Initial commit: Hello World page"
git branch -M main
```

### 4.4 首次推送问题解决

**问题描述**：首次推送失败，报错 `fatal: could not read Username for 'https://github.com': terminal prompts disabled`

**原因分析**：Git 未配置凭证助手，无法使用 GitHub CLI 的认证信息

**解决方案**：

```bash
# 配置 Git 使用 GitHub CLI 的凭证助手
gh auth setup-git
```

**验证结果**：配置后推送成功

### 4.5 合并远端内容

**问题描述**：推送时被拒绝，远端已有 README.md 文件

**执行命令**：

```bash
git config pull.rebase false
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**推送结果**：

```
To https://github.com/Wadesha/yunzhuan.icu.git
   84ec610..32e4bf8  main -> main
branch 'main' set up to track 'origin/main'.
```

---

## 5. Vercel 部署

### 5.1 Vercel CLI 安装

**执行时间**：2026-07-19

**执行命令**：

```bash
npm install -g vercel
```

**安装结果**：成功安装 352 个包，版本 `Vercel CLI 56.3.2`

### 5.2 Vercel 登录

**执行命令**：

```bash
vercel login
```

**登录流程**：
1. CLI 生成一次性验证码：`SFBF-PQVL`
2. 用户在浏览器访问 `https://vercel.com/oauth/device?user_code=SFBF-PQVL`
3. 用户选择 Google 账号登录
4. 授权成功

### 5.3 连接 GitHub 仓库部署

**部署方式**：浏览器端操作（因 CLI 遇到 npm 网络问题）

**部署步骤**：
1. 访问 Vercel Dashboard：`https://vercel.com/dashboard`
2. 点击 **Add New...** → **Project**
3. 选择 `Wadesha/yunzhuan.icu` 仓库
4. 点击 **Import**
5. 配置页面直接点击 **Deploy**
6. 部署成功，生成临时域名：`yunzhuan-icu.vercel.app`

---

## 6. DNS 域名解析配置

### 6.1 Vercel 域名配置

**执行时间**：2026-07-19

**配置步骤**：
1. 在 Vercel 项目设置中点击 **Add Domain**
2. 输入域名：`yunzhuan.icu`
3. 选择环境：Production
4. 保存配置

### 6.2 Vercel DNS 要求

**Vercel 提供的配置**：

| 记录类型 | 主机记录 | 记录值 | 说明 |
|---------|---------|--------|------|
| A | @ | 216.198.79.1 | 根域名解析到 Vercel IP |

**可选配置**（推荐）：

| 记录类型 | 主机记录 | 记录值 | 说明 |
|---------|---------|--------|------|
| CNAME | www | cname.vercel-dns.com | www 子域名解析 |

### 6.3 用户域名注册商配置

**用户操作**：
1. 登录域名注册商后台
2. 选择业务需求：「将网站域名解析到服务器IPv4地址」
3. 选择网站域名：「yunzhuan.icu（对应设置"@"主机记录）」
4. 输入记录值：`216.198.79.1`
5. 保存配置

### 6.4 DNS 验证

**验证命令**：

```bash
# 检查 DNS 解析
dig +short yunzhuan.icu A

# 检查网站访问
curl -sI https://yunzhuan.icu
```

**验证结果**：
- DNS 解析正确：`216.198.79.1`
- 网站返回 200 OK

---

## 7. SSL 证书配置

### 7.1 证书生成

**Vercel 自动执行**：
1. 检测到 DNS 配置生效
2. 自动申请 Let's Encrypt 证书
3. 显示状态：`Generating SSL Certificate`
4. 证书生成完成，状态变为 `Valid Configuration`

### 7.2 HTTPS 验证

**验证结果**：
- ✅ SSL 证书已颁发
- ✅ HTTPS 访问正常
- ✅ 证书自动续期（Vercel 管理）

---

## 8. 互动效果更新

---

## 9. 美国大学专业导航内容更新

### 9.1 更新需求

| 需求编号 | 需求描述 | 优先级 | 来源 |
|---------|---------|--------|------|
| R006 | 创建美国大学专业导航网站 | P0 | 用户功能开发请求 |
| R007 | 按专业分类组织（计算机/工程/商科等） | P0 | 用户功能开发请求 |
| R008 | 每个专业页面包含中英文介绍 | P0 | 用户功能开发请求 |
| R009 | 使用纯文本超链接形式 | P1 | 用户功能开发请求 |

### 9.2 专业分类与数量

基于 NCES（美国国家教育统计中心）数据，选择了最受欢迎的 44 个本科专业，分为 8 个分类：

| 分类 | 数量 | 专业列表 |
|------|------|---------|
| 💻 计算机类 | 7 | 计算机科学、软件工程、人工智能、数据科学、网络安全、信息系统、人机交互 |
| 🛠️ 工程类 | 7 | 电气工程、机械工程、生物医学工程、土木工程、化学工程、工业工程、航空航天工程 |
| 💼 商科类 | 7 | 金融学、会计学、商业分析、市场营销、管理学、国际商务、供应链管理 |
| 🔬 生物与健康类 | 6 | 生物医学科学、护理学、分子生物学、公共卫生、神经科学、生物化学 |
| 👥 社会科学类 | 6 | 经济学、心理学、政治学、社会学、历史学、人类学 |
| 🔭 自然科学类 | 4 | 物理学、化学、数学、环境科学 |
| 🎨 艺术类 | 4 | 艺术、音乐、设计、传媒 |
| 📚 教育类 | 3 | 教育学、特殊教育、幼儿教育 |

### 9.3 页面设计规范

#### 9.3.1 首页设计

**文件路径**：`/workspace/index.html`

**设计要点**：
- 响应式布局，适配移动端和桌面端
- 卡片式分类展示，每个分类显示专业数量
- 悬停动画效果（背景色变化 + 左移 + 边框颜色变化）
- 统计数据展示（8个分类，44个专业）

**关键代码**：
```html
<div class="category">
    <h2>💻 计算机类 (Computer) <span class="count">7个专业</span></h2>
    <div class="major-list">
        <a href="computer/cs.html" class="major-link">
            <span class="cn">计算机科学</span>
            <span class="en">Computer Science</span>
        </a>
        <!-- ... 更多专业链接 -->
    </div>
</div>
```

#### 9.3.2 专业详情页设计

**文件路径**：`/workspace/{category}/{major}.html`

**设计要点**：
- 统一模板，确保所有专业页面风格一致
- 返回首页链接（面包屑导航）
- 中英文双语言介绍
- 卡片式内容布局

**关键代码**：
```html
<a href="../index.html" class="back-link">← 返回首页</a>
<h1>💻 计算机科学</h1>
<p class="en-name">Computer Science</p>

<div class="section">
    <h2>中文介绍</h2>
    <p>计算机科学是研究计算机系统、算法和计算理论的学科...</p>
</div>

<div class="section">
    <h2>English Introduction</h2>
    <p>Computer Science is the study of computer systems, algorithms...</p>
</div>
```

### 9.4 目录结构

```
/workspace/
├── index.html                    # 首页（专业分类导航）
├── computer/                     # 计算机类（7个专业）
│   ├── cs.html                   # 计算机科学
│   ├── software.html             # 软件工程
│   ├── ai.html                   # 人工智能
│   ├── data.html                 # 数据科学
│   ├── cyber.html                # 网络安全
│   ├── info.html                 # 信息系统
│   └── hci.html                  # 人机交互
├── engineering/                  # 工程类（7个专业）
│   ├── electrical.html           # 电气工程
│   ├── mechanical.html           # 机械工程
│   ├── biomedical.html           # 生物医学工程
│   ├── civil.html                # 土木工程
│   ├── chemical.html             # 化学工程
│   ├── industrial.html           # 工业工程
│   └── aerospace.html            # 航空航天工程
├── business/                     # 商科类（7个专业）
│   ├── finance.html              # 金融学
│   ├── accounting.html           # 会计学
│   ├── analytics.html            # 商业分析
│   ├── marketing.html            # 市场营销
│   ├── management.html           # 管理学
│   ├── international.html        # 国际商务
│   └── supply.html               # 供应链管理
├── biology/                      # 生物与健康类（6个专业）
│   ├── biomedical.html           # 生物医学科学
│   ├── nursing.html              # 护理学
│   ├── molecular.html            # 分子生物学
│   ├── public.html               # 公共卫生
│   ├── neuroscience.html         # 神经科学
│   └── biochemistry.html         # 生物化学
├── social/                       # 社会科学类（6个专业）
│   ├── economics.html            # 经济学
│   ├── psychology.html           # 心理学
│   ├── political.html            # 政治学
│   ├── sociology.html            # 社会学
│   ├── history.html              # 历史学
│   └── anthropology.html         # 人类学
├── science/                      # 自然科学类（4个专业）
│   ├── physics.html              # 物理学
│   ├── chemistry.html            # 化学
│   ├── mathematics.html          # 数学
│   └── environmental.html        # 环境科学
├── arts/                         # 艺术类（4个专业）
│   ├── fine-arts.html            # 艺术
│   ├── music.html                # 音乐
│   ├── design.html               # 设计
│   └── communication.html        # 传媒
├── education/                    # 教育类（3个专业）
│   ├── education.html            # 教育学
│   ├── special.html              # 特殊教育
│   └── early.html                # 幼儿教育
├── snapshots/                    # 快照目录
├── snapshot.sh                   # 快照脚本
├── DEPLOYMENT_LOG.md             # 部署记录
└── README.md                     # 项目说明
```

### 9.5 专业页面内容规范

每个专业页面包含：
1. **返回首页链接** - 方便用户导航回首页
2. **专业中文名** - 大号标题显示
3. **专业英文名** - 副标题显示
4. **中文介绍** - 简洁明了的专业描述，包含专业核心内容和就业方向
5. **English Introduction** - 英文专业介绍，与中文内容对应

**内容编写原则**：
- 基于 NCES 数据，确保专业信息准确
- 不虚构数据，仅提供事实性描述
- 中英文内容一一对应
- 每个专业介绍约 150-200 字

### 9.6 更新流程

**执行时间**：2026-07-19

**执行步骤**：

```bash
# 1. 创建目录结构
mkdir -p computer engineering business biology social science arts education

# 2. 创建首页（专业分类导航）
# 创建 index.html

# 3. 创建各分类专业页面
# 创建 computer/*.html（7个）
# 创建 engineering/*.html（7个）
# 创建 business/*.html（7个）
# 创建 biology/*.html（6个）
# 创建 social/*.html（6个）
# 创建 science/*.html（4个）
# 创建 arts/*.html（4个）
# 创建 education/*.html（3个）

# 4. 保存快照
./snapshot.sh

# 5. 提交并推送
git add .
git commit -m "Add 44 US undergraduate majors navigation with 8 categories"
git push origin main
```

---

## 10. 部署流程图

### 8.1 更新需求

| 功能编号 | 功能描述 | 实现方式 |
|---------|---------|---------|
| F001 | 鼠标跟随粒子效果 | JavaScript 粒子系统 |
| F002 | 主题切换（紫/蓝/绿） | CSS 渐变 + 按钮交互 |
| F003 | 主题切换粒子爆炸效果 | CSS animation |
| F004 | 打字机效果（多语言切换） | JavaScript 定时器 |
| F005 | 点击计数器 | JavaScript 事件监听 |
| F006 | 卡片悬浮动画 | CSS hover transition |
| F007 | 按钮波纹效果 | CSS ::before 伪元素 |
| F008 | 响应式布局 | CSS media query |

### 8.2 更新实现

**文件路径**：`/workspace/index.html`（v2.0）

**更新时间**：2026-07-19

**主要代码变更**：

1. **粒子系统**：
```javascript
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.background = themes[currentTheme].particleColor;
    particlesContainer.appendChild(particle);
    // 粒子动画逻辑...
}
```

2. **主题切换**：
```javascript
const themes = {
    purple: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', ... },
    blue: { gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', ... },
    green: { gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)', ... }
};
```

3. **打字机效果**：
```javascript
const greetings = ['Hello World', '你好世界', 'こんにちは世界', 'Bonjour Monde'];
function typeWriter() { /* 逐字显示逻辑 */ }
function deleteWriter() { /* 逐字删除逻辑 */ }
```

4. **点击计数器**：
```javascript
document.querySelector('.container').addEventListener('click', () => {
    clickCount++;
    document.getElementById('click-count').textContent = clickCount;
});
```

### 8.3 更新推送

**执行命令**：

```bash
cd /workspace
git add index.html
git commit -m "Add interactive effects: particle system, theme switcher, typing animation, click counter"
git push origin main
```

**推送结果**：

```
[main cc94f8e] Add interactive effects: particle system, theme switcher, typing animation, click counter
 1 file changed, 374 insertions(+), 4 deletions(-)
To https://github.com/Wadesha/yunzhuan.icu.git
   32e4bf8..cc94f8e  main -> main
```

### 8.4 自动部署

**Vercel 自动触发**：
1. 检测到 GitHub push
2. 自动拉取代码
3. 构建部署
4. 部署完成，网站更新

---

## 9. 部署流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户需求                                  │
│                 创建 Hello World 网站 + 绑定域名                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      方案选型                                    │
│  Vercel + GitHub (免费托管 + 自动部署 + 自定义域名)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HTML 开发                                  │
│  创建 index.html (渐变背景 + 玻璃拟态 + 脉冲动画)                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub 仓库配置                               │
│  1. gh auth login (设备码登录)                                   │
│  2. git init / remote add                                       │
│  3. git add / commit / push                                     │
│  ⚠️ 问题：凭证助手配置 → 解决方案：gh auth setup-git              │
│  ⚠️ 问题：远端冲突 → 解决方案：git pull --allow-unrelated        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel 部署                                  │
│  1. vercel login (设备码登录)                                    │
│  2. 连接 GitHub 仓库                                            │
│  3. 自动构建部署 → 生成临时域名 yunzhuan-icu.vercel.app          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DNS 域名配置                                  │
│  1. Vercel 添加自定义域名 yunzhuan.icu                           │
│  2. 域名注册商添加 A 记录 @ → 216.198.79.1                       │
│  3. DNS 验证生效                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SSL 证书配置                                  │
│  Vercel 自动申请 Let's Encrypt 证书                              │
│  ✅ HTTPS 访问正常                                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      互动效果更新                                │
│  1. 更新 index.html (粒子 + 主题 + 打字机 + 计数器)              │
│  2. git push → Vercel 自动部署                                   │
│  3. 网站更新完成                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      部署完成 ✅                                  │
│  访问地址：https://yunzhuan.icu                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. 常见问题与解决方案

### 10.1 GitHub 连接超时

**问题**：`This site can't be reached - github.com took too long to respond`

**原因**：网络环境限制，无法访问 GitHub

**解决方案**：
1. 尝试切换网络（手机热点、VPN）
2. 或使用其他托管平台（Netlify、Cloudflare Pages）
3. 或使用 Vercel CLI 直接部署（无需 GitHub）

### 10.2 Git 推送认证失败

**问题**：`fatal: could not read Username for 'https://github.com': terminal prompts disabled`

**原因**：Git 未配置凭证助手

**解决方案**：
```bash
gh auth setup-git
```

### 10.3 远端分支冲突

**问题**：`! [rejected] main -> main (fetch first)`

**原因**：远端仓库已有内容（如 README.md）

**解决方案**：
```bash
git config pull.rebase false
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 10.4 DNS 配置后网站无法访问

**问题**：`HTTP ERROR 502` 或 `This page isn't working`

**原因**：DNS 解析尚未生效（TTL 缓存）

**解决方案**：
1. 等待 DNS 传播（通常 5-30 分钟，最长几小时）
2. 强制刷新浏览器缓存（Ctrl + F5）
3. 使用手机流量测试（避免本地 DNS 缓存）

### 10.5 Vercel CLI 网络问题

**问题**：`Error: Failed to fetch dist-tags from npm`

**原因**：npm 仓库访问受限

**解决方案**：
1. 使用浏览器端 Vercel Dashboard 部署
2. 或配置 npm 镜像源

---

## 11. 后续更新流程

### 11.1 标准更新流程

```bash
# 1. 修改代码
edit index.html

# 2. 提交更改
git add index.html
git commit -m "描述更新内容"

# 3. 推送到 GitHub
git push origin main

# 4. Vercel 自动部署（无需额外操作）
```

### 11.2 更新时间线

| 步骤 | 耗时 | 说明 |
|------|------|------|
| 修改代码 | 视需求而定 | 开发者操作 |
| git push | 几秒 | 网络传输 |
| Vercel 检测 | 10-30秒 | 自动检测 push |
| 构建部署 | 30-60秒 | 自动构建 |
| 网站更新 | 立即 | 全球 CDN 分发 |

---

## 12. 资源清单

### 12.1 外部服务

| 服务 | 地址 | 用途 |
|------|------|------|
| GitHub 仓库 | https://github.com/Wadesha/yunzhuan.icu | 代码托管 |
| Vercel 项目 | https://vercel.com/wadesha/yunzhuan-icu | 网站托管 |
| 域名注册商 | （用户自行管理） | DNS 解析 |

### 12.2 文件清单

| 文件/目录 | 路径 | 说明 |
|-----------|------|------|
| index.html | /workspace/index.html | 网站主页面（专业分类导航） |
| computer/ | /workspace/computer/ | 计算机类专业页面（7个） |
| engineering/ | /workspace/engineering/ | 工程类专业页面（7个） |
| business/ | /workspace/business/ | 商科类专业页面（7个） |
| biology/ | /workspace/biology/ | 生物与健康类专业页面（6个） |
| social/ | /workspace/social/ | 社会科学类专业页面（6个） |
| science/ | /workspace/science/ | 自然科学类专业页面（4个） |
| arts/ | /workspace/arts/ | 艺术类专业页面（4个） |
| education/ | /workspace/education/ | 教育类专业页面（3个） |
| snapshots/ | /workspace/snapshots/ | 历史快照目录 |
| snapshot.sh | /workspace/snapshot.sh | 快照脚本 |
| DEPLOYMENT_LOG.md | /workspace/DEPLOYMENT_LOG.md | 部署记录文档 |
| README.md | /workspace/README.md | 项目说明 |

---

## 13. 快照机制

### 13.1 功能说明

为每次 HTML 更新创建带时间戳的快照备份，方便回溯历史版本。

### 13.2 快照文件命名规则

```
snapshots/index_YYYYMMDD_HHMMSS.html
```

**示例**：`snapshots/index_20260719_012800.html`

### 13.3 快照脚本

**文件路径**：`/workspace/snapshot.sh`

```bash
#!/bin/bash

timestamp=$(date +"%Y%m%d_%H%M%S")
snapshot_dir="snapshots"
source_file="index.html"
snapshot_file="${snapshot_dir}/index_${timestamp}.html"

mkdir -p "${snapshot_dir}"
cp "${source_file}" "${snapshot_file}"

echo "✅ 快照已保存: ${snapshot_file}"
git add "${snapshot_file}"
echo "✅ 快照已添加到 git"
```

### 13.4 使用方式

```bash
# 每次更新前运行快照脚本
./snapshot.sh

# 然后正常提交和推送
git add index.html
git commit -m "描述更新内容"
git push origin main
```

### 13.5 快照目录结构

```
/workspace/
├── index.html              # 当前最新版本
├── snapshot.sh             # 快照脚本
└── snapshots/              # 快照目录
    ├── index_20260719_012800.html  # 历史快照 1
    ├── index_20260719_xxxxxx.html  # 历史快照 2
    └── ...                          # 更多快照
```

---

## 15. 课程详情页更新

### 15.1 更新需求

| 需求编号 | 需求描述 | 优先级 | 来源 |
|---------|---------|--------|------|
| R010 | 每个专业页面增加核心课程链接区 | P0 | 用户功能开发请求 |
| R011 | 每门课程创建详情页（课程介绍+大作业） | P0 | 用户功能开发请求 |
| R012 | 课程介绍和大作业均为中英文双语 | P0 | 用户功能开发请求 |
| R013 | 大作业内容需贴近真实教学 | P0 | 用户功能开发请求 |
| R014 | 紧凑纯文本超链接样式，无任何 icon/emoji | P0 | 用户样式要求 |

### 15.2 课程统计

共为 44 个专业创建课程详情页，每专业 7 门核心课程，总计 **308 门课程详情页**。

| 分类 | 专业数 | 课程数 | 课程目录 |
|------|--------|--------|---------|
| 计算机类 | 7 | 49 | computer/courses/ |
| 工程类 | 7 | 49 | engineering/courses/ |
| 商科类 | 7 | 49 | business/courses/ |
| 生物与健康类 | 6 | 42 | biology/courses/ |
| 社会科学类 | 6 | 42 | social/courses/ |
| 自然科学类 | 4 | 28 | science/courses/ |
| 艺术类 | 4 | 28 | arts/courses/ |
| 教育类 | 3 | 21 | education/courses/ |
| **合计** | **44** | **308** | - |

### 15.3 课程页设计规范

#### 15.3.1 专业页课程链接区

**位置**：专业介绍之后，页脚之前

**样式**：
- 紧凑 flex 布局，自动换行
- 左侧紫色边框装饰
- 悬停背景色变化
- 无任何 icon/emoji

**关键代码**：
```html
<div class="section">
    <h2>核心课程 <span class="en">Core Courses</span></h2>
    <div class="course-list">
        <a href="courses/cs101.html" class="course-link">课程名称</a>
        <!-- 更多课程链接 -->
    </div>
</div>
```

#### 15.3.2 课程详情页模板

**文件路径**：`/workspace/{category}/courses/{course}.html`

**页面结构**：
1. 返回首页链接（面包屑导航）
2. 课程中文名 + 英文名
3. 课程介绍（含学分、先修课、学期信息）
4. 大作业（含作业标题、详细描述）
5. 页脚版权信息

**内容规范**：
- 课程介绍：中文约 120-150 字，英文约 80-100 词
- 大作业描述：中文约 100 字，英文约 60-80 词
- 所有内容均为中英文双语对照
- 大作业需贴近真实大学课程要求

### 15.4 更新执行

**执行时间**：2026-07-19

**执行方式**：按分类分批并行处理，使用子代理批量生成

**分批提交记录**：
1. 计算机类 7 个专业（49 门课程）
2. 工程类 7 个专业（49 门课程）
3. 商科类 7 个专业（49 门课程）
4. 生物与健康类 6 个专业（42 门课程）
5. 社会科学类 6 个专业（42 门课程）
6. 自然科学类 4 个专业（28 门课程）
7. 艺术类 4 个专业（28 门课程）
8. 教育类 3 个专业（21 门课程）

### 15.5 样式统一处理

**Emoji 清理**：所有专业页和课程页均不含任何 emoji/icon 图标

**返回链接统一**：所有课程页返回链接统一指向首页（`../index.html`），避免共享课程的返回冲突

---

## 16. 版本历史

| 版本 | 日期 | 变更内容 | 提交哈希 |
|------|------|---------|---------|
| v1.0 | 2026-07-19 | 初始版本：Hello World 页面 | 32e4bf8 |
| v2.0 | 2026-07-19 | 添加互动效果：粒子、主题切换、打字机、计数器 | cc94f8e |
| v2.1 | 2026-07-19 | 添加部署记录文档 DEPLOYMENT_LOG.md | 11a9be4 |
| v2.2 | 2026-07-19 | 添加快照机制：自动保存带时间戳的 HTML 备份 | 908d785 |
| v3.0 | 2026-07-19 | 创建美国大学专业导航：44个专业，8个分类，中英文介绍 | a8909c6 |
| v4.0 | 2026-07-19 | 新增 308 门课程详情页：每专业 7 门核心课程，含课程介绍和大作业，中英文双语 | - |

---

*文档更新时间：2026-07-19*
