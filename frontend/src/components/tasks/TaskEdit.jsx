import { useEffect, useState } from "react";
import { taskUrl } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { apiClient } from "../../lib/apiClient";

export const TaskEdit = ({ taskId, setActiveTab }) => {
    const [title, setTitle] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    useEffect(() => {
        const fetchTaskDetail = async () => {
            try {
                const response = await apiClient.get(`${taskUrl(taskId)}`);

                const task = response.data;

                // フォーム初期値をセット
                setTitle(task.t_name);
                setReward(String(task.reward));
                setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
                setMemo(task.memo || '');
            } catch (error) {
                console.error("タスク詳細取得エラー:", error);
                setActiveTab('tasks');
            }
        };

        fetchTaskDetail();
    }, [taskId, setActiveTab]);

    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('tasks');
    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        
        // 必須項目のチェック
        if (!title.trim()) {
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
            await apiClient.patch(`${taskUrl(taskId)}`, {
                t_name: title,
                reward: Number(reward),
                deadline: new Date(deadline),
                memo: memo,
            });
            setActiveTab('tasks');
        } catch (error) {
            toast.error("更新に失敗しました。");
        }
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        if (!window.confirm("このタスクを削除しますか？")) return;

        try {
            await apiClient.delete(`${taskUrl(taskId)}`);
            setActiveTab('tasks');
            toast.success("削除しました！");
            setTimeout(() => {
                setActiveTab('tasks');
            }, 1500);
        } catch {
            toast.error("削除に失敗しました。");
        }
    };

    return (
        <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
            <ToastContainer />
            <div className="m-10">

                <h1 className="text-5xl font-bold p-8">おてつだいの詳細・編集</h1>
                <div className="w-3/5 mx-auto mt-8 space-y-16">
                    <div className="flex mb-8">
                        <p className="text-4xl mr-4">・名前</p>
                        <InputField
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-70 h-11 px-4 text-3xl border bg-white rounded-lg"
                        />
                        <div className="flex ml-auto">
                            <CustomButton
                                type="button"
                                label="削除"
                                onClick={handleDeleteClick}
                                className="w-30 h-12 px-4 text-3xl border rounded-lg bg-red-500 hover:bg-red-400
                                      text-black font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex justify-start items-center space-x-4 mb-8">
                        <p className="text-4xl">・金額</p>
                        <InputField
                            type="number"
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