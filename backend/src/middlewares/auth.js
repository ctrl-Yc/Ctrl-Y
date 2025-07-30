const { verifyToken } = require('../lib/jwt');

module.exports = function auth(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			console.log('認証エラー: Authorizationヘッダーがありません');
			return res
				.status(401)
				.json({ message: '認証が必要です', error: 'Authorizationヘッダーがありません' });
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			console.log('認証エラー: トークンがありません');
			return res
				.status(401)
				.json({ message: '認証が必要です', error: 'トークンがありません' });
		}

		req.user = verifyToken(token);
		return next();
	} catch (error) {
		console.error('認証エラー:', error.message);
		return res.status(401).json({ message: '認証エラー', error: error.message });
	}
};
