# iOS 占位目录 (v44 · Capacitor)

> 本目录由 `npx cap add ios` 自动生成，目前是占位说明。
> 真实构建需要 macOS + Xcode + Apple Developer 账号（$99/年）。

## 初始化步骤

```bash
# 1. 安装 Capacitor CLI（项目根目录，需 macOS）
npm install --save-dev @capacitor/cli @capacitor/core

# 2. 添加 iOS 平台
npx cap add ios

# 3. 同步资源
npx cap sync ios

# 4. 用 Xcode 打开 ios/ 目录
npx cap open ios
```

## 目录结构（生成后）

```
ios/
├── App/
│   ├── App.xcodeproj/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   ├── Assets.xcassets/
│   │   │   ├── AppIcon.appiconset/  # 应用图标
│   │   │   └── Splash.imageset/     # 启动图
│   │   └── public/                  # H5 静态资源
│   └── Podfile
└── capacitor.config.json
```

## 资源

- 应用图标：放在 `ios/App/Assets.xcassets/AppIcon.appiconset/`
  推荐 1024x1024（App Store 必需）
- 启动图：`ios/App/Assets.xcassets/Splash.imageset/`
- PrivacyInfo：`ios/App/PrivacyInfo.xcprivacy`

## 签名 & 打包

```bash
# 1. 在 Xcode 中：Signing & Capabilities → 选择 Team
# 2. Build Settings → Code Signing Identity → iOS Distribution
# 3. Product → Archive → Distribute App → App Store Connect
```

## 上架 App Store

1. 注册 Apple Developer Program（$99/年）
2. App Store Connect → 创建应用
3. 上传构建（通过 Xcode 或 Transporter）
4. 填写商店资料（截图、描述、关键词、Privacy）
5. 提交审核（通常 1-3 天，可能被拒绝需重新提交）

详细步骤见 `../docs/APP-SHELL.md`。
