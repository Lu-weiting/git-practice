### 說明 blob, tree, commit, branch, head 分別是什麼

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

