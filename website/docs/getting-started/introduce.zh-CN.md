---
nav:
  title: 文档
  order: 1
title: 介绍
order: 1
---

# Rc-Grid 组件

Rc-Grid 是基于 React 和 styled-components 的组件库，主要企业级中后台产品中的表格。

## ✨ 特性

- 📦 开箱即用的高质量 React 组件, 并且默认支持虚拟滚动。
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。
- ⚙️ 组件功能丰富，支持固定列，可展开表格，表格树，拖拽列头，排序等等...


## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| last 2 versions | last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions

> 目前不支持 IE 的浏览器，如果需要兼容 IE 需要寻找对应的  polyfills， 这并不是一个简单的过程

## 与其他开源表格进行对比


|功能描述 | rc-grid | ag-grid | react-data-grid | ant design          | handsontable | 
|--------|-------- |-------  |---------        |------              |-----------   |
|固定左   | ✅     | ✅       | ✅              |✅                  | ✅
|右列     | ✅     | ✅       | ❌              |✅                  | ✅ 
|列可拖拽改变大小| ✅ | ✅      | ✅              |⚠️ 需要自定义列头     | ✅ 
|列头合并   | ✅     | ✅      | ❌              | ✅                 | ✅
|虚拟滚动   | ✅     | ✅      | ✅              |⚠️ 需要重写渲染       | ✅
|单元格编辑 | ✅     | ✅       | ✅              | ⚠️ 需要重写cell     | ✅
|可展开表格 | ✅     | ✅       | ✅              | ✅                 | ❌
|树形表格   | ✅     | ✅       | ✅              | ✅                 | ❌
|开源协议   | MIT    | MIT      | MIT             | MIT                | 商业

> 注明: 此数据仅供参照，组件库可能是随着更新，而添加新的功能

## 安装

### 使用 npm 或 yarn 安装

我们推荐使用 npm 或 yarn 的方式进行开发，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```
npm install rc-grid --save
```

```
yarn add rc-grid
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm) 。

### 浏览器引入

如果要在浏览器中引入 rc-grid 需要自己用 `webpack` 编译对应的文件，然后使用全局变量即可

### 社区互助

如果您在使用的过程中碰到问题，可以通过下面几个途径寻求帮助，同时我们也鼓励资深用户通过下面的途径给新人提供帮助。

- [GitHub Discussions](https://github.com/HighPerformanceComponent/rc-grid/discussions)
