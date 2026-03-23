require('module-alias/register');
const express = require('express');
const app = require('./src/index.js'); 
const { startCronJobs } = require("./src/lib/cron.js");

const port = process.env.PORT;

//月初めにタスクをpayrollにまとめる
startCronJobs();

app.use(express.static('public'));

app.listen(port, () => {
	console.log(`サーバー起動 ポート:${port}`);
});
