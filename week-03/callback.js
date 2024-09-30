function doJob(job, time, cb) {
  setTimeout(() => {
    // 只有在這裡，才能知道這個非同步的 setTimeout 已經做完事情了
    let now = new Date();
    cb(`完成工作 ${job} at ${now.toISOString()}`);
  }, time);
}

// 刷牙 1sec -> 吃早餐 3 sec -> 寫功課 1sec -> 吃午餐 2sec
let now = new Date();
console.log(`開始工作 at ${now.toISOString()}`);
// write your code here



// 這種寫法是在第一秒同一時間都被丟入Web API等待timeout，所以時間累積
// const time = 1000;
// doJob("刷牙", time, function (data) {
//   console.log(data);
// });
// doJob("吃早餐", time + 3000, function (data) {
//   console.log(data);
// });
// doJob("寫功課", time + 4000, function (data) {
//   console.log(data);
// });
// doJob("吃午餐", time + 6000, function (data) {
//   console.log(data);
// });


doJob("刷牙", 1000, function (data) {
  console.log(data);
  doJob("吃早餐", 3000, function (data) {
    console.log(data);
    doJob("寫功課", 1000, function (data) {
      console.log(data);
      doJob("吃午餐", 2000, function (data) {
        console.log(data);
      });
    });
  });
});
