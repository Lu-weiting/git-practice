// main.js
// TODO 以 Module 的方式匯入，例如:
import Stack from './stack.js';

let stack = new Stack();
stack.print();

stack.push(5);
stack.push(8);
stack.print();
// 看看慢來的8有沒有消失
stack.pop();
stack.print();
// 看看新來的2有沒有在array head
stack.push(2);
stack.print();
// 看看是不是新來的2正確print出
stack.peek();
console.log(stack.isEmpty());
console.log(stack.size());
stack.clear();
stack.print();
console.log(stack.isEmpty());


// stack.pop();
// stack.peek();
