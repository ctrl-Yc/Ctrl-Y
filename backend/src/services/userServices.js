const bcrypt = require('bcrypt');
const prisma = require('@db');

// パスワードのハッシュ化
const SALT_ROUNDS = 10;
exports.hashPassword = async (password) => {
	try {
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		return hashedPassword;
	} catch (error) {
		console.error('パスワードのハッシュ化エラー:', error);
		throw new Error('パスワードのハッシュ化に失敗しました');
	}
};

// Emailでユーザーを検索
exports.findUserByEmail = async (email) => {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		return user;
	} catch (error) {
		console.error('ユーザー検索エラー:', error);
		throw new Error('ユーザー検索に失敗しました');
	}
};

//パスワードの照合
exports.comparePassword = async (password, hashedPassword) => {
	try {
		const isMatch = await bcrypt.compare(password, hashedPassword);
		return isMatch;
	} catch (error) {
		console.error('パスワード照合エラー:', error);
		throw new Error('パスワード照合に失敗しました');
	}
};
