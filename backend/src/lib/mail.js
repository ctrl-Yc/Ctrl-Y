// lib/mail.js
const { BASE_URL } = require("../index");
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
    const verifyUrl = `${BASE_URL}/email/verify?token=${encodedToken}`;

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


async function sendResetPasswordMail(to, token) {
    const encodedToken = encodeURIComponent(token);
	const resetUrl = `${BASE_URL}/reset?token=${encodedToken}`;

	const mailOptions = {
		from: process.env.MAIL_USER,
		to,
		subject: '【Ctrl+Y】パスワード再設定のご案内',
		text: `以下のリンクからパスワードの再設定を行ってください。\n\n${resetUrl}\n\n※このリンクは15分間のみ有効です。`,
	};

	await transporter.sendMail(mailOptions);
};


async function sendPasswordChangeNoticeMail(to) {
    const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: '【Ctrl+Y】パスワード変更通知',
    text: `このメールは、あなたのアカウントのパスワードが変更されたことをお知らせするために送信されています。\n\nもしあなたがこの操作を行っていない場合は、速やかにご連絡ください。`,
    };

    await transporter.sendMail(mailOptions);
}
module.exports = { 
    sendEmailChangeMail,
    sendEmailChangeNotice,
    sendResetPasswordMail,
    sendPasswordChangeNoticeMail
};
