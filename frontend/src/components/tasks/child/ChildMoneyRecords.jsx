import { useEffect, useState } from "react";
import { TASKS_COLLECTION } from "../../../config/api";
import { ChildTask } from "./ChildTask";
import { DateSelector } from "../../ui/DateSelector";
import { isSameDay } from "date-fns";
import { apiClient } from "../../../lib/apiClient";

export const ChildMoneyRecords = () => {
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

    const filteredTasks = selectedDate
        ? doneTasks.filter((task) => isSameDay(new Date(task.updated_at), selectedDate))
        : doneTasks;

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="m-15 h-[780px] bg-[url('/images/note.png')] bg-no-repeat bg-[length:1425px_800px] bg-center flex flex-col">
            {/* タイトル */}
            <div className="flex justify-between items-center px-20 pt-15">
                <h2 className="text-5xl font-bold p-8">おこづかい記録</h2>
            </div>

            {/* フィルタ（日付セレクタ） */}
            <div className="flex flex-row justify-end mb-8 mr-28 space-x-4 mt-[-60px]">
                <DateSelector
                    selectedDate={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
            </div>

            {/* コンテンツ */}
            {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-3xl mt-30">
                    完了済みのおてつだいはまだありません。
                </p>
            ) : (
                <div className="flex justify-center">
                    <ul className="w-[1100px] max-h-[500px] overflow-y-auto space-y-3 ml-40 ">
                        {filteredTasks.map((task) => (
                            <li
                                key={task.task_id}
                                className="rounded-lg px-4 py-3 shadow-sm"
                            >
                                <ChildTask task={task} completedAt={task.deadline} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};
