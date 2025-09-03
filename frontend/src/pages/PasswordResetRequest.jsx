import { useEffect, useState } from "react";
import { InputField } from "../components/common/InputField"
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET_REQUEST } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
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
        if (!email) {
            toast.error("メールアドレスを入力してください。");
            return;
        }

        // メール形式をチェック
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            toast.error("正しいメールアドレス形式を入力してください。");
            return;
        }

        try {
            await apiClient.post(PASS_RESET_REQUEST, { email });
            toast.success("パスワードリセットリンクを送信しました。メールをご確認ください。");
            setIsCooldown(true)
        } catch {
            toast.error("送信に失敗しました。メールアドレスをご確認ください。");
        }
    };

    return (
        <div className="bg-[#FFF877] min-h-screen w-screen"
            style={{
                backgroundImage: "url('/images/back.png')",
                backgroundSize: "cover",      
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }} 
         >
            <ToastContainer />
            <h1 className="text-6xl font-bold text-center w-full py-25">パスワードのリセット</h1>
            <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-2xl text-center">ご入力いただいたメールアドレスにパスワード再設定用のリンクを送ります</p>
                <InputField
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
                />
                <CustomButton
                    type="button"
                    label={isCooldown ? `再送信 (${cooldownTime}s)` : "送信"}
                    onClick={handleSendClick}
                    disabled={isCooldown}
                    className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
                                transition-colors duration-300 mt-4"
                />
            </div>
        </div>
    )
}