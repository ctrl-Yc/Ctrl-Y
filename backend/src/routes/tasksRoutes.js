//タスクルーター
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const parentOnly = require("../middlewares/parentOnly");
const TasksController = require("../controllers/tasksControllers.js");

//taskの新規作成
//終了した合計タスク数
router.get("/totalnumber/:user_id", auth, TasksController.completeTaskCount);

//終了したタスクの合計金額
router.get("/totalsalary/:user_id", auth, TasksController.totalSalary);

//Tasks全件取得(ラベルでステータス管理)
router.get("/status/:label", auth, TasksController.getAllTasks);

//全件取得(ステータス管理なし)
router.get("/", auth, TasksController.getAllTasks);

//新規タスクの追加
router.post("/", auth, parentOnly, TasksController.postNewTask);

//一件のtask取得
router.get("/:task_id", auth, TasksController.getOneTask);
//taskの編集
router.patch("/:task_id", auth, parentOnly, TasksController.patchEditTask);
//taskの削除
router.delete("/:task_id", auth, parentOnly, TasksController.deleteTask);
// s_idの変更
router.patch('/:task_id/:label', auth,TasksController.sidEdit);

//taskが完了した後に中間テーブルにtask_idとuser_idを入れる
router.post("/addChildTasks/:task_id", auth,TasksController.addChildTask);
module.exports = router;
