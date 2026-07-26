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

## 8. 完整架构设计文档（Supabase + 注册登录 + 云同步）

> 2026-07-21 新增
> 目标：实现邮箱/手机号 + 密码注册登录，实时同步答题数据，为后续勋章/任务/排行榜等功能铺路。

### 8.1 技术选型说明

#### 为什么选 Supabase

| 能力 | Supabase | 自己实现（Express + DB） | Firebase |
|------|----------|--------------------------|----------|
| 邮箱/手机号认证 | 内置，无需开发 | 需自己写加密、验证、找回 | 内置 |
| 数据库 | PostgreSQL（关系型） | 自己选型 | NoSQL（Firestore） |
| 实时推送 | 内置 Realtime 订阅 | 需 WebSocket | 内置 |
| API 生成 | 自动 REST + RPC | 全部手写 | 自动 |
| 成本 | 免费额度 500MB DB | 服务器费用 | 按读取次数计费 |
| 部署 | 托管/自托管 | 自己运维 | 托管 |

**结论**：用 Supabase 最省事，注册登录、数据库、API 全部现成，前端只管调用。

### 8.2 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端（yunzhuan.icu）                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  index   │  │ profile  │  │  quiz    │  │  ...   │  │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └────┬───┘  │
│        │             │              │            │       │
│        └─────────────┴──────┬───────┴────────────┘       │
│                             │                            │
│                    ┌────────▼────────┐                   │
│                    │  js/auth.js     │ 注册/登录         │
│                    │  js/user.js     │ Storage + 金币   │
│                    │  js/sync.js     │ 云同步（新）     │
│                    └────────┬────────┘                   │
└─────────────────────────────┼───────────────────────────┘
                              │ HTTPS
                    ┌─────────▼─────────┐
                    │   Supabase        │
                    │  ┌────────────┐   │
                    │  │   Auth     │ ← 邮箱/手机号+密码  │
                    │  ├────────────┤   │
                    │  │ PostgreSQL │ ← users, answers... │
                    │  ├────────────┤   │
                    │  │ Realtime   │ ← 实时同步订阅     │
                    │  └────────────┘   │
                    └───────────────────┘
```

### 8.3 数据模型（PostgreSQL Schema - 占坑模式）

> 2026-07-21 定稿：纯走 slots + SECURITY DEFINER 存储过程，不依赖 Supabase Auth / auth.users

```sql
create extension if not exists pgcrypto;

-- 1) slots：云端账号（用户名=手机号）。slot_secret 是不可猜测的随机串，保护读写
create table if not exists public.slots (
  slot_id    uuid primary key default gen_random_uuid(),
  slot_secret uuid not null default gen_random_uuid(),
  phone      text,
  pin_hash   text,                      -- 可选：crypt() 哈希；空 = 无 PIN（仅靠手机号）
  created_at timestamptz not null default now(),
  unique (phone)
);

