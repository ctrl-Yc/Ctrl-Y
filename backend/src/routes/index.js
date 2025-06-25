// routes/index.js
const express = require('express');
const tasksRoutes = require("./tasksRoutes.js")

const router = express.Router();


router.use('/tasks',tasksRoutes);


module.exports = router;