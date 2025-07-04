const { createEmailChangeToken, verifyEmailChangeToken } = require('../lib/jwt');
const { sendEmailChangeMail, sendEmailChangeNotice } = require('../lib/mail');
const prisma = require('../lib/prisma');

exports.requestEmailChange = async (req, res) => {
    try {
    const userId = req.user.user_id;
    const { newEmail } = req.body;

    // 既に使用されていないか確認（任意）
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
        return res.status(400).json({ error: 'このメールアドレスはすでに使用されています。' });
    }

    const token = createEmailChangeToken(userId, newEmail);
    await sendEmailChangeMail(newEmail, token);

    return res.status(200).json({ message: '認証メールを送信しました。' });
    } catch (error) {
    return res.status(500).json({ error: error.message });
    }
};

exports.verifyEmailChange = async (req, res) => {
    try {
    const { token } = req.query;
    const payload = verifyEmailChangeToken(token);

    const user = await prisma.user.findUnique({
        where: { user_id: payload.user_id },
        select: { email: true },
    });

    if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりませんでした。' });
    }

    await prisma.user.update({
        where: { user_id: payload.user_id },
        data: { email: payload.newEmail },
    });

    await sendEmailChangeNotice(user.email, payload.newEmail);

    return res.status(200).json({ message: 'メールアドレスを変更しました。' });
    } catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'トークンの有効期限が切れています。' });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: '無効なトークンです。' });
    }
    return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
    }
};
