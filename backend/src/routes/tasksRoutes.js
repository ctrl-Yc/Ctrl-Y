//タスクルーター
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const parentOnly = require("../middlewares/parentOnly");
const TasksController = require("../controllers/tasksControllers.js");

//taskの新規作成
//終了した合計タスク数
router.get("/totalnumber", auth, TasksController.CompleteTaskNum);

//終了したタスクの合計金額
router.get("/totalsalary", auth, TasksController.TotalSalary);

//Tasks全件取得(ラベルでステータス管理)
router.get("/status/:label", auth, TasksController.getAllTasks);

//全件取得(ステータス管理なし)
router.get("/", auth, TasksController.getAllTasks);

//新規タスクの追加
router.post("/", auth, parentOnly, TasksController.postNewTasks);

//一件のtask取得
router.get("/:task_id", auth, TasksController.getOneTasks);
//taskの編集
router.patch("/:task_id", auth, parentOnly, TasksController.patchEdiTasks);
//taskの削除
router.delete("/:task_id", auth, parentOnly, TasksController.deleteTasks);
// s_idの変更
router.patch('/:task_id/:label', auth,TasksController.SidEdit);

module.exports = router;
