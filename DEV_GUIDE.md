# prerequisite 子站点开发注意事项

> 文档记录本项目的开发维护经验和工具使用规范，避免重复踩坑。

---

## 1. 项目结构原则

### 1.1 目录层级

```
/workspace/prerequisite/
├── index.html              # 入口页
├── quiz/                   # 刷题系统
│   ├── index.html
│   ├── js/
│   └── data/
├── 学科名/                 # 专业分类目录
│   ├── 专业.html
│   └── courses/
│       └── 课程.html
```

### 1.2 关键路径约定

| 页面 | 返回首页 | 返回专业 | 刷题入口 |
|------|---------|---------|---------|
| 首页 | - | - | 无 |
| 专业页 | `../index.html` | - | 无 |
| 课程页 | `../../index.html` | `../index.html` → 改为首页 | `../../quiz/index.html?course=xxx` |
| 刷题页 | `../index.html` | `history.back()` | - |

**课程页"返回专业"的问题**：一个课程可能被多个专业共享，因此统一返回首页更可靠。

---

## 2. 链接检查规范

### 2.1 常见错误

1. **目录 URL 没有显式 index.html**
   - 错误：`../../quiz/?course=xxx`
   - 正确：`../../quiz/index.html?course=xxx`
   - 原因：静态文件服务器（Vercel）能自动补全，但本地文件检测会误判

2. **相对路径层数错误**
   - 课程页在 `/学科/courses/xxx.html`，回退到根目录需要 `../../`
   - 专业页在 `/学科/xxx.html`，回退到根目录需要 `../`

3. **Query String 干扰检测**
   - 链接检测时应去掉 `?xxx` 再判断文件存在性

### 2.2 检测脚本

使用 `/workspace/check_links_v2.py` 检测：

```bash
python3 /workspace/check_links_v2.py
```

检测目标：
- 无效内部链接
- 专业页是否包含先修课程
- 课程页是否有学习示例 demo
- 页面是否完成链接增强标记

---

## 3. 批量脚本开发规范

### 3.1 脚本命名

| 脚本 | 用途 |
|------|------|
| `gen_q.py` | 生成题库 JSON |
| `add_quiz_links.py` | 批量添加刷题入口 |
| `enhance_links.py` | 批量增强导航链接和提示 |
| `check_links_v2.py` | 链接和内容检测 |
| `remove_emoji.py` | 清除 emoji |

### 3.2 防重复执行机制

所有批量修改脚本应检查标记，避免重复添加：

```python
if '<!-- enhanced-links -->' in content:
    return False  # 已增强，跳过
```

### 3.3 字符编码

- 所有 HTML/JS/JSON 文件使用 UTF-8
- Python 脚本统一加 `# -*- coding: utf-8 -*-`
- 避免中文引号 `"` `"` `'`，使用直引号 `"` `'`

---

## 4. 内容生成规范

### 4.1 题目数据格式

```json
{
  "id": "course-001",
  "courseId": "course-name",
  "courseName": "课程中文名",
  "type": "single" | "judge",
  "question": "中文题干",
  "questionEn": "English question",
  "options": ["选项1", "选项2", "选项3", "选项4"],
  "answer": 0,
  "explanation": "",
  "difficulty": 1
}
```

### 4.2 题干长度

- 单选题题干控制在 30 字以内
- 判断题题干控制在 25 字以内
- 避免复杂数学符号，用 `^` 代替上标

### 4.3 示例 demo 要求

课程页的学习示例应：
- 具体（有场景）
- 简短（2-3 句话）
- 中英双语
- 不含 emoji

---

## 5. 样式一致性

### 5.1 配色

- 主色：`#667eea`
- 辅色：`#764ba2`
- 背景：`#f5f5f5`
- 卡片背景：`white`
- 文字：`#333` / `#666` / `#888`

### 5.2 组件风格

- 卡片：`border-radius: 8px`
- 按钮：`border-radius: 22px`
- 提示条：左侧 3px 色块
- 不使用渐变色背景、不使用 emoji

---

## 6. 数据存储规范

### 6.1 localStorage

- 使用统一 key：`prereq_user_v1`
- 结构最小化，避免冗余字段
- 重要操作前读取，操作后立即保存

```javascript
const user = Storage.getUser();
user.coin += 1;
Storage.saveUser(user);
```

### 6.2 数据结构演变

