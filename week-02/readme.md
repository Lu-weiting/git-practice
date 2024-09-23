## NodeJS version

* 20.17.0 (LTS)
* 選擇LTS是因為最穩定，比較不會遇到工具、套件等等相容性的問題

> [!NOTE]
> 版本的選擇可能會根據系統開發所需要的套件變動，不一定都是LTS

## nvm vs npm vs npx

### nvm
nvm 是一個超方便的工具，可以輕鬆切換NodeJS版本（就如其名Node Version Manager ）
* MacOS安裝方式
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc 或 source ~/.zshrc
```
> [!NOTE]
> 當使用nvm安裝腳本時，會自動在shell配置文件添加一些設置，比如ENV等，如下：
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

### npm
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

### npx
我們在開發過程往往都會用到一些只需要**暫時**需要的技術，用npm install就有點浪費空間，所以npx的出現就是為了解決這個需求，再加上儘管沒有安裝，npx也可以快速執行命令（借我用一下的概念），像TypeScript建立的系統，真正運行依舊是運行編譯後的JS，所以其實「編譯TS」這個行為就是一次性，因此可以透過npx tsc而不用再永久安裝tsc套件
* 減少全局安裝
* 快速運行命令而無需提前安裝套件



