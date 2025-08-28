const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController.js');
const auth = require('../middlewares/auth.js');

router.get('/getChild', auth, settingController.getChildSettings);

router.post('/change', auth, settingController.changeKeyword);

router.route('/paycut')
    .get(auth, settingController.payCutHandler)
    .post(auth, settingController.updatePayCutHandler);

router.get('/', auth, settingController.getEmail);
module.exports = router;