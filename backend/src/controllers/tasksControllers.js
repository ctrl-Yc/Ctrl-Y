//タスクコントローラー
const tasksServices = require("../services/tasksServices.js");

exports.getAllTasks = async (req, res) => {
    try {
        const parent_id = req.user.user_id;

        const labelParam = req.params.label;

        const queryLabels = req.query.labels ? req.query.labels?.split(",") : undefined;

        const labels = labelParam
            ? [labelParam.toUpperCase()]
            : queryLabels?.map((label) => label.toUpperCase());

        const AllTasks = await tasksServices.findAllTasks(parent_id, labels);

        res.status(200).json(AllTasks);
    } catch (error) {
        console.log("tasksの取得エラー", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getOneTasks = async (req, res) => {
    try {
        const taskId = parseInt(req.params.task_id, 10);
        const task = await tasksServices.getOneTask(taskId);

        if (!task) {
            return res.status(404).json({ message: "指定されたタスクが存在しません" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("taskの1件取得エラー");
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        res.status(500).json({ message: "taskの1件取得エラー", error: error.message });
    }
};

exports.postNewTasks = async (req, res) => {
    try {
        const parent_id = req.user.user_id;
        const role = req.user.role;
        const NewTasks = await tasksServices.createNewTasks(req.body, parent_id,role);
        res.status(200).json(NewTasks);
    } catch (error) {
        console.log("新しいのtasksの追加エラー", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.patchEdiTasks = async (req, res) => {
    try {
        const taskId = parseInt(req.params.task_id, 10);
        const parent_id = req.user.user_id;
        const role = req.user.role;
        const EditTask = await tasksServices.editTask(taskId, req.body, parent_id,role);
        res.status(200).json(EditTask);

    } catch (error) {
        console.log("tasksの編集エラー");
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTasks = async (req, res) => {
    try {
        const parent_id = req.user.user_id;
        const role = req.user.role;
        const taskId = parseInt(req.params.task_id, 10);
        await tasksServices.deleteTask(taskId, parent_id,role);
        res.status(204).send();
    } catch (error) {
        console.log("tasksの削除エラー");
        res.status(500).json({ message: error.message });
    }
};

exports.CompleteTaskNum = async (req, res) => {
    try {
        const parent_id = req.user.user_id;
        const totalNum = await tasksServices.completeTaskNum(parent_id);
        res.status(200).json(totalNum);
    } catch (error) {
        console.log("終了済みtaskの数取得エラー");
        res.status(500).json({ message: error.message });
    }
};

exports.TotalSalary = async (req, res) => {
    try {
        const parent_id = req.user.user_id;
        const totalSalary = await tasksServices.totalSalary(parent_id);
        res.status(200).json({ totalSalary: totalSalary._sum.reward || 0 });
    } catch (error) {
        console.log("合計金額取得エラー");
        res.status(500).json({ message: error.message });
    }
};

exports.SidEdit = async (req,res) => {
    try{
        const taskId = parseInt(req.params.task_id, 10);
        const parent_id = req.user.user_id;
        const labelParam = req.params.label;
        const labels = labelParam
            ? [labelParam.toUpperCase()]
            :[]
        const sidEdit = await tasksServices.SidEdit(parent_id,taskId,labels)
        res.status(200).json({ sidEdit });
    } catch (error) {
        console.log("s_id変更エラー");
        res.status(500).json({ message : error.message});
    }
}
