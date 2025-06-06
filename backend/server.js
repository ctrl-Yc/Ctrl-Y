const express = require('express')
const app = express()
const port = 3000

const url = process.env.SB_URL
const anonKey = process.env.SB_SERVICE_ROLE

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`サーバー起動 https://localhost:${port}`)
  console.log(`URL: ${url}`)
  console.log(`Anon Key: ${anonKey}`)
})
