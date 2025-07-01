// import express from 'express';
// const router = express.Router();

// import * as userController from '../controllers/usuerController.js';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
