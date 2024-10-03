function fib(n) {

  if (n < 2) {
    console.log(n);
    return;
  }
  let f1 = 0;
  let f2 = 1;
  let f3 = 0;
  // 扣除固定的前兩項
  for (let i = 0; i < n-2; i++) {
    f3 = f1 + f2;
    f1 = f2;
    f2 = f3;
  }
  console.log(f1+f2)
}

fib(0); // 0
fib(1); // 1
fib(5); // 5
fib(10); // 55
