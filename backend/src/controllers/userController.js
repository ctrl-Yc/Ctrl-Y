// ユーザーがリクエストを送ってきた際のレスポンス用
const userService = require('../services/userServices');
const { signToken,createPasswordResetToken } = require('../lib/jwt');
const { sendResetPasswordMail,sendPasswordChangeNoticeMail } = require('../lib/mail');
const { handleError, sendSuccessResponse} = require("../utils/responseHandler")
const bcrypt = require('bcrypt');
const prisma = require('@db');

// ユーザー登録
exports.createUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return handleError(res, 400, 'EmailとPasswordは必須です');
		}

		// パスワードのハッシュ化
		const hashedPassword = await userService.hashPassword(password);

		// ユーザーの存在確認
		const isEmailExist = await userService.findUserByEmail(email);
		if (isEmailExist) {
			return handleError(res, 400, 'このEmailはすでに登録されています');
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
			return handleError(res, 500, 'ユーザー登録に失敗しました');
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });

		// トークンをレスポンス
		return sendSuccessResponse(res, 200, 'ユーザー登録に成功しました', { token });
	} catch (error) {
		console.error('ユーザー登録エラー:', error);
		return handleError(res, 500, 'ユーザー登録エラー', error);
	}
};

// ユーザーログイン
exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return handleError(res, 400, 'EmailとPasswordは必須です');
		}

		//DBからユーザーを検索
		const user = await userService.findUserByEmail(email);
		if (!user) {
			return handleError(res, 400, '設定されたEmailは存在しません');
		}
		// パスワードの照合
		const passCheck = await userService.comparePassword(password, user.password);
		if (!passCheck) {
			return handleError(res, 400, 'パスワードが間違っています');
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });
		return sendSuccessResponse(res, 200, 'ログインに成功しました', { token });
	} catch (error) {
		console.error('ログインエラー:', error);
		return handleError(res, 500, 'ログインエラー', error);
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
			return handleError(res, 404, 'ユーザーが見つかりません');
		}

		const token = createPasswordResetToken(user.user_id);
		await sendResetPasswordMail(email, token);

		return sendSuccessResponse(res, 200, 'パスワード再設定用のメールを送信しました');
	} catch (error) {
		console.error('パスワード再設定エラー:', error);
		return handleError(res, 500, 'パスワード再設定エラー', error);
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

		return sendSuccessResponse(res, 200, 'パスワードが正常に更新されました');
	} catch (error) {
		console.error('パスワードリセット失敗:', error);
		return handleError(res, 400, 'パスワードの更新に失敗しました', error);
	}
};


exports.changePassword = async (req, res) => {
	try {
    const userId = req.user.user_id; 
    const { currentPassword, newPassword } = req.body;



    if (!currentPassword || !newPassword) {
		return handleError(res, 400, '現在のパスワードと新しいパスワードを入力してください');
    }

    // if (newPassword.length < 8) {
	// 	return res.status(400).json({ message: '新しいパスワードは8文字以上で入力してください' });
    // }

	if (currentPassword === newPassword) {
		return handleError(res, 400, '新しいパスワードは現在のパスワードと同じです');
	}


    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
		return handleError(res, 404, 'ユーザーが見つかりません');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
		return handleError(res, 401, '現在のパスワードが間違っています');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
		where: { user_id: userId },
		data: { password: hashedPassword },
    });

	await sendPasswordChangeNoticeMail(user.email);

    return sendSuccessResponse(res, 200, 'パスワードを変更しました');
	} catch (error) {
    console.error('パスワード変更エラー:', error);
    return handleError(res, 500, 'パスワード変更中にエラーが発生しました', error);
	}
};


exports.changeChildPass = async (req, res) => {
	try {
		const decoded = req.user;
		const { newKeyword } = req.body;

		if (!newKeyword) {
			return handleError(res, 400, '新しいあいことばが必要です');
		}

		await prisma.user.update({
			where: { user_id: decoded.user_id },
			data: { keyword: newKeyword },
		});

		return sendSuccessResponse(res, 200, 'あいことばを更新しました');
	} catch (error) {
		console.error('あいことば更新エラー:', error);
		return handleError(res, 500, 'あいことば更新エラー', error);
	}
};