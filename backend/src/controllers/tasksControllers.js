const tasksServices = require("../services/tasksServices.js");

const handleError = (res, error, operation) => {
    console.log(`${operation}エラー:`, error.message);

    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
};

const sendSuccessResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json(data);
};

const getParentId = async (user) => {
    return user.role === 'parent' ? user.user_id : await tasksServices.getParentId(user.user_id);
};

const parseLabels = (labelParam, queryLabels) => {
    if (labelParam) {
        return [labelParam.toUpperCase()];
    }

    if (queryLabels) {
        return queryLabels.split(",").map(label => label.toUpperCase());
    }

    return undefined;
};

const parseTaskId = (taskIdParam) => {
    return parseInt(taskIdParam, 10);
};


exports.getAllTasks = async (req, res) => {
    try {
        const parent_id = await getParentId(req.user);
        const labels = parseLabels(req.params.label, req.query.labels);
        const allTasks = await tasksServices.findAllTasks(parent_id, labels);

        sendSuccessResponse(res, allTasks);
    } catch (error) {
        handleError(res, error, "タスクの取得");
    }
};

exports.getOneTask = async (req, res) => {
    try {
        const taskId = parseTaskId(req.params.task_id);
        const task = await tasksServices.getOneTask(taskId);

        if (!task) {
            return res.status(404).json({ message: "指定されたタスクが存在しません" });
        }

        sendSuccessResponse(res, task);
    } catch (error) {
        handleError(res, error, "タスクの1件取得");
    }
};

exports.postNewTask = async (req, res) => {
    try {
        const parent_id = await getParentId(req.user);
        const role = req.user.role;
        const newTask = await tasksServices.createNewTask(req.body, parent_id,role);
        sendSuccessResponse(res, newTask);
    } catch (error) {
        handleError(res, error, "新しいのタスク追加エラー");
    }
};

exports.patchEditTask = async (req, res) => {
    try {
        const taskId = parseTaskId(req.params.task_id);
        const parent_id = await getParentId(req.user);
        const role = req.user.role;
        const editTask = await tasksServices.editTask(taskId, req.body, parent_id,role);
        sendSuccessResponse(res, editTask);

    } catch (error) {
        handleError(res, error, "タスクの編集");
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const parent_id = await getParentId(req.user);
        const role = req.user.role;
        const taskId = parseTaskId(req.params.task_id);
        await tasksServices.deleteTask(taskId, parent_id,role);
        sendSuccessResponse(res, null, 204);
    } catch (error) {
        handleError(res, error, "タスクの削除");
    }
};

exports.completeTaskCount = async (req, res) => {
    try {
        const user_id = await getParentId(req.user);
        const totalCount = await tasksServices.completeTaskCount(user_id);
        sendSuccessResponse(res, { totalCount: totalCount});
    } catch (error) {
        handleError(res, error, "終了済みタスクの数取得");
    }
};

exports.totalSalary = async (req, res) => {
    try {
        const user_id = await getParentId(req.user);
        const totalSalary = await tasksServices.totalSalary(user_id);
        sendSuccessResponse(res, { totalSalary: totalSalary._sum.reward || 0 });
    } catch (error) {
        handleError(res, error, "合計金額取得エラー");
    }
};

exports.sidEdit = async (req,res) => {
    try{
        const taskId = parseTaskId(req.params.task_id);
        const parent_id = await getParentId(req.user);
        const labels = parseLabels(req.params.label, null);
        const sidEdit = await tasksServices.sidEdit(parent_id,taskId,labels);
        sendSuccessResponse(res, sidEdit);
    } catch (error) {
        handleError(res, error, "s_id変更エラー");
    }
}

exports.addChildTask = async (req,res) => {
    try{
        const user_id = await getParentId(req.user);
        const taskId = parseTaskId(req.params.task_id);
        const addChildTask = await tasksServices.addChildTask(user_id,taskId);
        sendSuccessResponse(res, { addChildTask });
    } catch (error) {
        handleError(res, error, "中間テーブル挿入エラー");
    }
}