-- 2) kv_slot：进度/错题（按 slot_id 归属）
create table if not exists public.kv_slot (
  slot_id    uuid not null references public.slots(slot_id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (slot_id, key)
);

-- ---------- RLS ----------
alter table public.slots enable row level security;
alter table public.kv_slot enable row level security;
-- 不给 anon/authenticated 任何直接 policy；全部走下面的 SECURITY DEFINER 过程

-- ---------- 存储过程 ----------

-- 注册占坑：手机号已存在 → 返回 conflict（前端弹"该手机号已注册"）
create or replace function public.create_slot(p_phone text, p_pin text default null)
returns table(slot_id uuid, slot_secret uuid, conflict boolean)
language plpgsql security definer as $$
begin
  if exists (select 1 from public.slots s where s.phone = p_phone) then
    slot_id := null; slot_secret := null; conflict := true; return next; return;
  end if;
  insert into public.slots (phone, pin_hash)
    values (p_phone, case when p_pin is null or p_pin = '' then null
                          else crypt(p_pin, gen_salt('bf')) end)
    returning slots.slot_id, slots.slot_secret into slot_id, slot_secret;
  conflict := false; return next;
end;
$$;

-- 登录：手机号 + 可选 PIN，校验后返回凭证
create or replace function public.login_slot(p_phone text, p_pin text default null)
returns table(slot_id uuid, slot_secret uuid, bad_pin boolean, not_found boolean)
language plpgsql security definer as $$
declare v_pin text;
begin
  select s.slot_id, s.slot_secret, s.pin_hash
    into slot_id, slot_secret, v_pin
    from public.slots s where s.phone = p_phone;
  if not found then not_found := true; bad_pin := false; return next; return; end if;
  if v_pin is not null then
    if crypt(p_pin, v_pin) = v_pin then bad_pin := false;
    else bad_pin := true; slot_id := null; slot_secret := null; end if;
  else
    bad_pin := false;
  end if;
  not_found := false; return next;
end;
$$;

-- 占坑期写入（校验 slot_secret）
create or replace function public.kv_slot_set(p_slot_id uuid, p_slot_secret uuid, p_key text, p_value jsonb)
returns void language plpgsql security definer as $$
begin
  if not exists (select 1 from public.slots s where s.slot_id = p_slot_id and s.slot_secret = p_slot_secret) then
    raise exception 'invalid slot';
  end if;
  insert into public.kv_slot (slot_id, key, value) values (p_slot_id, p_key, p_value)
    on conflict (slot_id, key) do update set value = excluded.value, updated_at = now();
end;
$$;

-- 占坑期读取（校验 slot_secret）
create or replace function public.kv_slot_get(p_slot_id uuid, p_slot_secret uuid)
returns setof public.kv_slot language plpgsql security definer as $$
begin
  if not exists (select 1 from public.slots s where s.slot_id = p_slot_id and s.slot_secret = p_slot_secret) then
    raise exception 'invalid slot';
  end if;
  return query select * from public.kv_slot k where k.slot_id = p_slot_id;
end;
$$;

-- 占坑期删除（校验 slot_secret）
create or replace function public.kv_slot_del(p_slot_id uuid, p_slot_secret uuid, p_key text)
returns void language plpgsql security definer as $$
begin
  if not exists (select 1 from public.slots s where s.slot_id = p_slot_id and s.slot_secret = p_slot_secret) then
    raise exception 'invalid slot';
  end if;
  delete from public.kv_slot k where k.slot_id = p_slot_id and k.key = p_key;
end;
$$;

-- 授权 anon / authenticated 调用这些过程
grant execute on function public.create_slot(text, text) to anon, authenticated;
grant execute on function public.login_slot(text, text) to anon, authenticated;
grant execute on function public.kv_slot_set(uuid, uuid, text, jsonb) to anon, authenticated;
grant execute on function public.kv_slot_get(uuid, uuid) to anon, authenticated;
grant execute on function public.kv_slot_del(uuid, uuid, text) to anon, authenticated;
```

#### 设计要点

| 要点 | 说明 |
|------|------|
| 手机号 = 用户名 | 不验证，简单直接 |
| 可选 PIN | 空 PIN 时仅靠手机号登录 |
| 注册冲突处理 | `create_slot` 返回 `conflict` 标志，前端提示 |
| 权限控制 | 全部走 SECURITY DEFINER 存储过程，不依赖 Supabase Auth |
| slot_secret | 随机 UUID，读写时校验，相当于 API token |

#### KV 存储规范

前端通过 `kv_slot_set/get/del` 操作数据，key 约定：

| key | 说明 | 数据格式 |
|-----|------|---------|
| `user_data` | 用户档案（金币、等级、答题统计等） | JSON |
| `course_progress` | 课程进度 | JSON |
| `badges` | 勋章列表 | JSON |
| `tasks` | 任务状态 | JSON |

### 8.4 认证流程

#### 注册

```
用户输入邮箱/手机号 + 密码
        │
        ▼
supabase.auth.signUp({ email, password })
        │
        ├─ 成功 → Supabase 发验证邮件/短信
        │         → 用户点击链接/输入验证码
        │         → 前端收到 session
        │         → 触发 onAuthStateChange 监听
        │         → 创建 profiles 记录
        │
        └─ 失败 → 提示错误（邮箱已存在、密码太弱等）
```

#### 登录

```
用户输入邮箱/手机号 + 密码
        │
        ▼
supabase.auth.signInWithPassword({ email, password })
        │
        ├─ 成功 → 保存 session 到 localStorage
        │         → 从云端拉取 profiles 数据
        │         → 合并本地 localStorage 数据（首次登录）
        │         → 进入应用
        │
        └─ 失败 → 提示错误
```

#### 登出

```
supabase.auth.signOut()
        │
        ▼
清除 localStorage 中的 session
        │
        ▼
保留 localStorage 中的离线数据（可选清理）
```

### 8.5 实时同步策略

#### 同步触发点

| 事件 | 同步内容 | 频率 |
|------|---------|------|
| 注册/登录首次成功 | 全量拉取 profiles + course_progress | 1 次 |
| 答完一题 | 上报 answers 表 + 更新 profiles 累计字段 | 每次 |
| 刷题会话结束 | 更新 max_streak, total_sessions | 每次 |
| 页面加载（已登录） | 拉取最新 profiles（防止多设备不一致） | 每次 |
| 离线后恢复在线 | 批量上报暂存队列 | 恢复时 |

#### 同步实现（新文件 `js/sync.js`）

```javascript
const Sync = {
  // 待上报队列（离线时暂存）
  pendingQueue: [],
  
  // 上报单次答题
  async reportAnswer(courseId, questionId, isCorrect) {
    if (!Auth.isLoggedIn()) {
      // 未登录：仅本地存储
      return;
    }
    
    try {
      const user = Auth.getUser();
      
      // 1. 插入答题明细
      await supabase.from('answers').insert({
        user_id: user.id,
        course_id: courseId,
        question_id: questionId,
        is_correct: isCorrect
      });
      
      // 2. 更新 profiles 累计
      await supabase.rpc('update_user_stats', {
        p_user_id: user.id,
        p_is_correct: isCorrect
      });
      
      // 3. 更新课程进度
      await supabase.rpc('update_course_progress', {
        p_user_id: user.id,
        p_course_id: courseId,
        p_is_correct: isCorrect
      });
      
      // 4. 检查勋章触发
      await this.checkBadges();
      
    } catch (e) {
      // 网络失败：加入待上报队列
      this.pendingQueue.push({ courseId, questionId, isCorrect, at: Date.now() });
      console.warn('Sync failed, queued:', e);
    }
  },
  
  // 恢复在线时批量上报
  async flushQueue() {
    if (this.pendingQueue.length === 0) return;
    
    for (const item of this.pendingQueue) {
      await this.reportAnswer(item.courseId, item.questionId, item.isCorrect);
    }
    this.pendingQueue = [];
  },
  
  // 检查勋章
  async checkBadges() {
    // 调用 RPC 检查并发放勋章
  }
};
```

### 8.6 前端文件规划

#### 新增文件

| 文件 | 职责 |
|------|------|
| `js/auth.js` | 注册/登录/登出、session 管理 |
| `js/sync.js` | 实时同步、离线队列、勋章检查 |
| `login.html` | 登录/注册页面 |
| `forgot-password.html` | 找回密码页面 |

#### 修改文件

| 文件 | 修改内容 |
|------|---------|
| `js/user.js` | 接入 Supabase 客户端，区分登录/未登录 |
| `profile.html` | 增加登录入口、显示用户信息 |
| `quiz/index.html` | 答题后调用 Sync.reportAnswer |
| 所有页面 | 顶部金币栏根据登录状态显示不同内容 |

### 8.7 关键 RPC 函数（PostgreSQL）

```sql
-- 更新用户累计统计
CREATE OR REPLACE FUNCTION update_user_stats(
  p_user_id UUID,
  p_is_correct BOOLEAN
) RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    total_answered = total_answered + 1,
    total_correct = total_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    coin = coin + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    level = FLOOR(coin / 100) + 1,
    last_active_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 更新课程进度
CREATE OR REPLACE FUNCTION update_course_progress(
  p_user_id UUID,
  p_course_id TEXT,
  p_is_correct BOOLEAN
) RETURNS void AS $$
BEGIN
  INSERT INTO course_progress (user_id, course_id, answered, correct, last_practiced_at)
  VALUES (p_user_id, p_course_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, now())
  ON CONFLICT (user_id, course_id) DO UPDATE SET
    answered = course_progress.answered + 1,
    correct = course_progress.correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    last_practiced_at = now();
END;
$$ LANGUAGE plpgsql;
```

### 8.8 安全设计

| 风险 | 措施 |
|------|------|
| SQL 注入 | Supabase 自动处理，使用参数化查询 |
| XSS | Supabase 自动转义，密码字段不渲染 |
| 密码泄露 | 密码只在传输到 Supabase 时使用，不落库 |
| 越权访问 | Row Level Security (RLS)：用户只能读写自己的数据 |
| 刷接口 | Supabase 内置 rate limit + RLS 双重防护 |
| CSRF | Supabase 使用 JWT，无需 CSRF token |

#### RLS 策略示例

```sql
-- 用户只能读取自己的 profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 用户只能更新自己的 profiles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 排行榜公开可读
CREATE POLICY "Leaderboard is public" ON profiles
  FOR SELECT USING (true);
```

### 8.9 数据迁移方案

#### 现有匿名用户升级

```
1. 用户首次访问登录页，看到提示：
   "已有本地数据？登录后自动同步到云端"

2. 用户登录成功：
   - 读取 localStorage 中的 prereq_user_v1
   - 调用 supabase.from('profiles').upsert(本地数据)
   - 标记 localStorage 为已迁移（防止重复迁移）
   
3. 之后所有操作走云端，本地仅作缓存
```

### 8.10 分阶段实施计划

#### 阶段 1：后端准备（不涉及前端改动）

- [ ] 注册 Supabase 项目
- [ ] 创建数据表（profiles, course_progress, answers, badges）
- [ ] 创建 RPC 函数（update_user_stats, update_course_progress）
- [ ] 配置 RLS 策略
- [ ] 配置邮箱 SMTP（用于验证邮件）
- [ ] 配置 Realtime 订阅

#### 阶段 2：前端认证

- [ ] 创建 `js/auth.js`（封装 supabase.auth）
- [ ] 创建 `login.html`（注册/登录表单）
- [ ] 创建 `forgot-password.html`
- [ ] 接入 session 状态监听

#### 阶段 3：数据同步

- [ ] 创建 `js/sync.js`
- [ ] quiz 页面接入 Sync.reportAnswer
- [ ] 实现离线队列
- [ ] 实现首次登录数据迁移

#### 阶段 4：档案页升级

- [ ] profile.html 显示登录状态
- [ ] 显示云端数据（与本地对比）
- [ ] 添加登出按钮
- [ ] 添加多设备同步提示

#### 阶段 5：勋章/任务（后续）

- [ ] 勋章触发逻辑
- [ ] 任务系统
- [ ] 排行榜页面

### 8.11 成本估算

| 项目 | 免费额度 | 超出后 |
|------|---------|--------|
| 数据库 | 500 MB | $0.125/GB/月 |
| 认证用户 | 50,000 MAU | $0.00325/MAU |
| 实时连接 | 200 并发 | $10/100 并发 |
| API 请求 | 5M/月 | $0.0001/次 |

**预计**：用户量 < 1 万时基本免费。

### 8.12 风险与备选

| 风险 | 备选方案 |
|------|---------|
| Supabase 倒闭/涨价 | 数据可一键导出 PostgreSQL dump，迁回自建 |
| 国内访问慢 | 用 Cloudflare CDN 代理，或自托管在国内服务器 |
| 实名认证要求 | 接入第三方短信网关（阿里云、腾讯云） |

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
