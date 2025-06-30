require('module-alias/register');
const prisma = require('@prisma');
const { child } = require('../lib/prisma');

exports.getChildSettings = async (req, res) => {
	try {
		const parentId = req.user.user_id;

		const parent = await prisma.user.findUnique({
			where: {
				user_id: parentId,
			},
			select: {
				user_id: true,
				children: {
					select: {
						user_id: true,
						c_name: true,
					},
				},
			},
		});

		if (!parent) {
			return res.status(404).json({ message: '子供の設定が見つかりません' });
		}
		res.status(200).json(parent);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'サーバーエラー' });
	}
};
