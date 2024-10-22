1. https://nccucloud.store
2. NameCheap，原本想說用用看 GCP，結果帳號註冊一直不給過，改成用 AWS Route53，但發現好貴，於是最後還是選了最便宜的 NameCheap
3. A Record 就是用於將我們客製化的域名轉換為實際 IPv4 位置，A -> Address
4. NS Record 用於指定要透過哪個 Name Server 來去解析，告訴網路說應該向哪個 Name Server 查詢特定域名的 DNS 資訊
5. FWDNs 就是完整版 Domain，Domain 由 Top-Level、Second-Level 跟 Subdomain 組成，若三個部分都沒缺少那就是 FWDNs，比如：www.example.com 就是 FWDNs。URL 是一個用於在網際網路中定位某資源的絕對位置，用於索取 FWDNs 主機位置的某些特定資源
6. 因為當只有 http 時，資料在網路中傳輸是以裸體的方式傳輸的沒有經過任何加密隱藏，任何人都可以輕鬆抓到傳輸的資料，比如透過 WireShark
