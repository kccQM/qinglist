# 轻清单 Android 工程

这是「轻清单」的 Capacitor 7 Android 包装工程。网页源码位于仓库根目录，构建时会复制到 `www/`，再打包进 APK，安装后完全离线可用。

## 环境要求

- Node.js 20+
- JDK 21
- Android SDK Platform 35 / Build Tools 35
- 一个本地 Android keystore（仅发布签名时需要）

## 安装依赖

```bash
npm install
```

## 同步网页资源

```bash
npm run cap:sync
```

脚本会把仓库根目录的 `index.html`、`styles.css`、`app.js` 复制到 `www/`，然后执行 Capacitor sync。

## 调试构建

```bash
npm run build:debug
```

生成：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## 发布构建

签名信息不进入仓库。先准备：

```text
mobile/android/keystore.properties
mobile/android/keystore/qinglist-release.jks
```

可参考：

```text
mobile/android/keystore.properties.example
```

然后：

```bash
npm run build:release
```

生成：

```text
android/app/build/outputs/apk/release/app-release.apk
```

## 签名与安全

- 不要提交 `keystore.properties`、`*.jks` 或 `*.keystore`。
- 如果 APK 要公开发布，请在 GitHub Releases 上传，不要提交到源码仓库。
- 应用数据保存在本机 `localStorage`；升级安装不会清除数据。

## 目录说明

```text
mobile/
  assets/                 # 图标和启动图源文件
  scripts/
    generate-assets.py    # 生成 Android 图标资源
    sync-web.js           # 从仓库根目录复制网页资源
    android/              # Android 原生工程
```

版本：`1.12.9`
