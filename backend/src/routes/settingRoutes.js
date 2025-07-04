const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController.js');
const auth = require('../middlewares/auth.js');

router.get('/getChild', auth, settingController.getChildSettings);

router.post('/payCutOff', auth, settingController.updatePayCutoff);

module.exports = router;