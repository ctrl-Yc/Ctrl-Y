import { useEffect, useState } from "react";
import { TASKS_COLLECTION } from "../../../config/api";
import { ChildTask } from "./ChildTask";
import { CustomButton } from "../../common/CustomButton";
import { DateSelector } from "../../ui/DateSelector";
import { isSameDay } from "date-fns";
import { apiClient } from "../../../lib/apiClient";

export const ChildMoneyRecords = ({ setActiveTab }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [doneTasks, setDoneTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoneTasks = async () => {
            try {
                const response = await apiClient.get(TASKS_COLLECTION(["DONE"]));
                setDoneTasks(response.data);
            } catch (error) {
                console.error(error);
                setError("データの取得に失敗しました");
            }
        };

        fetchDoneTasks();
    }, []);

    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab("ChildTasks");
    };

    const filteredTasks = selectedDate
        ? doneTasks.filter((task) => isSameDay(new Date(task.updated_at), selectedDate))
        : doneTasks;

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="m-10">
            <h1 className="text-5xl font-bold p-8">おこづかい記録</h1>
            <div className="p-6">
                <DateSelector
                    selectedDate={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
            </div>

            {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                    完了済みのおてつだいはまだありません。
                </p>
            ) : (
                <ul className="space-y-3 flex justify-center items-center flex-col">
                    {filteredTasks.map((task) => (
                        <ChildTask key={task.task_id} task={task} completedAt={task.deadline} />
                    ))}
                </ul>
            )}

            <CustomButton
                type="button"
                label="戻る"
                onClick={handleBackClick}
                className="fixed bottom-9 left-75 w-30 h-12 px-4 text-3xl border rounded-lg bg-gray-300 hover:bg-gray-200 text-black font-bold shadow-lg"
            />
        </div>
    );
};
