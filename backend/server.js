const express = require('express');
const app = require('./src/index.js');
const port = process.env.PORT || 3000;;

const url = process.env.SB_URL;
const anonKey = process.env.SB_SERVICE_ROLE;
const connect = process.env.SB_CONNECT;

app.listen(port, () => {
	console.log(`サーバー起動 ${process.env.API_BASE_URL}`);
	console.log(`URL: ${url}`);
	console.log(`Anon Key: ${anonKey}`);
	console.log(`${connect}`);
	console.log(process.env.DB_URL);
	console.log(process.env.JWT_SECRET);
});
