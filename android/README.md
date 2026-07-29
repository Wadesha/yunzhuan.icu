# Android 占位目录 (v44 · Capacitor)

> 本目录由 `npx cap add android` 自动生成，目前是占位说明。
> 真实构建前，请先安装 Capacitor CLI 并初始化项目。

## 初始化步骤

```bash
# 1. 安装 Capacitor CLI（项目根目录）
npm install --save-dev @capacitor/cli @capacitor/core

# 2. 添加 Android 平台
npx cap add android

# 3. 同步资源（H5 build 输出 → android/app/src/main/assets/public）
npx cap sync android

# 4. 用 Android Studio 打开 android/ 目录
npx cap open android
```

## 目录结构（生成后）

```
android/
├── app/
│   ├── build.gradle
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── assets/
│   │   │   ├── capacitor.config.json
│   │   │   └── public/         # H5 站点静态资源
│   │   ├── java/icu/yunzhuan/app/
│   │   │   └── MainActivity.java
│   │   └── res/
│   │       ├── values/strings.xml
│   │       ├── mipmap-*/        # 应用图标
│   │       └── values/styles.xml
│   └── capacitor.build.gradle
├── build.gradle
├── gradle.properties
├── settings.gradle
├── variables.gradle
└── capacitor.settings.gradle
```

## 资源

- 应用图标：放在 `android/app/src/main/res/mipmap-*/ic_launcher.png`
  推荐 192x192 / 512x512
- 启动图：`android/app/src/main/res/drawable/splash.png`
- 推送图标：`android/app/src/main/res/drawable/ic_stat_icon.png`（白色透明）

## 签名

```bash
# 生成 keystore（仅首次）
keytool -genkey -v -keystore yunzhuan-release.keystore \
  -alias yunzhuan -keyalg RSA -keysize 2048 -validity 10000

# 在 android/app/build.gradle 中配置 signingConfigs
# 然后执行：
cd android && ./gradlew assembleRelease
# 产物：app/build/outputs/apk/release/app-release.apk
```

## 上架 Google Play

1. 注册 Google Play Console（一次性 $25）
2. 创建应用 → 填写应用信息
3. 上传 AAB（推荐）/ APK：
   ```bash
   cd android && ./gradlew bundleRelease
   # 产物：app/build/outputs/bundle/release/app-release.aab
   ```
4. 填写商店资料（截图、描述、分类）
5. 内容分级问卷（IARC）
6. 提交审核（通常 1-3 天）

详细步骤见 `../docs/APP-SHELL.md`。
