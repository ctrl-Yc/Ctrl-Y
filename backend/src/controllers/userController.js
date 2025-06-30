// ユーザーがリクエストを送ってきた際のレスポンス用
const userService = require('../services/userServices');
const { signToken } = require('../lib/jwt');
const prisma = require('@prisma');

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
