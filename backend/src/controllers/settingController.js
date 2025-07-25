const prisma = require('@db');

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

exports.getEmail = async (req, res) => {
	try {
		const parentId = req.user.user_id;

		const user = await prisma.user.findUnique({
			where: { user_id: parentId },
			select: { email: true },
		});

		if (!user) {
			return res.status(404).json({ message: 'ユーザーが見つかりません' });
		}

		res.status(200).json({ email: user.email });
	} catch (error) {
		console.error('メール取得エラー:', error);
		res.status(500).json({ message: 'メール取得エラー', error: error.message });
	}
};

exports.payCutHandler = async (req, res) => {
    try {
		const parentId = req.user.user_id;
		const user = await prisma.user.findUnique({
        where: { user_id: parentId },
        select: {
			pay_day: true,
			cutoff_day: true,
        },
	});

	if (!user) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
	}

	return res.status(200).json({
        pay_day: user.pay_day,
        cutoff_day: user.cutoff_day,
	});
    } catch (error) {
		console.error('締め日・給料日取得エラー:', error);
		return res.status(500).json({ message: '取得に失敗しました', error: error.message });
    }
};

exports.updatePayCutHandler = async (req, res) => {
    try {
		const parentId = req.user.user_id;
		const { pay_day, cutoff_day } = req.body;

		const updatedUser = await prisma.user.update({
        where: { user_id: parentId },
        data: { pay_day, cutoff_day },
		});

	return res.status(200).json({
        message: '締め日と給料日を更新しました。',
        data: {
			pay_day: updatedUser.pay_day,
			cutoff_day: updatedUser.cutoff_day,
        },
	});
    } catch (error) {
		console.error('締め日・給料日更新エラー:', error);
		return res.status(500).json({ message: '更新に失敗しました', error: error.message });
    }
};
