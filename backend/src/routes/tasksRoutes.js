//タスクルーター
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const TasksController = require('../controllers/tasksControllers.js');

//Tasks全件取得(多分いらん？)
router.get('/Allget', auth, TasksController.getAllTasks);

//未着手,実行中tasksの全件取得
router.get('/getIncomplete', auth, TasksController.getIncompleteTasks);

//お手伝い終了タスクの全権取得
router.get('/finishedHelping', auth, TasksController.getFinishedHelpingTasks);

//承認済みtasksの全件取得
router.get('/Approved', auth, TasksController.getCompletedTasks);

//taskの追加
router.post('/newtaskadd' , auth, TasksController.postNewTasks);

//taskの編集
router.patch('/taskEdit/:task_id', auth, TasksController.patchEdiTasks);

//taskの削除
router.delete('/taskDelete/:task_id', auth, TasksController.deleteTasks);

//一件のtask取得
router.get('/getOnetask/:task_id', TasksController.getOneTasks);

//終了した合計タスク数
router.get('/totalTaskNum',auth, TasksController.CompleteTaskNum);

//終了したタスクの合計金額
router.get('/totalSalary', auth,TasksController.TotalSalary);

// //s_idの変更
// router.patch('/sidEdit/:task_id/:s_id', auth,TasksController.SidEdit);

module.exports = router;
