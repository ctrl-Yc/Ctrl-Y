import { useEffect, useState } from "react";
import { InputField } from "../common/InputField"
import { CustomButton } from "../common/CustomButton";
import { PARENT_EMAIL_CHANGE, PARENT_EMAIL_GET, PARENT_PASS_CHANGE } from "../../config/api";
import { apiClient } from "../../lib/apiClient";

export const AccountSettings = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editField, setEditField] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 現在のメアド取得
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get(PARENT_EMAIL_GET);
                setEmail(response.data.email);
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
                setErrorMessage("プロフィールの取得に失敗しました。再ログインしてください。");
            }
        };
        fetchProfile();
    }, []);

    // パスワード変更処理
    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setErrorMessage("すべてのパスワード項目を入力してください。");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessage("新しいパスワードが一致しません。");
            return;
        }

        try {
            const response = await apiClient.post(PARENT_PASS_CHANGE, {
                currentPassword,
                newPassword
            });

            setSuccessMessage(response.data.message || "パスワードを変更しました。");
            setErrorMessage('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error("パスワード変更エラー:", error);
            setSuccessMessage('');
            setErrorMessage(error.response?.data?.error || "パスワード変更に失敗しました。");
        }
    };



    // メールアドレス編集ボタン処理
    const handleSaveClick = async () => {
        try {
            const response = await apiClient.post(PARENT_EMAIL_CHANGE, { newEmail: email });
            setSuccessMessage(response.data.message || "確認メールを送信しました。");
            setErrorMessage('');
            setEditField(null);
        } catch (error) {
            console.error("変更エラー:", error);
            setSuccessMessage('');
            setErrorMessage(error.response?.data?.error || "変更に失敗しました。");
        }
    };

    // 戻るボタン処理
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('settings');
    }

    return (
        <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold p-16">アカウント</h2>
            </div>
            <div className="mx-20 space-y-4">
                {successMessage && (
                    <div className="p-4 mb-4 text-green-800 bg-green-100 rounded">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="p-4 mb-4 text-red-800 bg-red-100 rounded">
                        {errorMessage}
                    </div>
                )}
                <div className="space-y-4">
                    <p className="text-2xl">メールアドレス</p>
                    <InputField
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={editField !== 'email'}
                        className="mb-12 w-100 h-12 px-4 border rounded-lg bg-white"
                    />
                    {editField === 'email' ? (
                        <div className="space-x-2">
                            <CustomButton
                                type="button"
                                label="決定"
                                onClick={handleSaveClick}
                                className="w-24 h-10 bg-green-500 text-white text-lg font-bold rounded hover:bg-green-400 transition"
                            />
                            <CustomButton
                                type="button"
                                label="キャンセル"
                                onClick={() => setEditField(null)}
                                className="w-24 h-10 bg-gray-400 text-white text-lg font-bold rounded hover:bg-gray-300 transition"
                            />
                        </div>
                    ) : (
                        <CustomButton
                            type="button"
                            label="編集"
                            onClick={() => setEditField('email')}
                            className="w-24 h-10 bg-blue-500 text-white text-lg font-bold rounded hover:bg-blue-400 transition"
                        />
                    )}
                </div>
                <div className="space-y-4 flex flex-col">
                    <p className="text-2xl">パスワードの変更</p>
                    <InputField
                        type="password"
                        placeholder="現在のパスワード"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="mb-8 w-100 h-12 px-4 border rounded-lg bg-white"
                    />

                    {editField === 'password' ? (
                        <CustomButton
                            type="button"
                            label="キャンセル"
                            onClick={() => {
                                setEditField(null);
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                                setErrorMessage('');
                                setSuccessMessage('');
                            }}
                            className="w-24 h-10 bg-gray-400 text-white text-lg font-bold rounded hover:bg-gray-300 transition"
                        />
                    ) : (
                        <CustomButton
                            type="button"
                            label="編集"
                            onClick={() => setEditField('password')}
                            className="w-24 h-10 bg-blue-500 text-white text-lg font-bold rounded hover:bg-blue-400 transition"
                        />
                    )}

                    {editField === 'password' && (
                        <>
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
                            <div className="space-x-4">
                                <CustomButton
                                    type="button"
                                    label="決定"
                                    onClick={handlePasswordChange}
                                    className="w-24 h-10 bg-orange-400 text-white text-lg font-bold rounded hover:bg-orange-300 transition"
                                />
                            </div>
                        </>
                    )}


                </div>
                <div className="mt-8 space-x-12">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={handleBackClick}
                        className='w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                      transition-colors duration-300'
                    />
                </div>

            </div>

        </div>
    )
}