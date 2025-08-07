import { useEffect, useState } from "react";
import { InputField } from "../common/InputField"
import { CustomButton } from "../common/CustomButton";
import { PARENT_EMAIL_CHANGE, PARENT_EMAIL_GET, PARENT_PASS_CHANGE } from "../../config/api";
import { apiClient } from "../../lib/apiClient";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AccountSettings = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [editField, setEditField] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 現在のメアド取得
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("ログイン情報が失効しました。再度ログインしてください。");
                ("/");
                return;
            }

            try {
                const response = await apiClient.get(PARENT_EMAIL_GET);
                setEmail(response.data.email);
            } catch {
                toast.error("プロフィールの取得に失敗しました。再ログインしてください。");
            }
        };
        fetchProfile();
    }, []);

    // パスワード変更処理
    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("すべてのパスワード項目を入力してください。");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("新しいパスワードが一致しません。");
            return;
        }

        try {
            const response = await apiClient.post(PARENT_PASS_CHANGE, {
                currentPassword,
                newPassword
            });

            toast.success(response.data.message || "パスワードを変更しました。");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            toast.error(error.response?.data?.error || "パスワード変更に失敗しました。");
        }
    };



    // メールアドレス編集ボタン処理
    const handleSaveClick = async () => {
        try {
            const response = await apiClient.post(PARENT_EMAIL_CHANGE, { newEmail: email });
            toast.success(response.data.message || "確認メールを送信しました。");
            setEditField(null);
        } catch (error) {
            toast.error(error.response?.data?.error || "変更に失敗しました。");
        }
    };

    // 戻るボタン処理
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('settings');
    }

    return (
        <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold p-16">アカウント</h2>
            </div>
            <div className="mx-20 space-y-4">
                <div className="space-y-4">
                    <p className="text-2xl">メールアドレス</p>
                    <div className=" items-center space-x-2">
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
                </div>
                <div className="space-y-4">
                    <p className="text-2xl">パスワードの変更</p>
                    <div className="flex items-center space-x-2 mb-9">
                    <InputField
                        type="password"
                        placeholder="現在のパスワード"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-100 h-12 px-4 border rounded-lg bg-white"
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
                    </div>
                    {editField === 'password' && (
                        <div className="flex flex-col space-y-4">
                            <InputField
                                type="password"
                                placeholder="新しいパスワード"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="mb-8 w-[400px] h-12 px-4 border rounded-lg bg-white"
                            />
                            <InputField
                                type="password"
                                placeholder="新しいパスワード(確認)"
                                value={confirmNewPassword}
                                onChange={e => setConfirmNewPassword(e.target.value)}
                                className="mb-12 w-[400px] h-12 px-4 border rounded-lg bg-white"
                            />
                            <div className="space-x-4">
                                <CustomButton
                                    type="button"
                                    label="決定"
                                    onClick={handlePasswordChange}
                                    className="w-24 h-10 bg-orange-400 text-white text-lg font-bold rounded hover:bg-orange-300 transition"
                                />
                            </div>
                        </div>
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