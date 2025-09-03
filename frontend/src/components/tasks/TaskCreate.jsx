import { useState } from "react";
import { TASKS_BASE } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import { apiClient } from "../../lib/apiClient";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TaskCreate = ({ setActiveTab, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    // 決定ボタン
    const handleSubmitClick = async (e) => {
        e.preventDefault();

        // 必須項目のチェック
        if (!name.trim()) {
            toast.error("おてつだい名を入力してください。");
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

            if (onCreated) onCreated();
            if (onClose) return onClose();

            setTimeout(() => setActiveTab('tasks'), 800);
            setTimeout(() => {
                setActiveTab('tasks');
            }, 1500);
        } catch {
            toast.error("登録に失敗しました。");
        }
    };

    return (
        <form onSubmit={handleSubmitClick} className="space-y-4">
            {/* おてつだい名 */}
            <label className="block text-base font-semibold text-gray-800">おてつだい名</label>
            <InputField
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />

            {/* 金額 */}
            <label className="block text-base font-semibold text-gray-800">金額</label>
            <div className="flex items-center gap-3">
                <InputField
                    type="number"
                    placeholder=""
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="w-40 h-11 px-4 text-lg border rounded bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    min="0"
                />
                <span className="text-lg text-gray-700">（円）</span>
            </div>

            {/* 期限 */}
            <label className="block text-base font-semibold text-gray-800">期限</label>
            <InputField
                type="datetime-local"
                placeholder=""
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-[280px] h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
            />

            {/* 説明 */}
            <label className="block text-base font-semibold text-gray-800">説明</label>
            <InputField
                type="text"
                placeholder=""
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-11 px-4 text-lg border rounded bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />

            {/* フッター（子供追加と同じ配色・位置） */}
            <div className="mt-4 flex justify-end space-x-4">
                <CustomButton
                    type="submit"
                    label="追加"
                    className="bg-orange-300 text-black px-4 py-2 rounded hover:bg-orange-200"
                />
            </div>
        </form>
    )
}