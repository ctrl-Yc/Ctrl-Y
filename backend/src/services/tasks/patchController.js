const prisma = require("@db");

//taskの編集
exports.editTask = async (taskId, taskData, parent_id) => {
    const task = await exports.getOneTask(taskId);

    if (task.parent_id !== parent_id) {
        const error = new Error("このタスクを編集する権限がありません");
        error.statusCode = 403;
        throw error;
    }

    const { t_name, memo, reward, deadline } = taskData;
    return await prisma.task.update({
        where: {
            task_id: taskId,
        },
        data: {
            t_name,
            memo,
            reward,
            deadline,
        },
    });
};

exports.sidEdit = async (parent_id, taskId, labels) => {
    const task = await exports.getOneTask(taskId);
    if (task.parent_id !== parent_id) {
        const error = new Error("このタスクを変更する権限がありません");
        error.statusCode = 403;
    throw error;
    }
    const label = labels[0];

    return await prisma.task.update({
		where: {
			task_id: taskId,
		},
		data: {
			status: label
		},
    })
}