//タスクサービス

//prismaインスタンス
const prisma = require("../lib/prisma.js");

//Tasks全件取得
exports.findAllTasks = async (parent_id) =>{
    return await prisma.task.findMany({
        where:{ parent_id: parent_id, },
    });
}

// taskの1件取得(task_no指定)
exports.getOneTask = async (taskId) =>{
    return await prisma.task.findFirst({
            where: {
                task_id: taskId
            }
        });
}

//未着手,実行中tasksの全件取得
exports.findIncompleteTasks = async () =>{
    return await prisma.task.findMany({
        where:{
            s_id:{
                in:[0,1]
            }
        }
    });
}

//お手伝い終了タスクの全権取得
exports.findFinishedHelpingTasks = async () =>{
    return await prisma.task.findMany({
            where:{
                s_id:2
            }
        });
}

//承認済みtasksの全件取得
exports.findCompletedTasks = async () =>{
    return await prisma.task.findMany({
            where:{
                s_id:3
            }
        });
}

//タスクのさくせい
exports.createNewTasks = async (taskData)=>{
    const { t_name, memo, reward, deadline } = taskData;
    return await prisma.task.create({
            data:{
                t_name:t_name,
                memo:memo,
                reward:reward,
                deadline:deadline,
                s_id:0
            }
        })
}

//taskの編集
exports.editTask = async (taskId,taskData) =>{
    const { t_name, memo, reward, deadline} = taskData;
    return await prisma.task.update({
            where: {
                task_id: taskId
            },
            data:{
                t_name:t_name,
                memo:memo,
                reward:reward,
                deadline:deadline,
            }
        });
}

//taskの削除
exports.deleteTask = async (taskId)=>{
    return await prisma.task.delete({
        where:{
            task_id: taskId
        }
    });
}
