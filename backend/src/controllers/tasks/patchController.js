const tasksServices = require("../../services/tasks");
const { handleError, sendSuccessResponse} = require("../../utils/responseHandler.js")
const { getParentId, parseTaskId, parseLabels } = require("../../utils/parseUtils.js");
const { prisma } = require("@db");

exports.patchEditTask = async (req, res) => {
    try {
        const taskId = parseTaskId(req.params.task_id);
        const parent_id = await getParentId(req.user);
        const editTask = await tasksServices.editTask(taskId, req.body, parent_id);
        sendSuccessResponse(res, editTask);

    } catch (error) {
        handleError(res, error, "タスクの編集");
    }
};

exports.sidEdit = async (req,res) => {
    try{
        const taskId = parseTaskId(req.params.task_id);
        let child_id ;
        if(req.user.role === 'child') {
            child_id = req.user.user_id;
        }
        const parent_id = await getParentId(req.user);
        const labels = parseLabels(req.params.label, null);
        const sidEdit = await tasksServices.sidEdit(parent_id,taskId,labels,child_id);
        sendSuccessResponse(res, sidEdit);
    } catch (error) {
        handleError(res, error, "s_id変更エラー");
    }
};