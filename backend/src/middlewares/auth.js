const { verifyToken } = require('../lib/jwt');

module.exports = function auth(req, res, next) {
	try {
		const authHeader = req.headers.authorization || req.headers.childauthorization;
		if (!authHeader) throw new Error('トークンがありません');

		const token = authHeader?.split(' ')[1];
		req.user = verifyToken(token);
		return next();
	} catch (error) {
		console.error('認証エラー:', error);
		return res.status(401).json({ message: '認証エラー', error: error.message });
	}
};
