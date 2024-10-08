// 我覺得跟callback最大差異就是語法更淺顯易懂些，將doJob回傳一個不知何時會實現的承諾
// 然後在一個一個用then去處理每個承諾做完後的動作

// 老師提供的
function doJob(job, time, cb) {
  setTimeout(() => {
    let now = new Date();
    cb(`完成工作 ${job} at ${now.toISOString()}`);
  }, time);
}

// 將老師提供的 promisify
function doJob2(job, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let now = new Date();
        resolve(`完成工作 ${job} at ${now.toISOString()}`);
      } catch (error) {
        reject(error);
      }
    }, time);
  });
}

let now = new Date();
console.log(`開始工作 at ${now.toISOString()}`);

/**
 * 以下的方法以 callstack 視角來看運作流程：
 * 1. 呼叫 doJob2 -> 新建一個 Promise obj
 * 2. 執行 Promise obj 的 executor callback 函式
 * 3. 執行 setTimeout 函式 -> 移至 Web apis 背景執行（向 Web apis 註冊此 timer 的 callback
 * 4. 執行 then 函式 (只是將此函式的 callback 塞進前面新建的 Promise obj 的 fulfill reaction 屬性中做紀錄)
 * 要等到 promise obj 的 state 變為 fulfilled 才會真的執行 then 函式
 * 5. 等到 timer 結束，timer 的 callback 函式被移入 Task Queue，再交由 Eventloop 判斷 callstack 是否為空，空就丟進去執行
 * 6. resolve timer 的 callback 函式 (這會改變 Promise obj 的 state / result)，promiseResult 變為 `完成工作 ${job} at ${now.toISOString()}`
 * 7. fulfill reaction 被觸發，將 then 函式的 callback 移至 Microtask queue，再優先交由 Eventloop 判斷 callstack 是否為空，空就丟進去執行
 * 8. 執行第一個 console.log(result) 順利印出 「刷牙」
 * 9. then 函式本身除了執行 callback 外，還會額外新建一個 promise obj，當在 then 回傳了一個值，那這個 promise obj 就會resolve成這個值
 * ，但當回傳的是另一個 promise 那就會根據此 promise 的狀態去決定自己的狀態（有點難懂，下面再額外舉了個例子）
 * 10. 總之就是透過以上這樣去做到 promise chain
 */
doJob2("刷牙", 1000)
  .then((result) => {
    console.log(result);
    return doJob2("吃早餐", 3000);
  })
  .then((result) => {
    console.log(result);
    return doJob2("寫功課", 1000);
  })
  .then((result) => {
    console.log(result);
    return doJob2("吃午餐", 2000);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(`發生錯誤: ${error}`);
  });

/**
 * 這一段程式碼是在嘗試不在 then 函式中回傳 promise 來實現 promise chain
 * 想做到讓 then 函式本身會新建的 promise obj 中塞入 console.log 的 data 作為 promiseResult 值，
 * 但是以下運作過程發現根本不可能：
 * 以 callstack 角度來看:
 * 1. 新建一個 promiseResultArr 物件
 * 2. 新建一個 Promise obj
 * 3. 執行這個 Promise obj 的 executor callback 函式
 * 4. 執行 doJob 函式 -> setTimeout 函式
 * 5. 將 setTimeout 函式移至 Web api裡背景執行
 * 6. 執行 then 函式 (只是將此函式的 callback 塞進前面新建的 Promise obj 的 fulfill reaction 屬性中做紀錄)
 * 7. 等到 timer 結束，timer 的 callback 函式被移入 Task Queue，再交由 Eventloop 判斷 callstack 是否為空，空就丟進去執行
 * 8. resolve timer 的 callback 函式 (這會改變 Promise obj 的 state / result)，result 變為 `完成工作 ${job} at ${now.toISOString()}`
 * 8. fulfill reaction 被觸發，將 then 函式的 callback 移至 Microtask queue，再優先交由 Eventloop 判斷 callstack 是否為空，空就丟進去執行
 * 9. 執行第一個 console.log(result) 順利印出 「刷牙」
 * 10. 執行第二個 doJob，再跑一次上面的流程，doJob 因為 setTimeout 是 async 函式會被移至 Web apis背景執行，callstack 會繼續運行後面的 code
 * ，所以無法成功將我預期的值 return 給 then 額外新建的 promise obj，下面用 flag 變數試圖去等待 doJob 做完讓promiseResultArr有值
 * ，但因為除了 setTimeout 外都會直接於 callstack 執行，不在額外新建 promise obj 根本不可能成功回傳預期的 result 給下一層 promise obj
 * 11. 雖然失敗了，但是也因為順過這樣的運作流程，對 Promise 的運用更加熟悉ㄌ˙！
 * */

const promiseResultArr = [];
new Promise((resolve) => {
  doJob("刷牙", 1000, (data) => {
    resolve(data);
  });
})
  .then((result) => {
    console.log(result);
    doJob("吃早餐", 3000, (data) => {
      promiseResultArr.push(data);
    });
    let flag = true;

    setTimeout(() => {
      flag = false;
    }, 3000);

    if (!flag) return promiseResultArr[0];
  })
  .then((result) => {
    console.log(result);
  });

/**
 * 這種方式雖然能達成，但就是沒有好好運用到 Promise 的優勢
 */

doJob("刷牙", 1000)
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    doJob("吃早餐", 3000)
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      }).then(function () {
        doJob("寫功課", 1000)
          .then(function (result) {
            console.log(result);
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(() => {
            doJob("吃午餐", 2000)
              .then(function (result) {
                console.log(result);
              })
              .catch(function (error) {
                console.log(error);
              });
          });
      });
  });

new Promise((resolve, reject) => {
  resolve(1);
})
  .then((result) => result + 1)
  .then((result) => console.log(result));
