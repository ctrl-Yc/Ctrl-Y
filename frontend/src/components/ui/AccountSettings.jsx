import { useState } from "react";
import { InputField } from "./InputField"
import { CustomButton } from "./CustomButton";

export const AccountSettings = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('settings');
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
        <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold p-16">アカウント</h2>
            </div>
            <div className="mx-20 space-y-4">
                <div className="space-y-4">
                    <p className="text-2xl">メールアドレスの変更</p>
                    <InputField
                        type="email"
                        placeholder=""
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mb-12 w-100 h-12 px-4 border rounded-lg bg-white"
                    />
                </div>
                <div className="space-y-4 flex flex-col">
                    <p className="text-2xl">パスワードの変更</p>
                    <InputField
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="mb-8 w-100 h-12 px-4 border rounded-lg bg-white"
                    />
                    <InputField
                        type="password"
                        placeholder="パスワード(確認)"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="mb-12 w-100 h-12 px-4 border rounded-lg bg-white"
                    />
                </div>
                <div className="mt-8 space-x-12">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={handleBackClick}
                        className='w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                      transition-colors duration-300'
                    />
                    <CustomButton
                        type="button"
                        label="決定"
                        onClick={handleSubmitClick}
                        className='w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                      transition-colors duration-300'
                    />
                </div>

            </div>

        </div>
    )
}
