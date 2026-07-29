# yunzhuan.icu 微信小程序版 (v56)

yunzhuan.icu 留学申请一站式平台的 **微信小程序** 实现，复用 v43 Web 版刷题引擎的核心逻辑，针对小程序运行环境做了适配。

## 📦 项目结构

```
miniprogram/
├── app.json              # 小程序全局配置（pages / window / tabBar）
├── app.js                # 全局入口（onLaunch / onShow / onError）
├── app.wxss              # 全局样式（黑白灰设计系统 + CSS 变量）
├── project.config.json   # 开发者工具项目配置
├── sitemap.json          # 微信索引规则
├── manifest.json         # 旧版兼容（保留以防工具链）
├── pages/
│   ├── index/            # 首页（科目列表 + 总览统计）
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── practice/         # 刷题页（题目展示 + 选项 + 解析 + 答题记录）
│   │   ├── practice.js
│   │   ├── practice.json
│   │   ├── practice.wxml
│   │   └── practice.wxss
│   └── dashboard/        # 仪表盘（科目统计 + 错题本 + 打卡）
│       ├── dashboard.js
│       ├── dashboard.json
│       ├── dashboard.wxml
│       └── dashboard.wxss
├── utils/
│   ├── api.js            # Storage（localStorage 适配）+ Api（fetch → wx.request）
│   ├── practice-engine.js# 答题引擎（v43 engine 核心逻辑移植）
│   └── syllabus-data.js  # 8 科考纲数据（v43 syllabus-data 精简）
├── images/               # tabBar 图标（需在微信开发者工具中替换为实际 png）
└── screenshot/           # 截图占位（README 演示用）
```

## 🔄 与 Web 版的关键差异

| Web (v43)               | 小程序 (v56)             | 说明                            |
|-------------------------|--------------------------|---------------------------------|
| `localStorage`          | `wx.getStorageSync` etc. | 封装在 `utils/api.js#Storage`  |
| `fetch()`               | `wx.request()`           | 封装在 `utils/api.js#Api.request` |
| `window` / `document`   | `Page()` / `App()`       | 无 DOM，全用数据驱动            |
| `<script src>`          | `require()`              | CommonJS 风格                   |
| `localStorage` key 命名 | 同 `yz_*`                | 跨端数据可迁移                  |

## 🚀 快速开始

### 1. 安装微信开发者工具

- 下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 选择 **稳定版 Stable Build**

### 2. 导入项目

1. 打开微信开发者工具
2. 选择 **导入项目**
3. 目录选择 `miniprogram/`
4. AppID 可使用 **测试号**（已默认填 `touristappid`）
5. 项目名称：`yunzhuan-miniprogram`

### 3. 真机调试

1. 点击工具栏 **真机调试** 按钮
2. 微信扫码，即可在手机上预览
3. 真机调试要求：
   - 微信版本 ≥ 7.0.9
   - 基础库版本 ≥ 2.10.0
   - 同一局域网（开发工具与手机）

### 4. 发布预览

1. 点击 **预览**，扫码生成临时预览码（有效期 30 分钟）
2. 体验版需在 **微信公众平台** 申请小程序并填写正式 AppID
3. 上传代码：点击 **上传** → 在公众平台 **版本管理** 中提交审核

## 🧩 复用 v43 Engine

`utils/practice-engine.js` 是 v43 Web 版 `js/practice-engine.js` 的核心逻辑移植：

- **Storage 抽象**：`Storage.get / set / remove` 抹平 Web/小程序的存储 API 差异
- **答题记录**：`recordAnswer(subject, qid, selected, correct, topic)` 记录每道题
- **统计聚合**：`getStats(subject)` 返回 `{ total, correct, wrong, accuracy, wrongIds }`
- **全局统计**：`getAllStats()` 一次性拉取所有科目统计

`utils/syllabus-data.js` 同样移植自 v43：

- 8 科：sat / act / ap / ib / alevel / toefl / ielts / igcse
- 每科按 Paper / Topic 双层结构
- 字段：`code / name / desc / papers[].code / papers[].name / topics[]`

### 数据互通

Web 版 localStorage 与小程序 wx.storage **Key 命名一致**（`yz_practice_data`、`yz_user`、`yz_locale`），方便后续在云端做用户数据 Sync。

## 🎨 设计系统

- 纯白底 `#ffffff` / 纯黑字 `#111111` / 中性灰 `#888888 / #cccccc / #e0e0e0`
- 字号：28rpx（正文）/ 32rpx（小标题）/ 44rpx（页面标题）
- 圆角：无（保持学术严谨感）
- 分割线：1rpx 实线
- CSS 变量在 `app.wxss` 顶部定义：`--yz-black / --yz-gray-1 / --yz-bg` 等

## 📱 截图占位

`screenshot/` 目录用于放置真实运行截图：

```
screenshot/
├── home.png          # 首页
├── practice.png      # 刷题页
└── dashboard.png     # 仪表盘
```

可使用微信开发者工具的 **截屏** 功能（Ctrl+Shift+A / Cmd+Shift+A）截取。

## 🐛 常见问题

### 1. `touristappid` 无法真机预览
- 在 **微信公众平台** 注册小程序获得正式 AppID
- 修改 `project.config.json` 中的 `appid` 字段
- 重新导入项目

### 2. tabBar 图标不显示
- `images/` 目录的 `home.png` 等文件需替换为真实 PNG（建议 81×81 像素）
- 暂未提供图标可临时把 `iconPath / selectedIconPath` 注释掉

### 3. 答题数据丢失
- 微信开发者工具默认清缓存：工具 → 清缓存 → 全部清除
- 生产环境数据建议同步到云端（参考 Web 版 `auth.js` 中的 `Supabase` 接入）

## 📜 版本

- v56.0.0（当前）— 初版发布 · 3 pages · 共用 v43 engine
- v43.0.0 — Web 版刷题引擎
- 后续可扩展：AI 辅导 / 写作批改 / 错题本 OCR / 听写语音评测

## 📄 许可

MIT — 与 yunzhuan.icu 主仓库一致
