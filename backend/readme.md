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

scripts區塊用於自定義可以透過 npm run ...來執行的腳本指令，可以很大程度的方便開發協作。

要讓整個應用運作起可能涵蓋了部署、啟動等等的行為，而在scripts自定義好這些指令後，一坨指令就可以省略！

就像是下面這個例子，光是要啟動一個應用程式的一些必備服務 ex: DB, Redis... 就要打一長串指令了（如果像以下用 docker compose 一口氣將所有需要的服務都起起來那還方便挺多，但沒有的話甚至要記住每個服務啟動的指令分別執行，儘管記性好，也容易出錯），除此之外，啟動指令可能還需要區分不同環境的檔案路徑，像是要用 dev 的 docker compose 還是 prod 的 docker compose ? .env.dev 還是 .env.prod ？且如果他們都位在檔案結構很裡面的位置的話，光是要打出正確位置就佔用了 CLI 兩三行都有可能 xd!

```js
scripts: {
  "dev:setenv": "docker compose -f ./docker-compose-dev.yml --env-file ./.env.dev up -d --build",
  "dev:run": "nodemon --exec node --enable-source-maps --no-warnings=ExperimentalWarning --loader ts-node/esm --env-file=./.env.dev ./src/app.ts",
}
```

> [!NOTE]
> start,test 字眼可以直接 npm 接，不需要 run


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


> .env 檔案不上傳到 github 是正確的，那要怎麼讓團隊夥伴或新進同事知道這個專案有哪些設定？

這個問題就是「團隊協作時，如何同步彼此的 env 」，我想到有兩種方式：
1. 明確規定 rule ，當新增、更新 env 檔時，要在 .env_example 做紀錄，並通知一下 PM 之類的
2. 使用現成的第三方 Secret Manager 工具 ex: AWS Secrets Manager、Infisical ...

我偏向第二種，因為這些工具除了權限管理外，還可以很輕鬆整合管理不同環境所需要的變數，而且有種集中式管理的感覺，不容易 A 成員修改但沒人知道，於是其他人都壞掉。反過來看第一種，除了每個人本地都要維護一份甚至多份 env file 外，可能每次開發都需要確保說 env 有沒有更新等等的問題。

除此之外，對於新進的團隊成員來說，第二種方式也比較友善，只是可能需要習慣第三方 Secret Manager 的 GUI介面而已。



> 「開發偏好每個人都不同」 => 那如果想要達成團隊一致的 coding style 呢？

我的想法是可以透過兩個面向實現一致的 coding style：
1. 使用工具
2. 團隊溝通 / 規範設定

工具最常見的就是這幾種：eslint, prettier, husky ...，但這些工具主要的幫助是讓所有團隊成員都能輕鬆的有著一致的排版而已。如果要是更深層 coding style 像是模組化方式、分層方式等等，就必須要在開發之前向所有團隊成員達成一致共識，通常也需要留下係統 Spec 讓新進成員也能夠有跡可循。

然後其實達成一致共識後，人的惰性往往都會不小心沒遵從到規範，所以才需要所謂的 code review，減少 code base 走歪的可能性。

而達成一致共識這件事情常常會引發許多（爭）吵（論）架 xd ex: 這個資料夾有必要嗎？會不會over-designed? 等等。雖然這樣的爭論過程滿有趣的，可以引發很多不同看法的設計。但如果真的已經吵起來了的話，我覺得最好的辦法就是直接拿「業界常用」「成功標準」用 ex: DDD, Clean Architecture...


## package-lock.json 用途是什麼？需要放上 github 嗎？為什麼？

### package-lock.json 用途是什麼？

當 npm install 時，npm 會依據 package.json 標記的 Semantic Versioning 套件進行安裝，而每個套件本身通常也會去依賴其他套件，這樣層層依賴的關係是很複雜的，因此 package-lock.json 就是用於記錄這些事情。

且 npm install 的過程會先從 Registry 取得套件下載資訊(URL...)：因為我們需要的套件通常也都會去依賴別的套件，所以 npm 會相對應的 Registry 取得各個套件的 package.json，以及解析出下載 URL，然後再彙整出所有套件對應確切的下載版本，組成 package-lock.json。

所以 npm 可以直接根據 package-lock.json 進行安裝，無需再次解析版本範圍等等的資訊，提升安裝速度


### 需要放上 github 嗎？為什麼？

我覺得要！兩個方面的理由：

**開發面**
- 放上 github 的主要理由是確保所有開發人員都是使用同一套套件版本，避免因版本差異導致「你電腦跑得動，我卻跑不動」的問題。

**生產面**
- 應該要確保開發用的套件跟生產用的套件要是一致的，如果生產部署時只有 package.json 而沒有 package-lock.json，那 npm install 可能會安裝到與本地開發不同版本的套件，比如以下用範圍定義的套件版本時，可能就剛好生產部署前這個套件更新到了 4.17.11 之類的，那 npm i 時就會重新生成一個最新的 lock file
```js
{
  "dependencies": {
    "lodash": "^4.17.0"
  }
}
```

> [!NOTE]
> 生產環境的部署通常都會使用 npm ci 這專門的工具，而這工具就是透過針對依據 package-lock.json 進行套件版本安裝，來解決開發生產環境套件不同步的問題


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