## Git 是啥怎麼運作的？

### 一個管理檔案系統的系統
* snapshots of the file system in **time**
        - File 的組成不只是「內容」還有一些metadata ex: created time，當File從一個資料夾一去另一個資料夾時，Metadata是不變的


### 細部觀察Git init：
* 當初次git init 時，便會生成.git資料夾
```bash
(base) waiting@MacBook-Pro-104 .git % ls
HEAD            info
config          objects
description     refs
hooks
```
* 其中objects空的合理，畢竟還沒生成任何檔案，那info, pack是幹嘛的勒？
```bash
(base) waiting@MacBook-Pro-104 git-lab2 % find .git/objects
.git/objects
.git/objects/info
.git/objects/pack
```
* 當cd進info後，可以看到**exclude**檔案，原本以為這就是.gitignore的運作來源，但居然不是，exclude跟.gitignore是獨立的忽略機制，他們有優先序區分，而優先序是依照 git add指令->.gitignore->exclude
        - `exclude` 本地層級的忽略規則，只影響當前使用者的開發環境
        - `.gitignore` 專案層級的忽略規則，所有協作者共享
因為.gitignore的原則是所有協作者共同**要**忽略的文件，所以有時候當有些本地測試檔案不應該被版本控制或共享給其他人時，就可以透過手動修改exclude檔案來實現

**小實驗**
* 在沒有.gitignore的情況下，進到.git/info/exclude新增某個檔案，透過git status便能發現確實被忽略(因為進不去暫存區)
```bash
(base) waiting@MacBook-Pro-104 git-lab2 % echo "test.txt" >> .git/info/exclude
```
```bash
echo "這是測試檔案" > test.txt
```
```bash
(base) waiting@MacBook-Pro-104 git-lab2 % git status

位於分支 master

尚無提交

無檔案要提交（建立/複製檔案並使用 "git add" 建立追蹤）
```

### 說明 blob, tree, commit, branch, head 分別是什麼
in Git 所有物件(Blob / Commit / Tree)都是以sha-1 hash來辨識的
        - 40 characters （16進位）
- Blob：
> * Git中的四大物件之一，所有物件都位於.git/objects
> * 全名是 Binary Large Object，這個物件專門處理的是一個檔案裡的「內容」，透過固定的hash方式（sha1）將內容hash
> * 當git init 時，.git/objects還不會生成Blob的檔案夾，但當檔案被加入到暫存區（staging area）時，就會產生一個Blob Object以及資料夾
> * 新增一個空資料夾git status是不會有變化的，之所以不會有變化就是因為Blob object只紀錄文件的「內容」

- tree：
> * 這個物件專門處理的是檔案「目錄結構」，將每個Blob object對應一個檔案名稱，來建立起檔案結構
> * 所以tree實現了每個文件間的獨立性，儘管文件內容相同也不會影響檔案結構

> commit：
> * commit 後會產生，實現了我們能去翻以往的commit紀錄這樣的功能
> * 每一個commit object都會指向一個tree object，代表當前commit的所有的檔案結構，「回朔」則很大部分是來自於commit object中的 parent，parent會指向上一個commit的commit object，就像是Link List的連結

- branch：
> * 是一個可移動的指針，指向特定的commit，就像大馬路上的分叉口，commit則像車流
> * 讓開發者能在不同的分支上進行開發，而不會互相干擾

- head：
> * 指向當前分支最新的commit object

### 紀錄在 git repo 操作過程中，.git 檔案夾裡的變化，看看你可以觀察到什麼
- 每當git add檔案的時候，就會產生一個blob物件。這個物件會紀錄檔案的內容（一串編碼組成），不會紀錄檔名
- 每當git commit時，就會產生一個tree object，每個不同的commit都會產生不同的tree object，tree object是根據staging area的檔案組成，當查看tree object時可以看到每個blob object的hash外還有檔案名稱
- 第一次git commit，產生的commit object不會有parent

### commit message 應該怎麼寫比較好？應該有什麼 `style` 嗎？
commit style是為了進一步提升協作溝通以及程式碼維護上的效率，可以讓code reviewer更容易理解你的變更，通常可以分成兩個部分（我都這樣）：
- Subject Line: 簡短的描述、概括哪種類型的變更，比如：Fix, Feat, Refactor....
- Body: 描述變更的內容(in general)


## 一些額外學習到的紀錄

* git cat-file -p ${文件的hash值} -> 印出檔案內容
* .gitignore 
        - 如果檔案已被追蹤，即使添加到 .gitignore 中也不會被忽略。可使用 git rm --cached <file> 解決。
        - 衝突規則：優先應用**最靠近**檔案的規則