import { useState } from "react";
import { InputField } from "../components/common/InputField"
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET } from "../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

export const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // URLからトークンを取ってくる
    const queryParams = new URLSearchParams(location.search);
    queryParams.get("token");

    const handleSubmitClick = async () => {
        if (!newPassword || !confirmNewPassword) {
            return;
        }

        if (newPassword !== confirmNewPassword) {
            return;
        }

        try {
            await api.post(PASS_RESET,{ newPassword });
            navigate("/");
        } catch (error) {
            console.error("リセットエラー:", error);
        }
    };

    return (
        <div>
            <h1>パスワードのリセット</h1>
            <p>新しいパスワードを設定してください</p>
            <InputField
                type="password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />
            <InputField
                type="password"
                placeholder="新しいパスワード(確認)"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
            />
            <CustomButton
                type="button"
                label="決定"
                onClick={handleSubmitClick}
            />
        </div>
    )
}