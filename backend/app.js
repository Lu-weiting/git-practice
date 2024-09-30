// CommonJS
const express = require('express');


// 預設是專案根目錄的env -> 有path可以用相對路徑指定
require('dotenv').config();

// ES6 
// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})