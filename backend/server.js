// const express = require('express');
// const mainRouter = require('./src/routes/index.js');
const app = require('./src/index.js');
//prisamaいんすたんす
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// app.use('/api',mainRouter);


const port = 3000

const url = process.env.SB_URL
const anonKey = process.env.SB_SERVICE_ROLE
const connect = process.env.SB_CONNECT

// app.get('/', (req, res) => {
//   res.send('Hello World!')

// })

app.listen(port, () => {
  console.log(`サーバー起動 http://localhost:${port}`)
  console.log(`URL: ${url}`)
  console.log(`Anon Key: ${anonKey}`)
  console.log(`${connect}`)
  console.log(process.env.DB_URL);
  console.log(process.env.JWT_SECRET)
})
