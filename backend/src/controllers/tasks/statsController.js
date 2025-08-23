const tasksServices = require("../../services/tasks");
const { handleError, sendSuccessResponse} = require("../../utils/responseHandler.js")
const { getParentId } = require("../../utils/parseUtils.js");

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