const tasksServices = require("../../services/tasksServices.js");
const { handleError, sendSuccessResponse} = require("../../utils/responseHandler.js")
const { getParentId } = require("../../utils/parseUtils.js");

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