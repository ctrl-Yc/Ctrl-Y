const express = require('express');
const router = express.Router();
const ChildController = require('../controllers/childController.js');
const auth = require('../middlewares/auth.js');

router.post('/create', auth, ChildController.createChild);
router.post('/login/:child_id', ChildController.loginChild);

module.exports = router;
