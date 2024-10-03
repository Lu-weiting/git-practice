const iterations = 100000;

// performance比console.time 精度來的更高
function averageTime(cb, iterations = 5) {
  let total = 0;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    cb();
    const end = performance.now();
    total += end - start;
  }
  return total / iterations;
}

function testPush() {
  const arr = [];
  for (let i = 0; i < iterations; i++) {
    arr.push(i);
  }
}

function testPop() {
  const arr = [];
  for (let i = 0; i < iterations; i++) {
    arr.push(i);
  }
  for (let i = 0; i < iterations; i++) {
    arr.pop();
  }
}

function testUnshift() {
  const arr = [];
  for (let i = 0; i < iterations; i++) {
    arr.unshift(i);
  }
}

function testShift() {
  const arr = [];
  for (let i = 0; i < iterations; i++) {
    arr.push(i);
  }
  for (let i = 0; i < iterations; i++) {
    arr.shift();
  }
}

console.log(`Average push time: ${averageTime(testPush)}`);
console.log(`Average pop time: ${averageTime(testPop)}`);

console.log(`Average unshift time: ${averageTime(testUnshift)}`);
console.log(`Average shift time: ${averageTime(testShift)}`);

