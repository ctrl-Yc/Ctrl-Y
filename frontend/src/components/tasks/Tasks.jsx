import { useEffect, useState, useRef, useCallback } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Task } from './Task';
import { TASK_STATUS, TASKS_COLLECTION } from '../../config/api';
import { CustomButton } from '../common/CustomButton';

const STATUS = {
	TODO: 'TODO',
	IN_PROGRESS: 'IN_PROGRESS',
	WAIT_REVIEW: 'WAIT_REVIEW',
	DONE: 'DONE',
};

export const Tasks = ({ setActiveTab, setSelectedTaskId, onLoadingChange }) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
    }, []);

    const fetchTasks = useCallback(async (signal) => {
    onLoadingChange?.(true);
    setError(null);
    try {
        const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];
        const res = await apiClient.get(TASKS_COLLECTION(labels), { signal });
        if (!mountedRef.current) return;
        const sorted = (res.data ?? []).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setTasks(sorted);
    } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        console.error(err);
        if (mountedRef.current) setError("タスクの取得に失敗しました");
        }
    } finally {
        if (mountedRef.current) onLoadingChange?.(false);
    }
    }, [onLoadingChange]);

    useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller.signal);
    return () => controller.abort();
    }, [fetchTasks]);

    const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab("tasks/create");
    };

    const getNextStatus = (currentStatus) => {
    const values = Object.values(STATUS);
    const normalized = (currentStatus || "").toUpperCase();
    const index = values.indexOf(normalized);
    return index < values.length - 1 ? values[index + 1] : null;
    };

    const nextTaskStatus = async (task) => {
    const next = getNextStatus(task.status);
    if (!next) return;

    onLoadingChange?.(true);
    try {
        await apiClient.patch(TASK_STATUS(task.task_id, next), {});
        if (!mountedRef.current) return;
        await fetchTasks();
    } catch (err) {
        console.error(err);
    } finally {
        if (mountedRef.current) onLoadingChange?.(false);
    }
    };

    return (
    <div className="
            h-[1580px] w-[725px] bg-[url('/images/mobile_note.png')] bg-no-repeat bg-center bg-[length:730px_1400px] mt-5
            md:p-10 md:m-15 md:h-full md:w-full md:bg-[url('/images/kokuban.png')] md:bg-no-repeat md:bg-[length:100%_100%] md:bg-center flex flex-col

        ">
        <div className="
            md:flex md:justify-between md:items-center md:px-12 md:pt-12
            flex justify-between items-center px-20 pt-68
        ">
        <h1 className="
                md:text-5xl  md:text-white
                text-4xl font-bold 
            ">おてつだい一覧</h1>
            <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="
                shadow-lg rounded-lg w-65 h-14 bg-orange-300 text-[#5C410E] text-3xl font-extrabold hover:bg-orange-400 transition-colors duration-300"
            />
        </div>

        {error ? (
        <p className="text-center p-50 text-2xl text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
        <p className="text-center p-50 text-gray-400 text-2xl">
            表示できるお手伝いがありません。<br />
            子供にお手伝いを作成しましょう！
        </p>
        ) : (
        <div className="
                        md:p-15 md:h-[550px]  md:px-10 md:pb-5 md:custom-scrollbar
                        h-[calc(100vh-300px)] overflow-y-auto mt-5
                    ">
            <ul className="space-y-3 flex flex-col items-center">
                {tasks.map((task) => (
                    <Task
                    key={task.task_id}
                    task={task}
                    onEdit={() => {
                        setSelectedTaskId(task.task_id);
                        setActiveTab("tasks/edit");
                    }}
                    onApprove={() => nextTaskStatus(task)}
                    />
                ))}
            </ul>
        </div>
        )}
    </div>
    );
};
