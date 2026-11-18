# 星梦 CTX（sd_ctx）

[简体中文](README.md) | [English](README.en.md)

一个 Manifest V3 浏览器插件。工具栏弹窗在 [`popup/`](popup/)，后台服务入口为 [`background.js`](background.js)，页面脚本为 [`content.js`](content.js)。

## 权限
[清单](manifest.json)声明了标签页、脚本、Cookie、存储和全部网址的访问权限。请先审阅源码和权限，再决定是否在浏览器配置中启用。
