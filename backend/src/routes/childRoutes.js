const express = require("express");
const router = express.Router();
const ChildController = require("../controllers/childController.js");
const auth = require("../middlewares/auth.js");

router.post("/", auth, ChildController.createChild);
router.post("/:child_id/login", ChildController.loginChild);

router.get("/:child_id/payments", auth, ChildController.getChildPayments);

//親のtokenで自分の子供のuser_id・c_name取ってくるAPI
router.get("/list", auth, ChildController.ChildList);

module.exports = router;
