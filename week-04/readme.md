
1. **public ip: 52.197.206.120**


------

2. **什麼是 instance type?**

instance type 就是指電腦的規格（記憶體、運算能力等等），命名方式通常是依據種類、資源大小
> Each instance type offers different compute, memory, and storage capabilities, and is grouped in an instance family based on these capabilities --[aws](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html)

> Instance types are named based on their instance family and instance size. The first position of the instance family indicates the series, for example c. The second position indicates the generation, for example 7. The third position indicates the options, for example gn. After the period (.) is the instance size, such as small or 4xlarge, or metal for bare metal instances. --[aws](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)


--------

3. **什麼是 Nginx？有哪些用途與特性？**

Nginx 主要扮演這兩個角色：Web server（網頁伺服器）、Reverse Proxy（反向代理伺服器），除此之外還提供一堆功能，像是：
- 負載均衡器（Load Balancer）：可以根據不同的負載均衡算法（Round Robin 之類的），將流量均勻分配到多個後端伺服器
- HTTP 緩存（HTTP Caching）：請求優先進到這邊，所以極大程度的提升請求響應速度
- API Gateway：可以去控制訪問權等等
- Encryption：支持最新的 SSL/TLS 協議和加密技術，保障數據傳輸的安全


5. **proxy 是什麼意思？為什麼要透過 Nginx 來 proxy 到 Express 開發的 Web Server?**

代理（Proxy） 是一種中介服務器，位於客戶端和目標服務器之間，負責轉發客戶端的請求並將目標服務器的響應返回給客戶端。
proxy 的運作分成正反向：
* 正向：需求在 client 端，伺服器端是透明的，比如：使用者透過 VPN 看國外的網站，國外網站 server 並不知道 client 真正的位置

* 反向：需求在 server 端，客戶端是透明的，比如：使用者請求某筆資源，伺服器可能會向不同源的伺服器請求資源(Client 不需知道真的處理他請求的 Application Server 的真實位置)


### 為什麼要透過 Nginx 來 proxy 到 Express 開發的 Web Server?

運用 Nginx 的好處：
- Nginx 作為前端入口，可以隱藏後端的 Express 服務器的真實 IP 和端口，降低被攻擊的風險。
- Nginx 對於靜態資源（如圖片、CSS、JavaScript）的處理非常高效，可以直接由 Nginx 提供靜態文件服務，減少後端服務器的負擔。
- Nginx 可以緩存後端服務器的響應內容，減少後端的負載，提高響應速度。


-----------

4. **pm2 套件是什麼？有什麼用處？**

一個在生產(production)環境非常方便的「進程管理器」，通常在生產環境中可能會需要同時間運行多個伺服器，且這些伺服器必須要時時保持連線狀態。而 PM2 就是個能解決以上需求的強大工具，除了背景運行外、管理、監控和維護都能夠透過 PM2 變得簡單容易。下面簡潔整理了一下 PM2 能做到的事情：

- 進程管理：背景運行、自動重啟、零停機部署
- 負載均衡/集群模式：可以分配不同的進程跑在不同的 CPU 上
- 日誌管理/性能監控：集中管理日誌、實時顯示 CPU、內存使用情況

-----------

