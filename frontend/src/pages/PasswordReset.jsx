import { useState } from "react";
import { InputField } from "../components/common/InputField"

export const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    return (
        <div>
            <InputField
                type="password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="mb-8 w-100 h-12 px-4 border rounded-lg bg-white"
            />
            <InputField
                type="password"
                placeholder="新しいパスワード(確認)"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                className="mb-12 w-100 h-12 px-4 border rounded-lg bg-white"
            />
        </div>
    )
}