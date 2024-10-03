// main.js
// TODO 以 Module 的方式匯入，例如:
import Stack from './stack.js';

let stack = new Stack();
stack.print();

// 先測試 push 正確性 （往開頭加
stack.push(1);
stack.push(2);
stack.print();

// 測試 pop 正確性（stack空時pop
console.log(stack.pop());
stack.print();
console.log(stack.pop());
try {
  stack.pop();
} catch (error) {
  console.error(error);
}
// 測試 peek 正確性
console.log(stack.isEmpty());
stack.peek();
stack.push(3);
stack.push(4);
stack.peek();

// 其他值測試
stack.clear();
stack.push(undefined);
stack.push(null);
stack.push('');
stack.push(0);
stack.print()
console.log("size: ",stack.size());
stack.peek();