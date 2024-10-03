## NodeJS version

* 20.17.0 (LTS)
* 選擇LTS是因為最穩定，比較不會遇到工具、套件等等相容性的問題

> [!NOTE]
> 版本的選擇可能會根據系統開發所需要的套件變動，不一定都是LTS

## npm vs nvm

### npm 基本常識
NodeJS的套件管理工具，就像Python的requirements.txt、Spring boot的maven一樣，package.json就是npm的核心文件
* 一些常見的命令
```bash
npm init 建立專案
npm install 安裝套件
npm uninstall 刪除套件
npm run 執行命令
```
> [!NOTE]
> **npm install vs npm ci**
> * npm install: 根據 package.json 安裝所需的所有套件，通常用於開發環境
> * npm ci: 根據 package-lock.json 完全一致地安裝套件，通常用於生產環境，原因是因為npm install都會偷偷自動更新一些地方，因此就有可能導致某些套件不相容


### 那為什麼我們需要有npm這種工具？

在開發過程中，我們往往會用到許多「別人已經寫好」成千上萬行的套件工具於自己的專案中，那npm 就是提供開發者快速方便的下載好所需的套件於本地專案中，**但**也因為實在太方便，讓「安裝套件」變成一件很輕鬆的事情，使我們常常忽略（甚至根本沒去意識到）安裝套件背後的原理過程。


#### 當沒有方便的套件管理工具時，該如何安裝套件？

1. 首先，需要去各種公開套件平台（來源）搜尋出所需的套件其下載 URL
2. 下載後往往需要手動解壓縮，解壓縮還要處理套件安放位置（如同 node_modules）
3. 還需要人力去管理套件的版本，如果有多個套件要更新版本，會厭世且手動操作也會增加出錯的風險

從這些可以看出套件管理工具是如此的貼心...


#### 那 npm 是如何幫我做這些麻煩事的呢？

