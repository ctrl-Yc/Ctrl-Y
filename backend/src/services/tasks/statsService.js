const prisma = require("@db");

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