# 轻清单 · Qinglist

一个离线优先的轻量任务、目标和每日习惯管理应用。

网页端使用原生 HTML / CSS / JavaScript，无框架、无构建步骤；Android 端由 Capacitor 7 打包，安装后完全离线可用。

[在线预览](https://kccqm.github.io/qinglist/) · [下载最新 APK](https://github.com/kccQM/qinglist/releases/latest)

![任务页](preview.png)

## 功能

### 任务

- 按日期查看待办，日期条支持横向滑动。
- 逾期任务单独展示，可单条或一键顺延到今天。
- 点击任务卡原地展开详情，长按右侧三点拖动排序。
- 支持子任务，子任务全部完成后自动完成母任务。
- 已完成任务可删除，删除前二次确认。
- 任务可归入自定义清单。

### 目标

- 按天 / 周 / 月创建目标，自动拆解并同步到任务清单。
- 支持每周目标和每日行动编辑。
- 目标卡片支持颜色修改，拆解页支持深色模式。
- 删除目标时同步处理关联任务。

### 每日习惯

- 独立「每日习惯」页，支持每天 / 每周重复。
- 可设置星期、结束日期，到期自动生成当天任务。
- 太阳图标随机使用清单五色，可点击修改颜色。
- 完成入口统一在任务清单，支持连续天数展示。

### 清单、搜索与统计

- 清单支持新建、改名、改色和删除；点击进入清单详情。
- 清单详情可查看任务和子任务，并批量删除。
- 全局搜索覆盖任务、目标、习惯和清单。
- 统计页展示日 / 周 / 目标完成度，今日进度圆环可直接跳转统计。

### 外观与数据

- 深色模式默认跟随系统，可手动切换或恢复跟随系统。
- 字体提供小紧凑 / 标准 / 特大三档。
- 数据保存在 `localStorage`，无需登录和服务器。
- 支持 JSON 导出 / 导入备份，导入兼容旧备份。
- 清空示例任务不会影响真实数据。

## 预览

| 任务 | 任务详情 |
| --- | --- |
| ![任务](preview.png) | ![任务详情](preview-taskdetail.png) |

| 创造 | 每日习惯 |
| --- | --- |
| ![创造](preview-create.png) | ![每日习惯](preview-habits.png) |

| 清单 | 统计 |
| --- | --- |
| ![清单](preview-lists.png) | ![统计](preview-stats.png) |

### 深色模式

![深色模式](preview-dark.png)

## 本地运行网页

```bash
python serve.py 8080
```

打开 `http://localhost:8080`。也可以使用任意静态文件服务器。

## 构建 Android APK

```bash
cd mobile
npm install
npm run cap:sync
npm run build:debug
```

发布构建需要先配置本地签名：

1. 复制 `mobile/android/keystore.properties.example` 为 `mobile/android/keystore.properties`。
2. 将 keystore 放到 `mobile/android/keystore/`。
3. 修改 `keystore.properties` 中的路径和密码。
4. 执行 `npm run build:release`。

生成文件：`mobile/android/app/build/outputs/apk/release/app-release.apk`。

`keystore.properties`、`*.jks` 和 `*.keystore` 已加入 `.gitignore`，不要提交。

## 数据与升级

- 数据只保存在本机浏览器或 WebView 的 `localStorage`。
- Android 覆盖安装不会清除应用数据。
- 卸载应用或清除应用数据会丢失本地数据，重要数据请先导出 JSON 备份。

## 技术栈

- HTML5 / CSS3 / 原生 JavaScript
- `localStorage`
- Capacitor 7
- Android SDK 35 / JDK 21

## 版本

当前版本：`1.12.9`。版本说明见 [CHANGELOG.md](CHANGELOG.md)。
