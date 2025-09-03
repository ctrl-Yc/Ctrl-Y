import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient";
import { taskUrl, TASK_STATUS } from "../../../config/api";
import { CustomButton } from "../../common/CustomButton";
import { toast } from "react-toastify";

const labelMap = {
    TODO: "はじめる",
    IN_PROGRESS: "できた!",
    WAIT_REVIEW: "まってね",
    DONE: "完了",
};

const NEXT = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "WAIT_REVIEW",
};

export const ChildTaskDetail = ({ taskId, onClose, onUpdated }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient.get(taskUrl(taskId));
            setTask(data);
        } catch (e) {
            toast.error("詳細の取得に失敗しました");
            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) load();
    }, [taskId]);

    const handleAdvance = async () => {
        if (!task) return;
        const next = NEXT[task.status];
        if (!next) return;

        try {
            setLoading(true);
            await apiClient.patch(TASK_STATUS(task.task_id, next), {});
            toast.success("状態を更新しました");
            onUpdated?.();
            onClose?.();
        } catch {
            toast.error("更新に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    if (!task) {
        return (
            <div className="py-6 text-center text-gray-600">
                {loading ? "読み込み中..." : "データがありません"}
            </div>
        );
    }

    const canAdvance = !!NEXT[task.status];
    const deadlineText = task.deadline
        ? new Date(task.deadline).toLocaleString("ja-JP", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "（未設定）";

    return (
        <form className="space-y-4">
            <label className="block text-base font-semibold text-gray-800">おてつだい名</label>
            <div className="w-full h-11 px-4 text-lg border rounded bg-white flex items-center">
                {task.t_name}
            </div>

            <label className="block text-base font-semibold text-gray-800">説明</label>
            <div className="w-full min-h-11 px-4 py-2 text-lg border rounded bg-white break-words">
                {task.memo || "（なし）"}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-base font-semibold text-gray-800">期限</label>
                    <div
                        className="w-full h-11 px-4 text-lg border rounded bg-white flex items-center truncate"
                        title={deadlineText}
                    >
                        {deadlineText}
                    </div>
                </div>
                <div>
                    <label className="block text-base font-semibold text-gray-800">金額</label>
                    <div className="w-full h-11 px-4 text-lg border rounded bg-white flex items-center">
                        <span className="font-bold text-green-600">¥{task.reward}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-3">
                    <CustomButton
                        type="button"
                        label={labelMap[task.status] || "進む"}
                        onClick={handleAdvance}
                        disabled={!canAdvance || loading}
                        className="bg-orange-300 text-black px-4 py-2 rounded hover:bg-orange-200 disabled:opacity-60"
                    />
                </div>
            </div>
        </form>
    );
};
