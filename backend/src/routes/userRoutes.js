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

// パスワードリセット用
router.post('/reset', auth, userController.resetPassword);

// パスワード変更用
router.post('/change', auth, userController.changePassword);


router.post("/keyword", auth, userController.changeChildPass);


module.exports = router;