6. **Nginx 設定檔**
```
server {
    listen 80;
    server_name 52.197.206.120;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

-----------

7. **Security Group 是什麼？用途為何？有什麼設定原則嗎？**

### Security Group 是什麼？用途為何？

就是主機的防火牆，管理誰可以 access 主機誰不行，分成了兩種方式管控流量：
- Inbound：哪些 IP 地址、端口、Protocol 可以 access 主機
- outbound：限制這台主機能 access 到哪些其他 IP 地址、端口、Protocol

除了流量管控外，還有以下用途：
- 多實例間的統一管理、隔離實例：為不同的實例分配不同的 Security Group，層層防護的感覺（特別是在微服務這種架構下
        - 比如：當一個應用程式將後端吃分成不同的微服務運行在不同的 instance 時。

### Security Group 的設定原則

1. 最小權限原則：只允許必要的流量，比如：只有哪幾個特定 IP 能連入那就只設定這幾個，不要直接 0.0.0.0/0。
2. 分層設計：比較常見的是分成資料庫層、應用程式層 -> 讓資料庫的存取流量只能來自於應用程式層

------

8. **什麼是 sudo? 為什麼有的時候需要加上 sudo，有時候不用？**

sudo 的原文是「Super User DO」，如字面上意思，以權限開最大的用戶（管理者）做某件事情。在 Linux 系統中，root 就是一個也是唯一一個 Super User，他可以做任何事情。而 sudo 本身就是一個程式，當使用 sudo 後面接著一個指令時，會進行以下流程：
- 權限驗證：去到 /etc/sudoers 文件或是 /etc/sudoers.d 檔案夾底下查看當前用戶對於當前的指令是否有使用 sudo 的權限
- 權限切換：每個 process 似乎都會有 `setuid()` -> 將 process 的有效用戶 ID（EUID）切換到 root
- 執行命令

由上面第一個流程可以知道並不是每個用戶都有使用 sudo 的權限!
是否有權限使用是依據以下：
- 使用者有沒有在 `wheel` or `sudo`這些特殊的使用者群組中，可以進到 /etc/group 查看～
```
ubuntu@ip-172-31-40-129:/etc$ sudo cat /etc/group
root:x:0:
ubuntu:x:1000:
sudo:x:27:ubuntu
.
.
~~
ubuntu@ip-172-31-40-129:/etc$ groups ubuntu
ubuntu : ubuntu sudo audio dip video plugdev netdev lxd
```
- 就像上面提到的 `/etc/sudoers.d/`資料夾下的設定檔、`/etc/sudoers` 文件有沒有此用戶的相關設定


### 為什麼有的時候需要加上 sudo，有時候不用？

只要是跟「系統、OS」相關的操作，比如：修改系統配置檔、文件、安裝系統級軟體（跑到/usr/bin、/usr/local/bin 下的軟體們）、驅動程序，這些都屬於系統級的操作，必須要用 sudo 才能執行。所以當發現好像原本不需要用 sudo 操作的指令卻沒有權限時，可能有以下可能：
1. 安裝的東西不小心安裝到 `/usr`去了（比如：安裝 NodeJS 不透過 nvm 而是透過 apt 安裝的話就會）
2. 有些特別的文件可能本身不需要用到 root 但是還是有高一些的權限限制，可以透過 `ls -l` 查看

> [!NOTE]
> * nvm 將 Node.js 和 npm 安裝在你的用戶目錄下（通常是 ~/.nvm），而不是系統的全局目錄（如 /usr/local）。這意味著所有的操作（包括安裝全局套件）都是在用戶權限下進行的，不需要提升到 root 權限。



### 那為什麼需要 sudo?

在 sudo 出現前，每一個需要用到 root 權限的指令，我們可能都需要一遍一遍的手動切換用戶，輸入密碼驗證-極為麻煩，而且也會有安全性議題，假如今天有一個人登入了 root 帳號，執行指令後忘記登出了，那麼下一個人就直接成為 root 了。

**因此：**
sudo 巨大的好處之一就是：讓一般使用者能「暫時」取得 root 權限並使用 root 使用者的權限執行所需的動作


-----------

9. **Nginx 的 Log 檔案在哪裡？你怎麼找到的？怎麼看 Nginx 的 Log？**

在大多數 Linux 發行版中所有的 log 都是默認放在 `/var/log/` 下，而當在主機安裝 nginx 後，`/var/log/` 就會多出一個 nginx 資料夾，其底下就是所有 nginx 的 log 檔案。

也可以透過 nginx 的全局配置文件 `/etc/nginx/nginx.conf `中有顯示出 log 的位置而且是分成 access / error 兩個檔案來找到～
```
access_log /var/log/nginx/access.log;
error_log /var/log/nginx/error.log;
```

### 怎麼看 Nginx 的 Log？

可以根據分析的需求狀況，如果是：
* 希望實時監控日誌文件的最新更新，那就用 `tail`
```
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
* 不需要實時，長篇分析歷史紀錄，那就可以用 `cat/more/less` 等工具

-----------

10. 
- Nginx 可以將靜態資源（如圖片、CSS、JavaScript）處理的非常高效，為什麼能高效？跟不使用 Nginx 來處理的差別？（待研究
- Nginx 怎麼做到緩存的？（待研究

-----------

11. Ref:
- [aws-instance-type](https://docs.aws.amazon.com/zh_tw/AWSEC2/latest/UserGuide/instance-types.html)
- [aws-instance-naming](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html)
- [管理本地端主機之使用者與群組](https://ithelp.ithome.com.tw/articles/10270945?sc=hot)
- [科技讀蟲](https://yhtechnote.com/linux-sudo/)


#### 其他紀錄：

**`$PATH`是啥**
方便使用者下指令，不需要去找到對應指令在 Linux 的真正可執行檔案的位置才能下指令， `$PATH` 幫你找了。

下面這個顯示當前目錄下 Shell 會如何按照顺序搜尋可執行檔案的位置，換句話說：以下列出的path裡的可執行檔都是當前目錄下下指令時可以省略掉真實位置的
```bash
ubuntu@ip-172-31-40-129:/$ echo $PATH
/home/ubuntu/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```
除了內建的可執行檔案外，也可將自定義的腳本放入 `/usr/local` 比如：`/usr/local/hello.sh`，這樣無論在哪只要`PATH`找得到`/usr/local`，就可以直接在當前 shell 下 hello.sh 就好。
