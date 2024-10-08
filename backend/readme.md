## package.json 中的 dependencies 與 devDependencies 分別是什麼?

官方資料：[dependencies and devDependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file) 。

差別就是「只」需要在開發或測試使用的套件就應該被分類為devDependencies，比如：方便開發用的nodemon、用於跑測試的jest、prettier的好夥伴husky等等。
```bash
$ npm i --save-dev ...
```
> [!NOTE]
> 那區分目的勒？
> * 可以減少生產環境不必要的負擔，節省空間。
> * 有些本地方便用的套件上了生產環境後甚至可能會出錯，所以分類隔離很重要


## package.json 中的 scripts 這個區塊怎麼用？

scripts區塊用於自定義可以透過npm run ...來執行的腳本指令，可以很大程度的方便開發協作。

要讓整個應用運作起可能涵蓋了部署、啟動等等的行為，而在scripts自定義好這些指令後，一坨指令就可以省略！
- start,test 字眼可以直接npm 接，不需要run


## Port number 要怎麼以環境變數來設定？

要取得NodeJS runtime的環境變數，要透過**process.env**.xxx，但是大部分我們在開發的時候，應用程式需要用到的env我們都會用一個.env file去存取，所以要讓NodeJS runtime能取得開發者想要到env必須要有個橋樑，那最常見的方式就是透過「dotenv」套件，他會將我們指定的.env file中的環境變數注入到NodeJS process.env中。

可以透過以下小實驗看出dotenv注入前後差別
```js
console.log('All Environment Variables:', process.env);
require('dotenv').config();
console.log('All Environment Variables:', process.env);
```

> [!NOTE]
> 其他注入env的場景：
> * Dockerfile 中的 ENV 參數、Docker compose 中的 environment / env_file屬性都是直接將變數注入到 process.env 中，所不需要使用 dotenv 套件
> * 一些好用的第三方管理env工具也都是直接注入進環境中，也不需要使用 dotenv 套件，比如：infisical(我覺得真滴方便)



## 哪些檔案應該要被放上 github repo 哪些不?

關鍵考量點我認為是三種：
- 安全性：
        - 放上Github Repo === 完全公開，除非這個repo是private。
- 多不多餘：
        - 應該要排除可以「重建」的檔案，避免 Repo 肥大。比如：node_modules
- 團隊協作：
        - 開發偏好每個人都不同，所以開發偏好設定的檔案不應該被放上 Repo（會被同事罵xd，比如：.vscode/


## 範例程式中用 require，但上週的 Stack 是用 import/export，這兩種分別是 JavaScript 引用模組的兩種方式: CJS vs ESM，這兩者分別怎麼用？

要使用EJS，第一件事就是在package.json 中加入 `{ "type": "module" }`（這樣做後全部的檔案都會套用 ESModules），但如果其中幾個想要用CJS的話，其實就把檔名改成.cjs就可以了(Override的概念)

除了一些內建函式、新語法的差別 比如：__dirname,展開符號... 之外，用法上最主要的差別（最容易搞混的地方）就是：**引入、導出模組的差別**

### CJS

特色：
- 同步加載、動態加載模組
        - 同步加載：要等到模組加載完成才能執行程式碼（會阻塞），但是會有快取提升效能
        - 動態加載：在運行時（runtime）根據需要動態地加載模組
- 使用 require 和 module.exports 來引入和導出模組

最基本的使用方式：
```js
const pkg = require('...');
```

CJS卻要引入ESM套件時，需要透過dynamic import（包成promise），缺點就是需要把function 改成 async function
```js
//...cjs
async function () {
  const pkg = await import('...');
  
  // ...
};
```

### EJS

特色：
- 異步加載、靜態加載模組
- 使用 import 和 export 來引入和導出模組

最基本的使用方式：
```js
import pkg from '...';
```

ESM卻要引入CJS套件時，兩種方式：
- 直接 import CJS 套件（前提是要用default import 的方式），若非常清楚要用套件的模組名稱，用named imports 才不會錯
```js
import pkg from '...';

//named import
import { func } from 'pkg-commonjs';
```
- 用內建的createRequire 建立一個 require 函式，再去引入CJS套件
```js
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const pkg = require('pkg-commonjs');
```


## Ref
- [Dcard工程師談](https://medium.com/dcardlab/一篇文搞清楚-node-js-模組行為-自由運用-commonjs-與-esm-模組-5f1e393276ba)
- 