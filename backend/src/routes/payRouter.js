const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController');
const auth = require('../middlewares/auth.js');

// 月が変わった時のユーザーの処理
router.get("/payroll",auth, payController.payroll);

module.exports = router;