const { signToken } = require('../lib/jwt');
require('module-alias/register');
const prisma = require('@prisma');

exports.createChild = async (req, res) => {
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
			},
		});

		res.status(200).json({ user_id: childCreate.user_id });
	} catch (error) {
		console.error('子供の登録エラー:', error);
		res.status(500).json({ message: '子供の登録エラー', error: error.message });
	}
};

exports.loginChild = async (req, res) => {
	try {
		const child_id = req.params.child_id;
		const { keyword } = req.body;

		const childData = await prisma.child.findFirst({
			where: {
				user_id: child_id,
				parent: { keyword },
			},
			include: {
				parent: {
					select: { user_id: true },
				},
			},
		});

		if (!childData) {
			return res.status(401).json({ message: 'あいことばが間違っています' });
		}

		const token = signToken(childData.user_id, { role: 'child' , parent_id: childData.parent.user_id ,});

		res.status(200).json({
			token,
			child_id: childData.user_id,
			parent_id: childData.parent.user_id,
		});
	} catch (error) {
		console.error('子供のログインエラー:', error);
		res.status(500).json({ message: '子供のログインエラー', error: error.message });
	}
};
