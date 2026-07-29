# 移动 APP 壳搭建指南 (v44 · Capacitor)

> 本文详细说明如何把 `/workspace` 的 H5 站点，通过 [Capacitor](https://capacitorjs.com/) 打包成 **Android** 和 **iOS** 原生 APP。
> 涉及：构建命令、icon 资源、签名、上架 Google Play / App Store。

## 1. 为什么选 Capacitor

| 框架          | 优势                           | 劣势                       |
|---------------|--------------------------------|----------------------------|
| **Capacitor** | 现代 / TS 原生 / 插件丰富      | 需 macOS 编译 iOS          |
| Cordova       | 老牌 / 插件多                  | 维护慢 / API 设计陈旧      |
| React Native  | 真正的原生                     | 不能直接复用 H5 代码       |
| Flutter       | 性能最强                       | 不能直接复用 H5 代码       |

本项目已有 H5 站点 + 微信小程序（v43），Capacitor 是成本最低的方案。

## 2. 一次性环境准备

```bash
# 全局安装 Capacitor CLI
npm install -g @capacitor/cli

# 或项目本地
npm install --save-dev @capacitor/cli @capacitor/core
```

- **Android**：安装 [Android Studio](https://developer.android.com/studio)
  - SDK Platform 33+、Build-Tools 33+、Android 13 (Tiramisu) Image
- **iOS**（仅 macOS）：安装 Xcode 15+ + Command Line Tools
  - `xcode-select --install`
  - `sudo xcodebuild -license accept`
  - 安装 CocoaPods：`sudo gem install cocoapods`

## 3. 初始化 Capacitor

```bash
cd /workspace

# 3.1 把 H5 资源拷贝到 dist/（或直接使用 webDir 指向根目录）
# 本项目 webDir: "." 已在 capacitor.config.json 配置

# 3.2 安装核心依赖
npm install --save @capacitor/core @capacitor/android @capacitor/ios

# 3.3 添加平台
npx cap add android
npx cap add ios

# 3.4 同步（每次 H5 改动后执行）
npx cap sync

# 3.5 打开 IDE
npx cap open android   # → Android Studio
npx cap open ios       # → Xcode（仅 macOS）
```

## 4. 应用图标 (icon)

### 4.1 Android

把 PNG 放到以下 5 个目录（每张图分别是 48/72/96/144/192 px）：

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png         (48x48)
├── mipmap-hdpi/ic_launcher.png         (72x72)
├── mipmap-xhdpi/ic_launcher.png        (96x96)
├── mipmap-xxhdpi/ic_launcher.png       (144x144)
└── mipmap-xxxhdpi/ic_launcher.png      (192x192)
```

推荐使用 https://easyappicons.com/ 一键生成全套。

### 4.2 iOS

把 `icon-1024.png`（1024x1024）放入：
```
ios/App/Assets.xcassets/AppIcon.appiconset/
```
然后在 `Contents.json` 中声明所有尺寸。

Xcode 14+ 支持「Single Size Icon」：只要一张 1024 即可。

## 5. 启动图 (Splash)

### 5.1 用 Capacitor Splash Screen 插件

```bash
npm install @capacitor/splash-screen
npx cap sync
```

`capacitor.config.json` 已配置：
```json
"SplashScreen": {
  "launchShowDuration": 1500,
  "backgroundColor": "#ffffff"
}
```

### 5.2 自定义启动图

- Android：`android/app/src/main/res/drawable/splash.png`（推荐 1242x2208）
- iOS：`ios/App/Assets.xcassets/Splash.imageset/`

## 6. 签名 (Signing)

### 6.1 Android · 生成 keystore

```bash
keytool -genkey -v \
  -keystore ~/keys/yunzhuan-release.keystore \
  -alias yunzhuan \
  -keyalg RSA -keysize 2048 -validity 10000
```

把 keystore 放到 `android/app/yunzhuan-release.keystore`，**千万不要提交到 git**！

在 `~/.gradle/gradle.properties` 中写入：
```
YUNZHUAN_RELEASE_STORE_FILE=yunzhuan-release.keystore
YUNZHUAN_RELEASE_KEY_ALIAS=yunzhuan
YUNZHUAN_RELEASE_STORE_PASSWORD=********
YUNZHUAN_RELEASE_KEY_PASSWORD=********
```

修改 `android/app/build.gradle`：
```gradle
android {
  signingConfigs {
    release {
      if (project.hasProperty('YUNZHUAN_RELEASE_STORE_FILE')) {
        storeFile file(YUNZHUAN_RELEASE_STORE_FILE)
        storePassword YUNZHUAN_RELEASE_STORE_PASSWORD
        keyAlias YUNZHUAN_RELEASE_KEY_ALIAS
        keyPassword YUNZHUAN_RELEASE_KEY_PASSWORD
      }
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### 6.2 iOS · 使用 Xcode 自动签名

1. Xcode → Signing & Capabilities
2. Team：选择你的 Apple Developer Team
3. Bundle Identifier：`icu.yunzhuan.app`（需在 App Store Connect 提前注册）
4. Provisioning Profile：自动生成

## 7. 构建产物

### 7.1 Android

```bash
cd android
./gradlew assembleRelease         # → APK
./gradlew bundleRelease           # → AAB（Google Play 强制）
# 产物位置：
#   app/build/outputs/apk/release/app-release.apk
#   app/build/outputs/bundle/release/app-release.aab
```

### 7.2 iOS

1. Xcode → Product → Archive
2. 等待归档完成（弹出 Organizer 窗口）
3. Distribute App → App Store Connect → Upload

或命令行：
```bash
cd ios/App
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive archive
```

## 8. 商店上架

### 8.1 Google Play

1. 注册 Google Play Console（一次性 $25）
2. 创建应用 → 填写应用信息
3. 上传 AAB（必须）+ Signing key（首次上传需用 Play App Signing）
4. 商店资料：
   - 标题 / 简短描述 / 完整描述（中英文）
   - 应用图标（512x512）
   - 截图（至少 2 张，每张 320-3840 px）
   - 特性图（1024x500）
5. 内容分级（IARC 问卷）
6. 目标受众与内容
7. 数据安全表单（是否收集数据、是否加密）
8. 提交审核（1-3 天）

### 8.2 Apple App Store

1. 注册 Apple Developer Program（$99/年）
2. App Store Connect → 我的 App → 创建新应用
3. 上传构建（通过 Xcode / Transporter）
4. 商店资料：
   - 名称 / 副标题 / 类别 / 关键词
   - 隐私政策 URL
   - 截图（6.5" / 5.5" / 12.9" iPad 至少各一组）
   - 应用图标（1024x1024，无 alpha）
5. 隐私标签（Privacy Nutrition Labels）
6. 提交审核（1-3 天）
7. **被拒常见原因**：
   - 4.0 设计抄袭 / 4.2 最低功能 / 5.1.1 隐私
   - 解决方法：补 demo 视频 + 隐私政策链接

## 9. 持续集成（CI）

### GitHub Actions 示例

```yaml
name: Build APP
on:
  push:
    tags: ['v*']

jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - run: npm ci
      - run: npx cap sync android
      - run: cd android && ./gradlew bundleRelease
        env:
          YUNZHUAN_RELEASE_STORE_FILE: ${{ secrets.KEYSTORE }}
          YUNZHUAN_RELEASE_STORE_PASSWORD: ${{ secrets.STORE_PWD }}
          YUNZHUAN_RELEASE_KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          YUNZHUAN_RELEASE_KEY_PASSWORD: ${{ secrets.KEY_PWD }}
      - uses: actions/upload-artifact@v4
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

## 10. 常见问题

**Q: 启动后白屏？**
A: 检查 `capacitor.config.json` 的 `server.url` 是否能访问；本地调试可改为 `server.androidScheme="http"` + `server.url="http://10.0.2.2:8080"`。

**Q: iOS 13+ `WKWebView` 跨域问题？**
A: 配置 `iosScheme: "https"`（已默认）+ 在 `Info.plist` 中加
`WKAppBoundDomains` 白名单。

**Q: 推送通知收不到？**
A: 集成 `@capacitor/push-notifications` 插件 + Firebase (Android) / APNs (iOS)，
并参考 `js/notifications.js` 业务封装。

**Q: 体积太大？**
A: 启用 ProGuard / R8（Android）+ Bitcode（iOS 14+ 已废弃）。
启用后体积通常减少 30%-50%。

## 11. 相关文件

- `/workspace/capacitor.config.json` —— Capacitor 主配置
- `/workspace/android/README.md` —— Android 占位说明
- `/workspace/ios/README.md` —— iOS 占位说明
- `/workspace/miniprogram/` —— 微信小程序（v43）
- `/workspace/js/notifications.js` —— 推送通知（v45）

## 12. 版本

- **v44.0.0** · 2026-07-29 · 移动 APP 壳 · Capacitor 6.x
