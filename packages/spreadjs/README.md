<h1 align="center" style="margin: 30px 0 35px;">Ele SpreadJS</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/@ele-cloud/spreadjs"><img alt="npm" src="https://img.shields.io/npm/v/@ele-cloud/spreadjs"></a>
</p>
🦑 **为大象慧云spreadjs打造功能性的封装，让前端只需专注业务开发，无需了解spreadjs繁琐的配置。**

#### **关于后编译**

由于 gcexcel 过大，并且引入了 vue, iview 使得整体体积超过 7mb, 如果此时 package 预先编译, 项目中继续引用并二次编译，会造成大量冗余代码，导致项目卡顿严重。所以我们将编译完全交由项目自身去处理。

# 准备工作

### 后编译

1. 后编译安装

```bash
npm install webpack-post-compile-plugin
```

2. webpack config file

```javascript
const PostCompilePlugin = require('webpack-post-compile-plugin');

module.exports = {
  // ...
  plugins: [
    new PostCompilePlugin()
  ]
}
```

3. package.json

```json
{
 "compileDependencies": ["@ele-cloud/spreadjs"],
}
```

### iview 按需引入

1. babel-plugin-import 安装

```bash
npm install babel-plugin-import -D
```

2. .babelrc

```javascript
plugin: [
  // ...
  ["import", {
    "libraryName": "iview",
    "libraryDirectory": "src/components"
  }]
]
```

# 安装

```bash
npm install @ele-cloud/spreadjs
```

Peer Dependencies:

```json
{
  "@grapecity/spread-excelio": "^13.0.7",
  "@grapecity/spread-sheets": "^13.0.7",
  "@grapecity/spread-sheets-print": "^13.0.7",
  "@grapecity/spread-sheets-resources-zh": "^13.0.7",
  "file-saver": "^2.0.2",
  "iview": "^3.5.4",
  "jquery": "^3.5.0",
  "pako": "^1.0.10",
  "vue": "^2.5.2"
}
```

# 快速应用

### 注入授权码

```javascript
import { injectLicenseKey } from '@ele-cloud/spreadjs';
injectLicenseKey('授权码xxx');
```

### 初始化

```javascript
import initSpread from '@ele-cloud/spreadjs';

const options = {
  // 右键菜单
  context: true,
  // 批注
  comment: true,
  // 工具箱
  toolkit: toolkitdom,
  // 异步加载公式
  async: true
}
const workbook = initSpread(exceldom, json, options);
```

### 导入导出excel

```javascript
import { excel } from '@ele-cloud/spreadjs';

/**
 * method 导入文件.
 * @param {String} type 需要的文件类型.
 * @param {Object} options 配置.
 * @return {String} return Promise.
 */
excel.importFunc('xlsx', { tagId: true, pako: true }).then(res => {
  console.log(res); // {json: ..., filename: ...}
}).catch(e => {
  console.error(e);
})

/**
 * method 导出文件.
 * @param {Object} data Spread json.
 * @param {Object} options 配置.
 * @return {String} return Promise { resolve file name }.
 */
excel.exportFunc(json, { filename: '自定义文件名称.xlsx', pako: true }).then((filename) => {})
```

### SpreadJS相关

```javascript
import { GC, Excel } from '@ele-cloud/spreadjs';
```
