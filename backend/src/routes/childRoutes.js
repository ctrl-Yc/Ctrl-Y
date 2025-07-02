const express = require("express");
const router = express.Router();
const ChildController = require("../controllers/childController.js");
const auth = require("../middlewares/auth.js");

router.post("/", auth, ChildController.createChild);
router.post("/:child_id/login", ChildController.loginChild);

module.exports = router;