需要升级数据结构时：
1. 修改 key 版本号（如 `prereq_user_v2`）
2. 在 `createUser` 中初始化新字段
3. 必要时写迁移逻辑

### 6.3 全局金币展示架构

#### 组件设计

| 文件 | 职责 |
|------|------|
| `js/user.js` | Storage 模块 + CoinDisplay 组件 |
| `css/user.css` | 金币栏和档案页样式 |
| `profile.html` | 用户档案页面 |

#### Storage 模块结构

```javascript
Storage = {
  KEY: 'prereq_user_v1',
  API_BASE_URL: '',        // 预留：后端地址
  getUser()                // 读取用户数据
  saveUser(user)           // 保存并触发云同步
  resetUser()              // 重置数据
  createUser()             // 创建新用户
  calcLevel(coin)          // 根据金币计算等级
  syncToCloud(user)        // 预留：同步到云端
  login(userId)            // 预留：登录
  logout()                 // 预留：登出
  getLeaderboard()         // 预留：排行榜
}
```

#### 用户数据结构

```javascript
{
  userId: 'user_xxx',
  createdAt: '2024-01-01T00:00:00Z',
  lastActiveAt: '2024-01-01T00:00:00Z',
  coin: 0,                 // 金币数量
  level: 1,                // 用户等级
  totalAnswered: 0,        // 总答题数
  totalCorrect: 0,         // 正确数
  totalSessions: 0,        // 刷题次数
  maxStreak: 0,            // 最高连击
  courseProgress: {},      // 课程进度
  badges: [],              // 勋章（预留）
  tasks: {}                // 任务（预留）
}
```

### 6.4 预留上云接口

#### 切换方式

将 `API_BASE_URL` 从空字符串改为后端地址即可启用云同步：

```javascript
// 本地开发
API_BASE_URL: ''

// 上线后
API_BASE_URL: 'https://api.yunzhuan.icu/v1'
```

#### 预留 API 列表

| 函数 | 用途 | 实现状态 |
|------|------|---------|
| `syncToCloud(user)` | 自动同步用户数据到云端 | 预留 |
| `login(userId)` | 用户登录并拉取云端数据 | 预留 |
| `logout()` | 清除会话 | 预留 |
| `getLeaderboard()` | 获取排行榜 | 预留 |
| `saveQuestionAnswer(...)` | 答题记录上报 | 预留 |

#### 上云注意事项

1. **数据迁移**：上线时需提供从 localStorage 迁移到云端的方案
2. **网络容错**：云同步失败时不影响本地使用
3. **冲突解决**：以云端数据为准，本地作为缓存
4. **隐私保护**：用户 ID 使用随机生成的字符串，不存储真实身份信息

---

## 7. 工具开发注意事项

### 7.1 任务变大后的关键原则

1. **先检测，后修改**
   - 不要直接覆盖文件
   - 先运行检查脚本了解现状

2. **小步快跑**
   - 一次只改一种问题
   - 每次改完立即验证

3. **防重复**
   - 用标记、用 id、用唯一类名
   - 脚本要幂等

4. **保留证据**
   - 所有脚本提交到仓库
   - 检测输出保存或记录

5. **路径计算要画图**
   - 特别是 `../` 和 `../../`
   - 用表格记录每种页面的路径

### 7.2 开发流程建议

```
需求/反馈 → 写检测脚本 → 确定影响范围 → 写修改脚本 → 验证 → 推送
```

### 7.3 避免的陷阱

| 陷阱 | 解决方案 |
|------|---------|
| 批量替换引号冲突 | 用列表存数据，不用字典字符串 |
| 路径计算错误 | 用 os.path 或画目录树 |
| 重复添加 HTML 块 | 加 `<!-- marker -->` |
| emoji 混入 | 提交前用脚本扫描 |
| 检测脚本误报 | 去掉 query string，目录补 index.html |

---

## 8. 部署验证清单

推送 GitHub 后检查：

- [ ] Vercel 部署成功
- [ ] 首页能打开
- [ ] 专业页链接有效
- [ ] 课程页链接有效
- [ ] 刷题页能正常加载题目
- [ ] 答题后金币增加
- [ ] 朗读功能可用（浏览器支持）
- [ ] 无 emoji
- [ ] 移动端显示正常

---

## 9. 更新记录

- **2026-07-21**：创建本指南，记录链接检查、批量脚本、数据格式等规范。
