const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController.js');
const auth = require('../middlewares/auth.js');

router.get('/getChild', auth, settingController.getChildSettings);

router.route('/paycut')
    .get(auth, settingController.payCutHandler)
    .post(auth, settingController.payCutHandler);

router.get('/', auth, settingController.getEmail);
module.exports = router;