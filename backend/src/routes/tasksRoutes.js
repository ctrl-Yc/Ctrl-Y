//タスクルーター

const express = require('express');
const router = express.Router();

const TasksController = require("../controllers/tasksControllers.js");


router.get('/Allget',TasksController.getAllTasks);

router.get('/getIncomplete',TasksController.getIncompleteTasks);

router.get('/finishedHelping',TasksController.getFinishedHelpingTasks);

router.get('/Approved',TasksController.getCompletedTasks);

router.post('/newtaskadd',TasksController.postNewTasks);

router.patch('/taskEdit/:task_id',TasksController.patchEdiTasks);

router.delete('/taskDelete/:task_id',TasksController.deleteTasks);

router.get('/getOnetask/:task_id',TasksController.getOneTasks);


module.exports = router;