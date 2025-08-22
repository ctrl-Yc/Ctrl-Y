const { TaskStatusCode } = require("@prisma/client");
const prisma = require("@db");

exports.findAllTasks = async (parent_id, labels, child_id) => {
    const list = labels === undefined ? [] : Array.isArray(labels) ? labels : [labels];
    const enumList = list.filter((item) => Object.values(TaskStatusCode).includes(item));

    return await prisma.task.findMany({
        where: {
            parent_id,
            ...(enumList.length && { status: { in: enumList } }),
            ...(child_id ? { child_id } : {}),
        },
    });
};

// taskの1件取得(task_no指定)
exports.getOneTask = async (taskId) => {
    const OneTask = await prisma.task.findFirst({
        where: {
            task_id: taskId,
        },
    });
    if (!OneTask) {
        const error = new Error("タスクが見つかりません");
        error.statusCode = 404;
        throw error;
    }

    return OneTask;
};
