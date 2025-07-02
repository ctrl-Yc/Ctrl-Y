//タスクコントローラー
const tasksServices = require("../services/tasksServices.js");
const { verifyToken } = require("../lib/jwt.js");

exports.getAllTasks = async (req, res) => {
    try {
        const parent_id = req.user.user_id;

        const labelParam = req.params.label;

        const queryLabels = req.query.labels ? req.query.labels?.split(",") : undefined;

        const labels = labelParam
            ? [labelParam.toUpperCase()]
            : queryLabels?.map((label) => label.toUpperCase());

        const AllTasks = await tasksServices.findAllTasks(parent_id, labels);

        const serialized = AllTasks.map((task) => ({
            ...task,
            task_id: task.task_id.toString(),
        }))

        res.status(200).json(serialized);
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

        res.status(200).json({
            ...task,task_id: task.task_id.toString()});
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
        const NewTasks = await tasksServices.createNewTasks(req.body, parent_id);
        res.status(200).json(
            {
                ...NewTasks, task_id: NewTasks.task_id.toString()
            }
        );
    } catch (error) {
        console.log("新しいのtasksの追加エラー", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.patchEdiTasks = async (req, res) => {
    try {
        const taskId = parseInt(req.params.task_id, 10);
        const parent_id = req.user.user_id;
        const EditTask = await tasksServices.editTask(taskId, req.body, parent_id);

        res.status(200).json({
            ...EditTask, task_id: EditTask.task_id.toString()
        });

    } catch (error) {
        console.log("tasksの編集エラー");
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTasks = async (req, res) => {
    try {
        const parent_id = req.user.user_id;
        const taskId = parseInt(req.params.task_id, 10);
        await tasksServices.deleteTask(taskId, parent_id);
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
        res.status(200).json({ totalNum: totalNum });
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

// exports.SidEdit = async (req,res) => {
//     try{
//         const taskId = parseInt(req.params.task_id, 10);
//         const s_id = parseInt(req.params.s_id, 10);
//         const parent_id = req.user.user_id;
//         const sidEdit = await tasksServices.SidEdit(parent_id,s_id,taskId)
//         res.status(200).json({ sidEdit });
//     } catch (error) {
//         console.log("s_id変更エラー");
//         res.status(500).json({ message : error.message});
//     }
// }
