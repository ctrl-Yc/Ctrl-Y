// ユーザーがリクエストを送ってきた際のレスポンス用
const userService = require('../services/userServices');
const { signToken,createPasswordResetToken } = require('../lib/jwt');
const { sendResetPasswordMail,sendPasswordChangeNoticeMail } = require('../lib/mail');
const { handleError, sendSuccessResponse} = require("../utils/responseHandler")
const AppError = require("../utils/AppError.js");
const bcrypt = require('bcrypt');
const prisma = require('@db');

// ユーザー登録
exports.createUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new AppError('EmailとPasswordは必須です', 400);
		}

		// パスワードのハッシュ化
		const hashedPassword = await userService.hashPassword(password);

		// ユーザーの存在確認
		const isEmailExist = await userService.findUserByEmail(email);
		if (isEmailExist) {
			throw new AppError('このEmailはすでに登録されています', 400);
		}

		// ユーザーの登録
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				keyword: '',
				cutoff_day: false,
				pay_day: false,
				registered_at: new Date() 
			},
		});
		if (!user) {
			throw new AppError('ユーザー登録に失敗しました', 500);
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });

		// トークンをレスポンス
		return sendSuccessResponse(res, { message: 'ユーザー登録に成功しました', token });
	} catch (error) {
		handleError(res, error, 'ユーザー登録');
	}
};

// ユーザーログイン
exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new AppError('EmailとPasswordは必須です', 400);
		}

		//DBからユーザーを検索
		const user = await userService.findUserByEmail(email);
		if (!user) {
			throw new AppError('設定されたEmailは存在しません', 400);
		}
		// パスワードの照合
		const passCheck = await userService.comparePassword(password, user.password);
		if (!passCheck) {
			throw new AppError('パスワードが間違っています', 400);
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });
		return sendSuccessResponse(res, { message: 'ログインに成功しました', token });
	} catch (error) {
		handleError(res, error, 'ログイン');
	}
};

// パスワード(忘れたとき用)
exports.rePassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new AppError('ユーザーが見つかりません', 404);
		}

		const token = createPasswordResetToken(user.user_id);
		await sendResetPasswordMail(email, token);

		return sendSuccessResponse(res, { message: 'パスワード再設定用のメールを送信しました' });
	} catch (error) {
		handleError(res, error, 'パスワード再設定');
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const userId = req.user.user_id; 
		const { newPassword } = req.body;

		// 今後実装予定
		// if (!newPassword || newPassword.length < 8) {
		// 	return res.status(400).json({ message: 'パスワードは8文字以上で入力してください' });
		// }

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await prisma.user.update({
			where: { user_id: userId },
			data: { password: hashedPassword },
		});

		return sendSuccessResponse(res, { message: 'パスワードが正常に更新されました' });
	} catch (error) {
		handleError(res, error, 'パスワードリセット');
	}
};


exports.changePassword = async (req, res) => {
	try {
    const userId = req.user.user_id; 
    const { currentPassword, newPassword } = req.body;



    if (!currentPassword || !newPassword) {
		throw new AppError('現在のパスワードと新しいパスワードを入力してください', 400);
    }

    // if (newPassword.length < 8) {
	// 	return res.status(400).json({ message: '新しいパスワードは8文字以上で入力してください' });
    // }

	if (currentPassword === newPassword) {
		throw new AppError('新しいパスワードは現在のパスワードと同じです', 400);
	}


    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
		throw new AppError('ユーザーが見つかりません', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
		throw new AppError('現在のパスワードが間違っています', 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
		where: { user_id: userId },
		data: { password: hashedPassword },
    });

	await sendPasswordChangeNoticeMail(user.email);

    return sendSuccessResponse(res, { message: 'パスワードを変更しました' });
	} catch (error) {
		handleError(res, error, 'パスワード変更');
	}
};


exports.changeChildPass = async (req, res) => {
	try {
		const decoded = req.user;
		const { newKeyword } = req.body;

		if (!newKeyword) {
			throw new AppError('新しいあいことばが必要です', 400);
		}

		await prisma.user.update({
			where: { user_id: decoded.user_id },
			data: { keyword: newKeyword },
		});

		return sendSuccessResponse(res, { message: 'あいことばを更新しました' });
	} catch (error) {
		handleError(res, error, 'あいことば更新');
	}
};