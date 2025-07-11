// ユーザーがリクエストを送ってきた際のレスポンス用
const userService = require('../services/userServices');
const { signToken,createPasswordResetToken } = require('../lib/jwt');
const { sendResetPasswordMail,sendPasswordChangeNoticeMail } = require('../lib/mail');
const bcrypt = require('bcrypt');
const prisma = require('@db');

// ユーザー登録
exports.createUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'EmailとPasswordは必須です' });
		}

		// パスワードのハッシュ化
		const hashedPassword = await userService.hashPassword(password);

		// ユーザーの存在確認
		const isEmailExist = await userService.findUserByEmail(email);
		if (isEmailExist) {
			return res.status(400).json({ message: 'このEmailはすでに登録されています' });
		}

		// ユーザーの登録
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				keyword: '',
				cutoff_day: false,
				pay_day: false,
			},
		});
		if (!user) {
			return res.status(500).json({ message: 'ユーザー登録に失敗しました' });
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });

		// トークンをレスポンス
		return res.status(200).json({ token });
	} catch (error) {
		console.error('ユーザー登録エラー:', error);
		return res.status(500).json({ message: 'ユーザー登録エラー', error: error.message });
	}
};

// ユーザーログイン
exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'EmailとPasswordは必須です' });
		}

		//DBからユーザーを検索
		const user = await userService.findUserByEmail(email);
		if (!user) {
			return res.status(400).json({ message: '設定されたEmailは存在しません' });
		}
		// パスワードの照合
		const passCheck = await userService.comparePassword(password, user.password);
		if (!passCheck) {
			return res.status(400).json({ message: 'パスワードが間違っています' });
		}

		// JWTの発行
		const token = signToken(user.user_id, { role: 'parent' });
		return res.status(200).json({ token });
	} catch (error) {
		console.error('ログインエラー:', error);
		return res.status(500).json({ message: 'ログインエラー', error: error.message });
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
			return res.status(404).json({ message: 'ユーザーが見つかりません' });
		}

		const token = createPasswordResetToken(user.user_id);
		await sendResetPasswordMail(email, token);

		res.status(200).json({ message: 'パスワード再設定用のメールを送信しました' });
	} catch (error) {
		console.error('パスワード再設定エラー:', error);
		res.status(500).json({ message: 'パスワード再設定エラー', error: error.message });
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

		res.status(200).json({ message: 'パスワードが正常に更新されました' });
	} catch (error) {
		console.error('パスワードリセット失敗:', error);
		res.status(400).json({ message: 'パスワードの更新に失敗しました', error: error.message });
	}
};


exports.changePassword = async (req, res) => {
	try {
    const userId = req.user.user_id; 
    const { currentPassword, newPassword } = req.body;



    if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: '現在のパスワードと新しいパスワードを入力してください' });
    }

    // if (newPassword.length < 8) {
	// 	return res.status(400).json({ message: '新しいパスワードは8文字以上で入力してください' });
    // }

	if (currentPassword === newPassword) {
		return res.status(400).json({ message: '新しいパスワードは現在のパスワードと同じです' });
	}


    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
		return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
		return res.status(401).json({ message: '現在のパスワードが間違っています' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
		where: { user_id: userId },
		data: { password: hashedPassword },
    });

	await sendPasswordChangeNoticeMail(user.email);

    return res.status(200).json({ message: 'パスワードを変更しました' });
	} catch (error) {
    console.error('パスワード変更エラー:', error);
    return res.status(500).json({ message: 'パスワード変更中にエラーが発生しました' });
	}
};


exports.changeChildPass = async (req, res) => {
	try {
		const decoded = req.user;
		const { newKeyword } = req.body;

		if (!newKeyword) {
			return res.status(400).json({ message: '新しいあいことばが必要です' });
		}

		await prisma.user.update({
			where: { user_id: decoded.user_id },
			data: { keyword: newKeyword },
		});

		res.status(200).json({ message: 'あいことばを更新しました' });
	} catch (error) {
		console.error('あいことば更新エラー:', error);
		res.status(500).json({ message: 'あいことば更新エラー', error: error.message });
	}
};