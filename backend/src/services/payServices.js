const prisma = require("@db");
const AppError = require("../utils/AppError");

exports.payroll = async (parent_id) => {
        const children = await prisma.child.findMany({
            where: {
                parent_id,
            },
            select: {
                user_id: true,
            },
        });

        const childrenUserIds = children.map((child) => child.user_id);

        if (childrenUserIds.length === 0) {
            throw new AppError("子供が見つかりません", 404);
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
