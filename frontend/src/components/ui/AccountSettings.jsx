import { useState } from "react";
import { InputField } from "./InputField"
import { CustomButton } from "./CustomButton";

export const AccountSettings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        console.log('戻るボタンが押されました');

    }

    // 決定ボタン
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("パスワードと確認用パスワードが一致しません。");
            return;
        }
        // パスワード更新処理
        console.log('決定ボタンが押されました。パスワード変更処理へ');
    };

    return (
        <div>
            <h1>アカウント</h1>
            <p>メールアドレスの変更</p>
            <InputField
                type="email"
                placeholder=""
                value={email}
                onChange={e => setEmail(e.target.value)}
                className=""
            />
            <p>パスワードの変更</p>
            <InputField
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className=""
            />
            <InputField
                type="password"
                placeholder="パスワード(確認)"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className=""
            />
            <CustomButton
                type="button"
                label="戻る"
                onClick={handleBackClick}
                className=''
            />
            <CustomButton
                type="button"
                label="決定"
                onClick={handleSubmitClick}
                className=''
            />
        </div>
    )
}
