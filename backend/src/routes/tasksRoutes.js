const express = require('express');
const router = express.Router();

const TasksController = require("../controllers/tasksControllers.js");


router.get('/',TasksController.getAllTasks);


module.exports = router;