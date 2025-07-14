const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth, setupController.initialSetup);

module.exports = router;
