const tasksServices = require("../../services/tasksServices.js");
const { handleError, sendSuccessResponse} = require("../../utils/responseHandler.js")
const { getParentId, parseTaskId, parseLabels } = require("../../utils/parseUtils.js");

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

exports.sidEdit = async (req,res) => {
    try{
        const taskId = parseTaskId(req.params.task_id);

        if(req.user.role === 'child') {
            const child_id = req.user.user_id;
            await tasksServices.addChildTask(child_id,taskId);
        }
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
        const child_id = req.user.user_id;
        const taskId = parseTaskId(req.params.task_id);
        const addChildTask = await tasksServices.addChildTask(child_id,taskId);
        sendSuccessResponse(res, { addChildTask });
    } catch (error) {
        handleError(res, error, "中間テーブル挿入エラー");
    }
}