const prisma = require('@db');

exports.initialSetup = async (req, res) => {
	try {
		const { c_name, keyword } = req.body;

		if (!c_name || !keyword) {
			return res.status(400).json({ message: '子供の名前とキーワードは必須です' });
		}
		// トークンから親のIDを取得
		const decoded = req.user;

		if (!decoded || !decoded.user_id) {
			return res.status(401).json({ message: '認証エラー: 親のIDが取得できません' });
		}

		const parent_id = decoded.user_id;

		// 親のキーワードを更新
		await prisma.user.update({
			where: { user_id: parent_id },
			data: { keyword: keyword },
		});

		// 子供を作成
		const childCreate = await prisma.child.create({
			data: {
				c_name: c_name,
				parent_id: parent_id,
    			registered_at: new Date()
			},
		});

		res.status(201).json({ user_id: childCreate.user_id });
	} catch (error) {
		console.error('子供の登録エラー:', error);
		res.status(500).json({ message: '子供の登録エラー', error: error.message });
	}
};
