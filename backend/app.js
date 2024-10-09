// CommonJS
const express = require('express');
// ES6 
// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

// 彈性透過環境變數決定綁定的端口
process.env.NODE_ENV === "dev" ? require('dotenv').config({ path: './.env.dev' }) : require('dotenv').config({ path: './.env.prod' })

const PORT = process.env.PORT;
console.log(PORT)
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})