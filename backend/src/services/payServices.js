const prisma = require("../lib/prisma.js");

exports.payroll = async (parent_id) => {
    // ① 親に紐づく子どもを取得
        const children = await prisma.child.findMany({
            where: {
                parent_id, // ここは親のUUID
            },
            select: {
                user_id: true,
            },
        });

        const childrenUserIds = children.map((child) => child.user_id);

        if (childrenUserIds.length === 0) {
            const error = new Error("子供が見つかりません");
            error.statusCode = 404;
            throw error;
        }
        // ② 子の user_id に該当する給与情報を取得
        return prisma.pay.findMany({
            where: {
                user_id: {
                    in: childrenUserIds,
                },
            },
        });
}