簡單概括：當我們 `npm install xxx` 時，npm 就會到 Registry（[default registry](https://registry.npmjs.org)）上找尋最新版本的xxx套件，下載到專案中的 node_modules 資料夾，package.json 則更進一步提升套件管理的便利性，我們不需要一個一個沒效率的指定套件安裝，直接在 package.json 中加入需要的套件，一個指令 `npm install` 就能一鍵下載好。

**那 npm install 到底做了什麼？**

1. 計算缺少的套件：主要基於 package.json Semantic Versioning 描述的版本，比對 node_modules, package-lock.json 中的套件，判斷是否需要更新
2. 從 Registry 取得套件下載資訊(URL...)：因為我們需要的套件通常也都會去依賴別的套件，所以 npm 會相對應的 Registry 取得各個套件的 package.json，以及解析出下載 URL
3. 計算差異：主要避免套件依賴間同個版本重複下載，彙整出所有套件對應確切的下載版本，組成 package-lock.json(套件結構樹)
4. 下載、提取真正需要的套件：真正開始進行「下載」行為，其中包含解壓縮，移至 node_modules。
5. 將所有依賴套件都安裝好：將所有包含（依賴的依賴）的套件全部安裝好

> [!NOTE]
> **為什麼第三步最耗時？**
> * 因為 下載、解壓縮、寫入硬碟分別需要網路、CPU 及硬碟 IO 的支撐
> * 但 npm 本身透過本地快取機制來減緩，寫入 node_modules 同時也寫入快取，若其他專案中也需要同一套件的依賴，就直接 copy 一份過去

> [!NOTE]
> **npm 缺點！**
> * npm 安裝套件時，快取機制是「複製」而不是「引用」同一份檔案，這就是 node_module 肥大的問題
> * 解決方案：pnpm 提供最直接的解法，讓本地多個專案可以共用一份 node_modules，大大節省空間！


### nvm 基本常識
nvm 是一個超方便的工具，可以讓用戶輕鬆切換 NodeJS 版本（就如其名 Node Version Manager ），在一台電腦中兼容多個 NodeJS 版本
* MacOS安裝方式
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc 或 source ~/.zshrc
```
> [!NOTE]
> 當使用nvm安裝腳本時，會自動在shell配置文件添加一些設置，比如ENV等，如下，所以會需要使用source重新載入就不用重開終端了：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

* 輕鬆切換指令
```bash
nvm use xx.xx.xx
```
* 設置默認版本
```bash
nvm alias default xx.xx.xx
```


### 那為什麼我們需要有nvm這種工具？

其實跟為什麼我們要用 npm 的理由是一樣的，nvm 讓我們對於「切換 NodeJS 版本」感到輕鬆無比，若不使用 nvm，手動切換NodeJS版本就會是很麻煩的事情。而且若沒有 nvm 這類工具

#### 當沒有這樣方便的切換版本工具時，該如何像 nvm 一樣切換 NodeJS 版本？

1. 建立存放各個 NodeJS 版本的檔案結構
```bash
mkdir -p ~/nodejs_versions

~/nodejs_versions/
├── node-v14.17.0-linux-x64/
└── node-v16.13.0-linux-x64/
```
2. 下載並安裝不同版本的 NodeJS 到**獨立**的資料夾
3. 下載的每個 NodeJS 版本**解壓縮**到**獨立**的資料夾中
4. 手動管理 `PATH` 環境變數：因為切換的動作其實就是使系統在執行 node、npm 等命令時，使用你指定的 NodeJS 版本的可執行文件

所以當有切換需求卻沒有切換工具時，我們就必須手動管理各個 NodeJS 版本的路徑，以及為每個專案的環境設置對的 NodeJS 路徑，或許能透過好的腳本設計讓這些步驟在簡單些，但一樣越多手動越多錯誤可能，再加上這多麻煩啊當然有人能幫做最好啊～～


#### 那 nvm 是如何幫我做這些麻煩事的呢？

1. 當使用 `nvm install <version>` 的時候，nvm 就會自動的去 NodeJS 官方網站下載對應版本的二進制文件或源碼，然後進行編譯和安裝，以及自動生成管理存放位置（` ~/.nvm/versions/node/ `），確保了互不干擾，並可以單獨管理。
2. 修改 PATH 環境變數來切換 NodeJS 版本：當執行 `nvm use <version> `時，nvm 會更新**當前 shell** 的 PATH 變數
```bash
nvm use 16 #-----> PATH=~/.nvm/versions/node/v16.13.0/bin
```

> [!NOTE]
> **nvm 版本切換只會影響當前終端**
> * 因為 nvm 修改的是當前 shell 的環境變數，所以版本切換僅對當前終端有效。如果打開一個新的終端，需要重新執行 nvm use 或額外配置自動切換。
> * 可以在每個專案中多放一個.nvmrc檔案，方便自己的開發環境切換

> [!NOTE]
> **nvm 如何善用 PATH 的**
> * 優先級控制：將指定版本的 NodeJS bin 目錄添加到 PATH 的最前面，確保該版本的 node、npm 等命令被首先找到
> * 避免衝突： nvm 只修改 PATH，而不同版本的 NodeJS 可執行文件位於不同的目錄，所以可以避免版本之間的衝突。


### 額外補充 npx
我們在開發過程往往都會用到一些只**_暫時_**需要的技術，用npm install就有點浪費空間，所以npx的出現就是為了解決這個需求，再加上儘管沒有安裝，npx也可以快速執行命令（借我用一下的概念xd），因為最近正好在學TS就拿TS舉例：由TypeScript組成的code base，真正運行依舊是運行編譯後的JS，所以其實「編譯TS」這個行為就是一次性，因此可以透過npx tsc而不用再永久安裝tsc套件，特別是在容器化時。
* 減少全局安裝
* 快速運行命令而無需提前安裝套件