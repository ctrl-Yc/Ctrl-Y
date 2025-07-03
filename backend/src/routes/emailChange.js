const express = require('express');
const router = express.Router();
const { createEmailChangeToken, verifyEmailChangeToken } = require('../lib/jwt');
const { sendEmailChangeMail } = require('../lib/mail');
const { sendEmailChangeNotice } = require('../lib/mail');
const auth = require('../middlewares/auth');
const prisma = require('../lib/prisma'); 

// 変更申請受け取り
router.post('/', auth, async (req, res) => {
    try {
    const userId = req.user.user_id; 
    const { newEmail } = req.body;

    const token = createEmailChangeToken(userId, newEmail);
    await sendEmailChangeMail(newEmail, token);

    return res.status(200).json({ message: '認証メールを送信しました。' });
    } catch (error) {
    return res.status(500).json({ error: error.message });
    }
});

router.get('/verify', async (req, res) => {
    try {
    const { token } = req.query;
    const payload = verifyEmailChangeToken(token);

    // 旧メアドの取得
    const user = await prisma.user.findUnique({
    where: { user_id: payload.user_id },
    select: { email: true },
    });

    // 新メアドに更新
    await prisma.user.update({
    where: { user_id: payload.user_id },
    data: { email: payload.newEmail },
    });

    // 旧メールに通知おくりまふ
    await sendEmailChangeNotice(user.email, payload.newEmail);

    return res.status(200).json({ message: 'メールアドレスを変更しました。' });
    } catch (error) {
    return res.status(400).json({ error: '無効または期限切れのトークンです。' });
    }   
});

module.exports = router;
