// stack.js
// 完成以下 TODO 的部分，並且以 Module 的方式匯出 (ESM)
export default class Stack {
  // TODO: # 有特別的意思嗎？請以註解回覆。
  // answer: 是Js中用於代表此變數為私有屬性的keyword，只能在類別內部訪問，外部無法直接訪問或修改（要透過封裝後的函式才可接觸到）
  #items;

  constructor() {
    this.#items = [];
  }

  // 在 stack 頂部加入元素i
  push(element) {
    // TODO
    this.#items.unshift(element);
  }

  // 移除並回傳 stack 頂部的元素
  pop() {
    if (this.#items.length === 0) {
      console.log("stack is empty");
      return;
    }
    this.#items.shift();
  }

  // 回傳 stack 頂部的元素，但不移除它
  peek() {
    // stack是空的時候若不判斷會回傳undefined
    if (this.#items.length === 0) {
      console.log("stack is empty");
      return;
    }
    console.log(this.#items[0]);
  }

  // 檢查 stack 是否為空
  isEmpty() {
    // TODO
    return this.#items.length === 0;
  }

  // 回傳 stack 中元素的個數
  size() {
    // TODO
    return this.#items.length;
  }

  // 清空 stack
  clear() {
    // TODO
    this.#items = [];
  }

  // 印出 stack 內容
  print() {
    // TODO
    if (this.#items.length === 0) {
      console.log("stack is empty");
      return;
    }
    console.log(...this.#items);
  }
}