const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require("../middlewares/auth.js");

//購読情報をDBに保存
router.post('/subscribe', auth, notificationController.subScribe);

//購読情報をDBから削除
router.patch('/subscribe', auth, notificationController.unSubScribe);

//子供画面から親にお手伝い完了通知を飛ばす
router.post('/send-notification', auth, notificationController.sendNotification);

//親画面　給料日通知
router.post('patday-notification', auth, notificationController.paydayNotification);

module.exports = router;