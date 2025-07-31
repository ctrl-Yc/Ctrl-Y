import { useState } from "react";
import { InputField } from "../components/common/InputField"
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET } from "../config/api";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // URLからトークンを取ってくる
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmitClick = async () => {
        if (!newPassword || !confirmNewPassword) {
            return;
        }

        if (newPassword !== confirmNewPassword) {
            return;
        }

        try {
            await axios.post(PASS_RESET,
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            navigate("/");
        } catch (error) {
            console.error("リセットエラー:", error);
        }
    };

    return (
        <div className="bg-orange-100 h-screen">
            <h1 className="text-6xl font-bold text-center w-full py-25">パスワードのリセット</h1>
            <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-2xl font-bold text-center">新しいパスワードを設定してください</p>
                <InputField
                    type="password"
                    placeholder="新しいパスワード"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-[500px] h-12 px-4 border rounded-lg bg-gray-100 text-base"
                />
                <InputField
                    type="password"
                    placeholder="新しいパスワード(確認)"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-[500px] h-12 px-4 border rounded-lg bg-gray-100 text-base"
                />
                <CustomButton
                    type="button"
                    label="決定"
                    onClick={handleSubmitClick}
                    className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
                                transition-colors duration-300 mt-4"
                />
            </div>
        </div>
    )
}