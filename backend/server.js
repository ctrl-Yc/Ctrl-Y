// const express = require('express');
// const mainRouter = require('./src/routes/index.js');
const app = require('./src/index.js');


// app.use('/api',mainRouter);


const port = 3000

const url = process.env.SB_URL
const anonKey = process.env.SB_SERVICE_ROLE

// app.get('/', (req, res) => {
//   res.send('Hello World!')

// })

app.listen(port, () => {
  console.log(`サーバー起動 http://localhost:${port}`)
  console.log(`URL: ${url}`)
  console.log(`Anon Key: ${anonKey}`)
})
