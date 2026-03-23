const prisma = require("@db");
const { getOneTask } = require("./getService");
const { assertTaskOwner } = require("../../utils/taskAuthUtils");

//taskの編集
exports.editTask = async (taskId, taskData, parent_id) => {
    const task = await getOneTask(taskId);
    assertTaskOwner(task, parent_id);

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

exports.sidEdit = async (parent_id, taskId, labels,child_id) => {
    const task = await getOneTask(taskId);
    assertTaskOwner(task, parent_id);
    const label = labels[0];

    const updateData = {
        status: label,
    };

    if(child_id) {
        updateData.child_id = child_id;
    }

    return await prisma.task.update({
		where: {
			task_id: taskId,
		},
		data: updateData,
    });
}
