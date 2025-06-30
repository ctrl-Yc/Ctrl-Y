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

function verifyToken(token) {
	if (!token || token.length > 500) throw new Error('トークンが無効です');

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
