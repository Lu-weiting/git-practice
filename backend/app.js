// CommonJS
const express = require('express');

// console.log('All Environment Variables:', process.env);

// 預設是專案根目錄的env -> 有path可以用相對路徑指定
require('dotenv').config();
// console.log('All Environment Variables:', process.env);

// ES6 
// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

// 彈性透過環境變數決定綁定的端口
const port = process.env.NODE_ENV === "dev" ? process.env.DEV_PORT : process.env.PROD_PORT

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})