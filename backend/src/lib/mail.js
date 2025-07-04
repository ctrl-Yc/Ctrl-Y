// lib/mail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    },
});

async function sendEmailChangeMail(to, token) {
    const encodedToken = encodeURIComponent(token);
    const verifyUrl = `http://localhost:3000/email/verify?token=${encodedToken}`;

    await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'メールアドレス変更認証',
    text: `下記リンクをクリックしてメールアドレス変更を完了してください。\n\n${verifyUrl}\n\n有効期限は1時間です。`,
    });
}

async function sendEmailChangeNotice(oldEmail, newEmail) {
    await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: oldEmail,
    subject: '【Ctrl-Y】メールアドレスが変更されました',
    text: `あなたのアカウントのメールアドレスが以下のように変更されました。\n\n旧メールアドレス: ${oldEmail}\n新メールアドレス: ${newEmail}\n\nもしこの変更に心当たりがない場合は、すぐにご連絡ください。`,
    });
}

module.exports = { 
    sendEmailChangeMail,
    sendEmailChangeNotice
};
