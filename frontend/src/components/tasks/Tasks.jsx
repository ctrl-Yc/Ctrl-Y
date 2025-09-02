import { useEffect, useState } from "react";
import { apiClient } from "../../lib/apiClient";
import { Task } from "./Task";

import { TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";

const STATUS = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    WAIT_REVIEW: "WAIT_REVIEW",
    DONE: "DONE",
};

export const Tasks = ({ setActiveTab, setSelectedTaskId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];

            const response = await apiClient.get(TASKS_COLLECTION(labels));

            setTasks(response.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
        } catch (error) {
            console.error(error);
            setError("タスクの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateClick = (e) => {
        e.preventDefault();
        setActiveTab("tasks/create");
    };

    const getNextStatus = (currentStatus) => {
        const values = Object.values(STATUS);
        const normalized = currentStatus.toUpperCase();
        const index = values.indexOf(normalized);
        return index < values.length - 1 ? values[index + 1] : null;
    };

    const nextTaskStatus = async (task) => {
        const next = getNextStatus(task.status);
        if (!next) return;

        try {
            await apiClient.patch(
                TASK_STATUS(task.task_id, next),
                {}
            );
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
    className="p-10 m-15 h-[780px] bg-[url('/images/kokuban.png')] bg-no-repeat bg-cover bg-center flex flex-col"
>
    {/* タイトルとボタンを横並びに */}
    <div className="flex justify-between items-center px-12 pt-12">
        <h1 className="text-5xl font-bold text-white">お手伝い一覧</h1>
        <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="shadow-lg rounded-lg w-65 h-14 bg-orange-300 text-[#5C410E] text-3xl font-extrabold hover:bg-orange-400 transition-colors duration-300"
        />
    </div>

    {loading ? (
        <p className="text-center p-50 text-2xl text-gray-500">読み込み中...</p>
    ) : error ? (
        <p className="text-center p-50 text-2xl text-red-500">{error}</p>
    ) : tasks.length === 0 ? (
        <p className="text-center p-50 text-gray-400 text-2xl">
            表示できるお手伝いがありません。<br />
            子供にお手伝いを作成しましょう！
        </p>
    ) : (
        <div className="p-15 h-[500px] overflow-y-auto px-10 pb-5 custom-scrollbar">
            <ul className="space-y-3 flex flex-col items-center">
                {tasks.map((task) => (
                    <Task
                        key={task.task_id}
                        task={task}
                        onEdit={() => {
                            setSelectedTaskId(task.task_id);
                            setActiveTab("tasks/edit");
                        }}
                        onApprove={() => {
                            nextTaskStatus(task);
                        }}
                    />
                ))}
            </ul>
        </div>
    )}
</div>

    );
};