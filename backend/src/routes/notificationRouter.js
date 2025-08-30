const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require("../middlewares/auth.js");

//購読情報をDBに保存
router.post('/subscribe',notificationController.subScribe);
router.post('/subscribe', auth, notificationController.subScribe);
//子供のアカウントから親に通知を飛ばす
router.post('/send-notification',notificationController.sendNotification);
router.post('/send-notification', auth, notificationController.sendNotification);

module.exports = router;