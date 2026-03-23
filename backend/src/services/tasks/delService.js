const prisma = require("@db");
const { getOneTask } = require("./getService");
const { assertTaskOwner } = require("../../utils/taskAuthUtils");

//taskの削除
exports.deleteTask = async (taskId, parent_id) => {
    const task = await getOneTask(taskId);
    assertTaskOwner(task, parent_id);

    return await prisma.task.delete({
        where: {
            task_id: taskId,
        },
    });
};
