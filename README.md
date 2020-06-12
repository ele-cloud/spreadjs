<h1 align="center" style="margin: 30px 0 35px;">Ele SpreadJS</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/@ele-cloud/spreadjs"><img alt="npm" src="https://img.shields.io/npm/v/@ele-cloud/spreadjs"></a>
  <a href="https://travis-ci.com/ele-cloud/spreadjs.svg?branch=master"><img src="https://img.shields.io/travis/ele-cloud/spreadjs.svg" /></a>
  <a href='https://coveralls.io/github/ele-cloud/spreadjs?branch=v13.3.3-alpha.2'><img src='https://coveralls.io/repos/github/ele-cloud/spreadjs/badge.svg?branch=v13.3.3-alpha.2' alt='Coverage Status' /></a>
  <a href="https://www.npmjs.com/package/@ele-cloud/spreadjs"><img alt="npm" src="https://img.shields.io/npm/dm/@ele-cloud/spreadjs?color=orange"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" /></a>
</p>
🦑  为大象慧云spreadjs打造功能性的封装，让前端只需专注业务开发，无需了解spreadjs繁琐的配置。 

# 准备工作

## 1. 依赖引入

```html
<link rel="styleSheet" href="gc.spread.sheets.xx.x.x.css" />

<!-- spread core -->
<script src="gc.spread.sheets.all.xx.x.x.min.js" type="text/javascript"></script>
<!-- spread excel -->
<script src="gc.spread.excelio.xx.x.x.min.js" type="text/javascript"></script>
<!-- spread language -->
<script src="gc.spread.sheets.resources.zh.xx.x.x.min.js" type="text/javascript"></script>
<!-- spread print -->
<script src="gc.spread.sheets.print.xx.x.x.min.js" type="text/javascript"></script>
```

通过 cdn 引入，目前含有的版本为 `13.1.0`。

> cdn 域名：http://ele-cloud.90paw.com/

**实现方式：**

方案一：直接在 index.html 引入

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="styleSheet" href="//ele-cloud.90paw.com/gc.spread.sheets.excel2013white.13.1.0.css" />
  </head>
  <body>
  </body>
  <script typs='text/javascript' src='//ele-cloud.90paw.com/gc.spread.sheets.all.13.1.0.min.js'></script>
  <script typs='text/javascript' src='//ele-cloud.90paw.com/gc.spread.excelio.13.1.0.min.js'></script>
  <script typs='text/javascript' src='//ele-cloud.90paw.com/gc.spread.sheets.resources.zh.13.1.0.min.js'></script>
  <script typs='text/javascript' src='//ele-cloud.90paw.com/gc.spread.sheets.print.13.1.0.min.js'></script>
</html>
```

方案二：

1. 安装 html-webpack-externals-plugin

```bash
npm i html-webpack-externals-plugin -D
```

2. webpack config file

```javascript
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'spread-gc',
      entry: '//ele-cloud.90paw.com/gc.spread.sheets.all.13.1.0.min.js'
    }, {
      module: 'spread-excel',
      entry: '//ele-cloud.90paw.com/gc.spread.excelio.13.1.0.min.js',
    }, {
      module: 'spread-zh',
      entry: '//ele-cloud.90paw.com/gc.spread.sheets.resources.zh.13.1.0.min.js'
    }, {
      module: 'spread-print',
      entry: '//ele-cloud.90paw.com/gc.spread.sheets.print.13.1.0.min.js'
    }, {
      module: 'spread-excel2013white',
      entry: '//ele-cloud.90paw.com/gc.spread.sheets.excel2013white.13.1.0.css'
    }
  ]
})
```

## 2. 后编译

1. 安装 webpack-post-compile-plugin 

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

## iview 按需引入

1. 安装 babel-plugin-import 

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

## 4. 安装

```bash
npm install @ele-cloud/spreadjs
```

Peer Dependencies:

```json
{
  "file-saver": "^2.0.2",
  "iview": "^3.5.4",
  "jquery": "^3.5.0",
  "pako": "^1.0.10",
  "vue": "^2.5.2"
}
```

# 快速应用

## 注入授权码

```javascript
import { injectLicenseKey } from '@ele-cloud/spreadjs';
injectLicenseKey('授权码xxx');
```

## 初始化

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

## 导入导出excel

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

## SpreadJS相关

```javascript
import { GC, Excel } from '@ele-cloud/spreadjs';
```
