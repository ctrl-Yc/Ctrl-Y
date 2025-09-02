// src/lib/CronDetailed.js
const cron = require("node-cron");
const prisma = require('@db');

function startCronJobs() {
    cron.schedule(
        "0 0 1 * *", // N月1日だけ実行
        async () => {
            console.log("先月分のtaskをpayrollへ移行開始");

            const now = new Date();
            const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            firstDayOfPrevMonth.setHours(0, 0, 0, 0);

            const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            lastDayOfPrevMonth.setHours(23, 59, 59, 999);

            try {
                const completedTasks = await prisma.task.findMany({
                    where: {
                        status: "DONE",
                        updated_at: {
                            gte: firstDayOfPrevMonth,
                            lte: lastDayOfPrevMonth,
                        },
                    },
                });

                const tasksByChild = {};
                for (const task of completedTasks) {
                    if (!task.child_id) continue;
                    if (!tasksByChild[task.child_id]) tasksByChild[task.child_id] = [];
                    tasksByChild[task.child_id].push(task);
                }

                // child ごとに upsert と削除をまとめてトランザクション
                for (const [child_id, tasks] of Object.entries(tasksByChild)) {
                    const totalReward = tasks.reduce((sum, t) => sum + t.reward, 0);
                    const insertedMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));

                    await prisma.$transaction(async (tx) => {
                        // pay テーブルに upsert
                        await tx.pay.upsert({
                            where: {
                                user_id_inserted_month: {
                                    user_id: child_id,
                                    inserted_month: insertedMonth,
                                },
                            },
                            update: {
                                number: { increment: tasks.length },
                                reward: { increment: totalReward },
                            },
                            create: {
                                user_id: child_id,
                                inserted_month: insertedMonth,
                                number: tasks.length,
                                reward: totalReward,
                            },
                        });

                        // 完了タスクを task テーブルから削除
                        const deleted = await tx.task.deleteMany({
                            where: {
                                task_id: {
                                    in: tasks.map(t => t.task_id),
                                },
                            },
                        });
                        console.log(`削除件数: ${deleted.count} 件 (child_id=${child_id})`);
                    });
                }

                //未完了タスクも前月分を削除
                const uncompletedTasks = await prisma.task.findMany({
                    where: {
                        status: { not: "DONE" },
                        deadline: {
                            gte: firstDayOfPrevMonth,
                            lte: lastDayOfPrevMonth,
                        },
                    },
                });

                if (uncompletedTasks.length > 0) {
                    await prisma.task.deleteMany({
                        where: { task_id: { in: uncompletedTasks.map(t => t.task_id) } },
                    });
                }

                console.log("先月分のtaskをpayrollへ移行完了");
            } catch (error) {
                console.error("先月分のtaskをpayrollへ移行エラー", error);
            }
        },
        { timezone: "Asia/Tokyo" }
    );
}

module.exports = { startCronJobs };
