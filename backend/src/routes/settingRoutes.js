const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/settingController.js');
const auth = require('../middlewares/auth.js');

router.get('/getChild', auth, SettingController.getChildSettings);

module.exports = router;
