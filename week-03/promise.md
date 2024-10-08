## Promise

### 什麼是 Promise？如何建立一個 Promise？

其中一個方式就是透過 `promise constructor`，而constructor 的 callback 函式就是所謂的 `executor function`。

當 new 了一個 promise constructor 時，就會在 Heap 記憶體中多了一個 promise obj，此 obj 包含：
- promise state / result / fulfill reaction / reject reaction / isHandled 這些屬性
- fulfill reaction / reject reaction 就是用於紀錄 then, catch 的行為

當我們將promise resolve / reject時，state , result就會做對應的變化
```js
new Promise((resolve,reject) => {
	resolve("Done") // result = "Done" , state = "fulfilled"
})
```

> [!NOTE]
> 題外話：牽扯到 js asychronus 的運作 
> 當 resolve or reject 時，then / catch 的 callback 函式就會丟入 microtask queue 優先被 Event loop 考慮加入 call stack

用一個簡單的例子順過一遍對於 promise的理解：
```js
 new Promise((resolve,reject) => {
	setTimeout(() => resolve("Done"));
})
    .then(result => console.log(result))
```
以 call stack 的視角分析過程：
1. 在 callstack 會先處理新建一個 promise obj（存於heap中）
2. 再來處理 executor function → executor function 又有一個 setTimeout
3. 將 setTimeout 移至 Web apis 裡背景執行
4. 再來處理 then 這個 reaction callback 函式（將此 callback 記錄於 promise obj -> 前面提到的 fulfill reaction
5. 等到timer end時，`() => resolve("Done")` 會被移到 Task Queue，若 call stack 沒有任何其他任務了就會被 Event loop 推進 call stack執行
6. promise obj 得到 resolve 時，除了 state / result 屬性變化外，fulfill reaction 的 callback 就會被觸發，然後 push 到 Microtask queue 優先被 Event loop 丟進 call stack 執行


再來一個測試：
```js
new Promise((resolve) => {
	console.log(1);
	resolve(2);
}).then(result => console.log(result))

console.log(3)
```
一樣以 call stack 的視角分析過程：
1. 在 callstack 會先處理新建一個 promise obj（存於heap中）
2. 處理 executor function → executor function
3. 執行 executor function 的 console.log(1)
4. 執行 resolve(2) function → 改變了 promise obj state / result
5. 處理 then 函式 -> 先將 then callback 函式添加於 promise obj fulfill reaction 中，因為瞬間就 resolve 了所以會此 callback 直接被丟進 Microtask queue，等到 Eventloop 確認 callstack 為空，才會執行函式
6. 當 then 被移入 queue，繼續執行下個函式 console.log(3)
7. 最後，因為 callstack 空了，Eventloop 將 位於 Microtask queue 的 then callback 移入 callstack 中執行。
8. so → 1 3 2

也可以直接在這邊複製貼上可視化跑跑看：http://latentflip.com/loupe/


### 上面這些都是一個 then 而已，那多個 then 呢？

多個 then 其實就是用於實現更乾淨的 promise chain，就像下面這樣：
```js
new Promise((resolve) => {
  resolve(1);
})
  .then((result) => result + 1)
  .then((result) => console.log(result));
  .then((result) => console.log(result));

// 2
// undefined
```
這段程式碼會如何運作？：
1. 新建一個新的 promise obj 後立刻執行 resolve(1) 函式
2. 執行第一個 then（先將 then callback 放入 promise obj 的 fulfill reaction 中後，因為 resolve 了，所以直接將此 callback丟入 Microtask queue
3. 但注意，then 這個函式本身除了建立原先 promise obj 的 fulfill reaction 外，也會額外件一個新的 promise obj，當在 then 回傳了一個值，那這個 promise obj 就會 resolve 成這個值，但當回傳的是另一個 promise 那就會根據此 promise 的狀態去決定自己的狀態 -> 這句話繼續看下去就能懂了
4. 第一個 then callback 被執行後會回傳 result + 1，但這個回傳值對原先的 promise obj 沒有任何影響，這個回傳值是會 resolve 成 then 函式額外新增的 promise obj 的 promiseResult 值
5. 所以當第一個 then callback 結束時，會有一個新的 promise obj 其 state 會是 `fulfilled` / PromiseResult 會是 result + 1 = 2
6. 再來一遍放進 promise obj 的 fulfill reaction....，當第二個 then callback 被執行時，除了執行 `console.log(2)` 外，新增的 promise obj 也會被塞入 return 值，**此時**，因為 console.log 並沒有任何回傳，所以可以觀察到 最後一個 then 將印出 undefined~



## Ref
- [小賴老師的補充教材](https://exploringjs.com/js/book/ch_promises.html#the-basics-of-using-promises)
- [超頂的可視化介紹](https://www.youtube.com/watch?v=Xs1EMmBLpn4)
