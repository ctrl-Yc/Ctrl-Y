const express = require("express");
const router = express.Router();
const ChildController = require("../controllers/childController.js");
const auth = require("../middlewares/auth.js");

router.post("/", auth, ChildController.createChild);
router.post("/:child_id/login", ChildController.loginChild);

router.get("/:child_id/payments", auth, ChildController.getChildPayments);

module.exports = router;
