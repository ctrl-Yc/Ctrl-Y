import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { TASKS_FINISH_GET, TASKS_INCOMP_GET } from "../../../config/api";
import { ChildTask } from "./ChildTask";
import { CustomButton } from "../../common/CustomButton";

export const ChildTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewingFinished, setIsViewingFinished] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = isViewingFinished ? TASKS_FINISH_GET : TASKS_INCOMP_GET;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setTasks(response.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
    } catch (error) {
      console.error(error);
      setError("タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [isViewingFinished]);

  const completeTask = async (taskId) => {
    try {
      await axios.put(`${taskId}`);
      fetchTasks(); 
    } catch (error) {
      console.error(error);
      alert("完了処理に失敗しました");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleView = (e) => {
    e.preventDefault();
    setIsViewingFinished((prev) => !prev);
  };

  if (loading) return <p className="text-center text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return tasks.length === 0 ? (
    <>
      <p className="text-center text-gray-400">表示できるタスクがありません。</p>
      <div className="mt-6 flex flex-col items-center space-y-4">
        <CustomButton
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300 mx-auto"
        />
      </div>
    </>
  ) : (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="m-10">
        <h1 className="text-5xl font-bold p-8">
          {isViewingFinished ? "完了報告一覧" : "おてつだい一覧"}
        </h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.map((task) => (
            <ChildTask
              key={task.task_id}
              task={task}
              onComplete={() => completeTask(task.task_id)}
            />
          ))}
        </ul>
      </div>

      <div className="my-12 flex justify-center items-center">
        <CustomButton
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
        />
      </div>
    </div>
  );
};
