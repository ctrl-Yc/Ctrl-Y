// lib/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;


function signToken(user_id, opts = {}) {
	const payload = {
		user_id,
		timestamp: new Date().toISOString(),
	};

	if (opts.role) payload.role = opts.role;
	if (opts.parent_id) payload.parent_id = opts.parent_id;

	return jwt.sign(payload, SECRET);
}

function verifyToken(token) {
	if (!token || token.length > 500) throw new Error('トークンが無効です');

	try {
		return jwt.verify(token, SECRET);
	} catch (error) {
		throw new Error('トークンが無効です');
	}
}

// メールアドレス変更用トークン発行（有効期限1時間）
function createEmailChangeToken(user_id, newEmail) {
	const payload = { user_id, newEmail };
	return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}


// メールアドレス変更用トークン検証
function verifyEmailChangeToken(token) {
	if (!token || token.length > 500) throw new Error('トークンが無効です');

	try {
    return jwt.verify(token, SECRET);
	} catch (error) {
    throw new Error('トークンが無効または期限切れです');
	}
}


// パスワードリセット用トークン発行（有効期限15分）
function createPasswordResetToken(user_id) {
	const payload = { user_id };
	return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

// パスワードリセット用トークン検証
function verifyPasswordResetToken(token) {
	if (!token || token.length > 500) throw new Error('トークンが無効です');

	try {
		return jwt.verify(token, SECRET);
	} catch (error) {
		throw new Error('トークンが無効または期限切れです');
	}
}

module.exports = {
	verifyToken,
	signToken,
	createEmailChangeToken,
	verifyEmailChangeToken,
	createPasswordResetToken,
	verifyPasswordResetToken,
};
