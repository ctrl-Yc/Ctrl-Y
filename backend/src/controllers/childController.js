const { signToken } = require('../lib/jwt');
const prisma = require("@db");

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

		res.status(201).json({ user_id: childCreate.user_id });
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

exports.getChildPayments = async (req, res) => {
	try {
		const decoded = req.user;

		const { child_id } = req.params;
		const { year } = req.query;

		const parent_id = await prisma.child.findUnique({
			where: { user_id: child_id },
			select: { parent_id: true },
		});

		if (!parent_id || parent_id.parent_id !== decoded.user_id) {
			return res.status(403).json({ message: 'この子供の給与を取得する権限がありません' });
		}

		const result = await prisma.pay.findMany({
			where: {
                user_id: child_id,
                inserted_month: {
                    gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    lte: new Date(`${year}-12-31T23:59:59.999Z`),
                },
            },
		});

		res.status(200).json(result);
	} catch (error) {
		console.error('子供の給与取得エラー:', error);
		res.status(500).json({ message: '子供の給与取得エラー', error: error.message });
	}
}

exports.ChildList = async (req,res) => {
	try {
		const decoded = req.user;

		const child = await prisma.child.findMany({
			where: {
				parent_id: decoded.user_id,
			},
			select: {
				user_id: true,
				c_name: true,
			},
		});

		res.status(200).json(child);
	} catch (error) {
		console.error("子供一覧取得エラー:", error);
		res.status(500).json({ message: "子供一覧取得エラー", error: error.message });
	}
}
