import { useEffect, useState } from "react";
import { InputField } from "../components/common/InputField"
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET_REQUEST } from "../config/api";
import axios from "axios";

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(30);

    // クールタイム処理
    useEffect(() => {
        if (isCooldown) {
            const interval = setInterval(() => {
                setCooldownTime(prev => {
                    // クールタイムが一秒以下になったら再送信できるように
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCooldown(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isCooldown]);

    // 送信ボタン処理
    const handleSendClick = async () => {
        setSuccessMessage('');
        setErrorMessage('');

        if (!email) {
            setErrorMessage("メールアドレスを入力してください。");
            return;
        }

        // メール形式をチェック
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("正しいメールアドレス形式を入力してください。");
            return;
        }

        try {
            await axios.post(PASS_RESET_REQUEST, { email });
            setSuccessMessage("パスワードリセットリンクを送信しました。メールをご確認ください。");
            setIsCooldown(true)
        } catch (error) {
            console.error("送信エラー:", error);
            setErrorMessage("送信に失敗しました。メールアドレスをご確認ください。");
        }
    };

    return (
        <div>
            <h1>パスワードのリセット</h1>
            <p>ご入力いただいたメールアドレスにパスワード再設定用のリンクを送ります</p>
            <InputField
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
            />
            <CustomButton
                type="button"
                label={isCooldown ? `再送信 (${cooldownTime}s)` : "送信"}
                onClick={handleSendClick}
                disabled={isCooldown}
                className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
                       transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
            />

            {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </div>
    )
}