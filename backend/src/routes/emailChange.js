const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requestEmailChange, verifyEmailChange } = require('../controllers/emailChangeController');

router.post('/', auth, requestEmailChange);
router.get('/verify', verifyEmailChange);

module.exports = router;
