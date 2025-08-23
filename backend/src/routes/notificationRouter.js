const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
//購読情報をDBに保存
router.post('/subscribe',notificationController.subScribe);
//子供のアカウントから親に通知を飛ばす
router.post('/send-notification',notificationController.sendNotification);

module.exports = router;