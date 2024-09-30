// 我覺得跟callback最大差異就是語法更淺顯易懂些，將doJob回傳一個不知何時會實現的承諾
// 然後在一個一個用then去處理每個承諾做完後的動作
function doJob(job, time) {
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

doJob("刷牙", 1000)
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.log(error);
  }).then(function () {
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
