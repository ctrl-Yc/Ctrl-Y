const tasksServices = require("../../services/tasksServices.js");
const { handleError, sendSuccessResponse} = require("../../utils/responseHandler.js")
const { getParentId, parseTaskId } = require("../../utils/parseUtils.js");

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
