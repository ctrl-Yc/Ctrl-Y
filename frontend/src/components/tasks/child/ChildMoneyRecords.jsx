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
        <div className="
            m-15 h-[780px] w-[calc(100%-2rem)] bg-[url('/images/note.png')] bg-no-repeat bg-center flex flex-col
            md:h-full md:w-full md:bg-[length:100%_100%]
            bg-[length:730px_1400px]
        ">
            {/* タイトル */}
            <div className="
                flex justify-between items-center px-20 pt-15 mt-2
                md:px-20 md:pt-15 md:mt-2
                px-10 pt-10 mt-2
            ">
                <h2 className="
                    text-5xl font-bold p-8
                    md:text-5xl md:font-bold md:p-8
                    text-3xl font-bold p-4
                ">おこづかい記録</h2>
            </div>

            {/* フィルタ（日付セレクタ） */}
            <div className="
                flex flex-row justify-end mb-8 mr-28 space-x-4 mt-[-60px]
                md:flex md:flex-row md:justify-end md:mb-8 md:mr-28 md:space-x-4 md:mt-[-60px]
                flex flex-row justify-center mb-4 mr-4 space-x-2 mt-[-40px]
            ">
                <DateSelector
                    selectedDate={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
            </div>

            {/* コンテンツ */}
            {filteredTasks.length === 0 ? (
                <p className="
                    text-center text-gray-400 py-10 text-3xl mt-30
                    md:text-center md:text-gray-400 md:py-10 md:text-3xl md:mt-30
                    text-center text-gray-400 py-5 text-xl mt-20
                ">
                    完了済みのおてつだいはまだありません。
                </p>
            ) : (
                <div className="
                    flex justify-center
                    md:flex md:justify-center
                    flex justify-center
                ">
                    <ul className="
                        w-[1100px] max-h-[500px] overflow-y-auto space-y-3 ml-40
                        md:w-[1100px] md:max-h-[500px] md:overflow-y-auto md:space-y-3 md:ml-40
                        w-full max-h-[400px] overflow-y-auto space-y-2 ml-4 mr-4
                    ">
                        {filteredTasks.map((task) => (
                            <li
                                key={task.task_id}
                                className="
                                    rounded-lg px-4 py-3 shadow-sm
                                    md:rounded-lg md:px-4 md:py-3 md:shadow-sm
                                    rounded-lg px-2 py-2 shadow-sm
                                "
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
