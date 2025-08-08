const prisma = require("@db");
const { getOneTask } = require("./getController");

//taskの削除
exports.deleteTask = async (taskId, parent_id) => {
    const task = await getOneTask(taskId);
    if (task.parent_id !== parent_id) {
        const error = new Error("このタスクを削除する権限がありません");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.task.delete({
        where: {
            task_id: taskId,
        },
    });
};