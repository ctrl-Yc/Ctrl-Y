const tasksServices = require("../../services/tasks");
const { handleError, sendSuccessResponse } = require("../../utils/responseHandler.js");
const { getParentId, parseLabels, parseTaskId } = require("../../utils/parseUtils.js");

exports.getAllTasks = async (req, res) => {
    try {
        const parent_id = await getParentId(req.user);
        const labels = parseLabels(req.params.label, req.query.labels);

        const { child_id } = req.query;

        const allTasks = await tasksServices.findAllTasks(parent_id, labels, child_id);

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
