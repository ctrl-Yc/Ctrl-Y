const { TaskStatusCode } = require("@prisma/client");
const prisma = require("@db");

//タスクのさくせい
exports.createNewTask = async (taskData, parent_id) => {
    const { t_name, memo, reward, deadline } = taskData;
    return await prisma.task.create({
        data: {
            t_name,
            memo,
            reward,
            deadline: new Date(deadline),
            status: TaskStatusCode.TODO,
            s_id: 0,
            child_id: null,
            parent_id,
        },
    });
};
