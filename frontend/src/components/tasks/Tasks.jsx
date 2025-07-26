import { useEffect, useState } from "react";
import { Task } from "./Task";

import { TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { buttonStyles } from "../ui/Color";
import { TaskCreate } from "./TaskCreate";
import { api } from "../../api";

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
    const [open, setOpen] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];

            const response = await api.get(TASKS_COLLECTION(labels));

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
        setOpen(true);
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
            await api.patch(TASK_STATUS(task.task_id, next));
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-10 mt-5">
            <div className=" flex justify-between items-center">
                <h1 className="text-5xl font-bold p-8 text-[#2c3e50]">おてつだい一覧</h1>
                <div className="my-12 flex justify-center items-center space-x-32">
                    <CustomButton
                        type="button"
                        label="お手伝いを作成"
                        onClick={handleCreateClick}
                        className={`${buttonStyles} shadow-lg border-3 border-[#5C410E] rounded-2xl w-55 h-15  text-white text-2xl font-extrabold hover:bg-orange-200 transition-colors duration-300`}
                    />
                </div>
            </div>
            {loading ? (
                <p className="text-center text-gray-500">読み込み中...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : tasks.length === 0 ? (
                <p className="text-center text-gray-400 text-2xl">表示できるタスクがありません。</p>
            ) : (
                <>
                    <ul className="space-y-3 flex justify-center items-center flex-col">
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
                </>
            )}
            <TaskCreate open={open} setOpen={setOpen} fetchTasks={fetchTasks}/>
        </div>
    );
};
