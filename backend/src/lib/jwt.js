// lib/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function signToken(user_id, opts = {}) {
	const payload = {
		user_id,
		timestamp: new Date().toISOString(),
	};

	if (opts.role) payload.role = opts.role;

	return jwt.sign(payload, SECRET);
}

function verifyToken(req) {
	const token = req.body.token || req.headers.authorization?.split(' ')[1];

	if (!token) {
		throw new Error('トークンが見つかりません');
	}

	try {
		return jwt.verify(token, SECRET);
	} catch (err) {
		throw new Error('トークンが無効です');
	}
}

module.exports = {
	verifyToken,
	signToken,
};
