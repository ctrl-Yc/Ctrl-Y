// import express from 'express';
// const router = express.Router();

// import * as userController from '../controllers/usuerController.js';


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');


router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
// メール送信用
router.post('/rePassword', userController.rePassword);

// パスワード変更用
router.post('/reset', auth, userController.resetPassword);

module.exports = router;
