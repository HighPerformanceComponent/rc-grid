# rc-grid 表格组件

![type-badge](https://img.shields.io/npm/types/react-data-grid)
![eslint](https://github.com/HighPerformanceComponent/rc-grid/actions/workflows/eslint.yml/badge.svg)

![working](./.resources/images/working.gif)

高性能的 React 表格组件, 在不丢失表格的强大功能的情况下，并且保持高性能

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| last 2 versions | last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions


## 功能对比


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

## 关于里程碑

保持每个月月底完成一次里程碑的开发,并且发布到 npm 仓库中， 我们所有的开发全部托管在 github 上进行开发
