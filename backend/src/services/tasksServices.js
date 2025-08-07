const { TaskStatusCode } = require("@prisma/client");
const prisma = require("@db");

exports.findAllTasks = async (parent_id, labels) => {
    const list = labels === undefined ? [] : Array.isArray(labels) ? labels : [labels];
	const enumList = list.filter((item) => Object.values(TaskStatusCode).includes(item));

	console.log("enumList:", enumList);

    return await prisma.task.findMany({
        where: { parent_id, ...(enumList.length && { status: { in: enumList } }) },
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

//タスクのさくせい
exports.createNewTask = async (taskData, parent_id,) => {
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

//taskの編集
exports.editTask = async (taskId, taskData, parent_id,role) => {
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

//taskの削除
exports.deleteTask = async (taskId, parent_id) => {
    const task = await exports.getOneTask(taskId);
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

exports.completeTaskCount = async (user_id) => {
    return await prisma.task.count({
        where: {
            child_id : user_id,
            status: 'DONE'
        }
    })
};


exports.totalSalary = async (user_id) => {
    return await prisma.task.aggregate({
        where: {
            child_id : user_id,
            status: 'DONE'
        },
        _sum: {
            reward: true,
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

exports.addChildTask = async (child_id, taskId) => {
    return await prisma.task.update({
        where: {
            task_id: taskId,
        },
        data: {
            child_id,
        },
    })
}

exports.getParentId = async (child_id) => {
    const parent_id = await prisma.child.findUnique({
        where: {
            user_id: child_id,
        },
        select: {
            parent_id: true,
        },
    });
    return parent_id.parent_id;

}