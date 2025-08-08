const { signToken } = require('../lib/jwt');
const prisma = require('@db');
const { handleError, sendSuccessResponse} = require("../utils/responseHandler.js")

exports.createChild = async (req, res) => {
	try {
		const { c_name } = req.body;

		if (!c_name) {
			return handleError(res, 400, '子供の名前が必要です');
		}

		const parent_id = req.user.user_id;

		if (!parent_id) {
			return handleError(res, 401, '認証エラー: 親のIDが取得できません');
		}

		const childCreate = await prisma.child.create({
			data: {
				c_name,
				parent_id,
				registered_at: new Date()
			},
		});

		sendSuccessResponse(res, { message: '子供の登録に成功しました', child_id: childCreate.user_id });
	} catch (error) {
		handleError(res, error, '子供の登録');
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
			return handleError(res, 401, 'あいことばが間違っています');
		}

		const token = signToken(childData.user_id, {
			role: 'child',
			parent_id: childData.parent.user_id,
		});

		sendSuccessResponse(res, { message: '子供のログインに成功しました',
			token,
			child_id: childData.user_id,
			parent_id: childData.parent.user_id,
		});
	} catch (error) {
		handleError(res, error, '子供のログイン');
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
			return handleError(res, 403, 'この子供の給与を取得する権限がありません');
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

		sendSuccessResponse(res, { message: '子供の給与取得に成功しました', result });
	} catch (error) {
		handleError(res, error, '子供の給与取得');
	}
};

exports.ChildList = async (req, res) => {
	try {
		const parent_id = req.user.user_id;

		const child = await prisma.child.findMany({
			where: {
				parent_id,
			},
			select: {
				user_id: true,
				c_name: true,
			},
		});

		console.log("child:", child);

		sendSuccessResponse(res, { message: '子供一覧取得に成功しました', child });
	} catch (error) {
		handleError(res, error, '子供一覧取得');
	}
};
