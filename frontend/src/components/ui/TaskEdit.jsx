import { useEffect, useState } from "react";
import { CustomButton } from "./CustomButton";
import { InputField } from "./InputField";
import axios from "axios";
import { TASK_DELETE_API, TASK_ONE_GET, TASK_UPDATE_API } from "../../config/api";

export const TaskEdit = ({ taskId, setActiveTab }) => {
    const [title, setTitle] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    useEffect(() => {
        const fetchTaskDetail = async () => {
            try {
                const response = await axios.get(`${TASK_ONE_GET}${taskId}`);
                const task = response.data;

                // フォーム初期値をセット
                setTitle(task.t_name);
                setReward(task.reward);
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
        try {
            await axios.patch(`${TASK_UPDATE_API}${taskId}`, {
                t_name: title,
                reward: Number(reward),
                deadline: new Date(deadline),
                memo: memo,
            });
            setActiveTab('tasks');
        } catch (error) {
            console.error("更新エラー:", error);
        }
    };

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        if (!window.confirm("このタスクを削除しますか？")) return;
        try {
            await axios.delete(`${TASK_DELETE_API}${taskId}`);
            setActiveTab('tasks');
        } catch (error) {
            console.error("削除エラー:", error);
        }
    };

    return (
        <div>
            <h1>おてつだいの詳細・編集</h1>
            <p>・名前</p>
            <InputField
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <CustomButton
                type="button"
                label="削除"
                onClick={handleDeleteClick}
            />
            <p>・金額</p>
            <InputField
                type="number"
                value={reward}
                onChange={e => setReward(e.target.value)}
            />
            （円）
            <p>・期限</p>
            <InputField
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />
            <p>・説明</p>
            <InputField
                type="text"
                value={memo}
                onChange={e => setMemo(e.target.value)}
            />
            <CustomButton
                type="button"
                label="戻る"
                onClick={handleBackClick}
            />
            <CustomButton
                type="button"
                label="決定"
                onClick={handleSubmitClick}
            />
        </div>
    )
}