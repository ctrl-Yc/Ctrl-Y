import { useState } from "react";
import { TASKS_BASE } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { apiClient } from "../../lib/apiClient";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TaskCreate = ({ setActiveTab }) => {
    const [name, setName] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('tasks');
    };

    // 決定ボタン
    const handleSubmitClick = async (e) => {
        e.preventDefault();

        // 必須項目のチェック
        if (!name.trim()) {
            toast.error("名前を入力してください。");
            return;
        }

        if (!reward.trim()) {
            toast.error("金額を入力してください。");
            return;
        }

        if (!deadline) {
            toast.error("期日を入力してください。");
            return;
        }

        // バリデーションチェック
        if (Number(reward) < 0) {
            toast.error("金額には0以上の数値を入力してください。");
            return;
        }

        if (deadline && new Date(deadline) < new Date()) {
            toast.error("期日には未来の日時を指定してください。");
            return;
        }

        try {
            await apiClient.post(TASKS_BASE,
                {
                    t_name: name,
                    memo: memo,
                    reward: Number(reward),
                    deadline,
                }
            );
            toast.success("おてつだいを登録しました！");
            setTimeout(() => {
                setActiveTab('tasks');
            }, 1500);
        } catch {
            toast.error("登録に失敗しました。");
        }
    };

    return (
        <div className="p-10 m-15 h-[780px] bg-[url('/images/kokuban.png')] bg-no-repeat bg-cover bg-center flex flex-col">
            <ToastContainer />
            <div className="m-10">
                <h1 className="text-5xl font-bold p-8">おてつだいの作成</h1>
                <div className="w-3/5 mx-auto mt-8 space-y-16">
                    <div className="flex mb-8">
                        <p className="text-4xl mr-4">・名前</p>
                        <InputField
                            type="text"
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-70 h-11 px-4 text-3xl border bg-white rounded-lg"
                        />
                    </div>
                    <div className="flex justify-start items-center space-x-4 mb-8">
                        <p className="text-4xl">・金額</p>
                        <InputField
                            type="number"
                            placeholder=""
                            value={reward}
                            onChange={e => setReward(e.target.value)}
                            className="w-30 h-11 px-4 text-3xl border bg-white rounded-lg"
                            min="0"
                        />
                        <span className="text-4xl">（円）</span>
                    </div>

                    <div className="flex justify-start items-center space-x-4 mb-8">
                        <p className="text-4xl">・期限</p>
                        <InputField
                            type="datetime-local"
                            placeholder=""
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="text-2xl w-67 h-11 px-4 border bg-white rounded-lg"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>

                    <div className="flex justify-start space-x-4 mb-8">
                        <p className="text-4xl">・説明</p>
                        <InputField
                            type="text"
                            placeholder=""
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            className="text-2xl w-3/5 h-11 px-4 border bg-white rounded-lg"
                        />
                    </div>

                </div>
                <div className="w-3/5 mt-24 flex justify-between mx-auto">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={handleBackClick}
                        className="w-30 h-12 px-4 text-3xl border rounded-lg bg-gray-300 hover:bg-gray-200
                                      text-black font-bold"
                    />
                    <CustomButton
                        type="button"
                        label="決定"
                        onClick={handleSubmitClick}
                        className="w-30 h-12 px-4 text-3xl border rounded-lg bg-orange-300 hover:bg-orange-200
                                      text-black font-bold"
                    />
                </div>

            </div>
        </div>
    )
}