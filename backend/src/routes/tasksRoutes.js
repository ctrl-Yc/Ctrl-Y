//タスクルーター
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const TasksController = require('../controllers/tasksControllers.js');

//親側のAPI

//taskの新規作成
router.post('/' , auth, TasksController.postNewTasks);

//Tasks全件取得(s_idでステータス管理)
router.get('/:s_id', auth, TasksController.getAllTasks);

//全件取得(ステータス管理なし)
router.get('/', auth, TasksController.getAllTasks);

//taskの編集
router.patch('/:task_id', auth, TasksController.patchEdiTasks);

//taskの削除
router.delete('/:task_id', auth, TasksController.deleteTasks);

//一件のtask取得
router.get('/:task_id', TasksController.getOneTasks);

//終了した合計タスク数
router.get('/totalnumber',auth, TasksController.CompleteTaskNum);

//終了したタスクの合計金額
router.get('/totalsalary', auth,TasksController.TotalSalary);


//子供側のAPI

// s_idの変更
// router.patch('/edit/:task_id/s_id/:s_id', auth,TasksController.SidEdit);

module.exports = router;
