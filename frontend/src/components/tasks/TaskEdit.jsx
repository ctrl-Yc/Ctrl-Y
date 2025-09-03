import { useEffect, useState } from "react";
import { taskUrl } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from "../../lib/apiClient";

const toLocalInputValue = (value) => {
    if (!value) return "";
    const d = new Date(value);
    // タイムゾーン分を引いてローカル基準にする
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

export const TaskEdit = ({ taskId, setActiveTab, onClose, onUpdated }) => {
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
                toast.error("タスク詳細取得エラー:");
                onClose?.();
                setActiveTab?.("tasks");
            }
        };

        fetchTaskDetail();
    }, [taskId, onClose, setActiveTab]);

    const handleSubmit = async (e) => {
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
            toast.success("更新しました！");
            onUpdated?.();
            if (onClose) return onClose();
            setActiveTab?.("tasks");
        } catch {
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-base font-semibold text-gray-800">おてつだい名</label>
            <InputField
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />

            <label className="block text-base font-semibold text-gray-800">金額</label>
            <div className="flex items-center gap-3">
                <InputField
                    type="number"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="w-40 h-11 px-4 text-lg border rounded bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    min="0"
                />
                <span className="text-lg text-gray-700">（円）</span>
            </div>

            <label className="block text-base font-semibold text-gray-800">期限</label>
            <InputField
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-[280px] h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                min={toLocalInputValue(new Date())}
            />

            <label className="block text-base font-semibold text-gray-800">説明</label>
            <InputField
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />

            <div className="mt-4 flex items-center justify-between">
                <CustomButton
                    type="button"
                    label="削除"
                    onClick={handleDeleteClick}
                    className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-400 disabled:opacity-60"
                />
                <div className="flex gap-3">
                    <CustomButton
                        type="submit"
                        label="更新"
                        className="bg-orange-300 text-black px-4 py-2 rounded hover:bg-orange-200 disabled:opacity-60"
                    />
                </div>
            </div>
        </form>
    )
}