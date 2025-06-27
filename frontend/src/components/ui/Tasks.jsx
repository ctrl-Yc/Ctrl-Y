import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";
import { CustomButton } from "./CustomButton";
import { TASKS_FINISH_GET, TASKS_INCOMP_GET } from "../../config/api";

export const Tasks = ({ setActiveTab, setSelectedTaskId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewingFinished, setIsViewingFinished] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const endpoint = isViewingFinished ? TASKS_FINISH_GET : TASKS_INCOMP_GET;
        const response = await axios.get(endpoint);
        setTasks(response.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      } catch (error) {
        console.error(error);
        setError("タスクの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isViewingFinished]);

  const handleToggleView = (e) => {
    e.preventDefault();
    setIsViewingFinished(prev => !prev);
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab('tasks/create');
  };

  if (loading) return <p className="text-center text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return tasks.length === 0 ? (
    <>
      <p className="text-center text-gray-400">表示できるタスクがありません。</p>
      <div className="mt-6 flex flex-col items-center space-y-4">
        <CustomButton
          type="button"
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300 mx-auto'
        />
        {!isViewingFinished && (
          <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
          />
        )}
      </div>
    </>
  ) : (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="m-10">

        <h1 className="text-5xl font-bold p-8">
          {isViewingFinished ? "完了報告一覧" : "おてつだい一覧"}
        </h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.map(task => (
            <Task
              key={task.task_id}
              task={task}
              onEdit={() => {
                setSelectedTaskId(task.task_id);
                setActiveTab('tasks/edit');
              }}
            />
          ))}
        </ul>
      </div>
      <div className="my-12 flex justify-center items-center space-x-32">
        <CustomButton
          type="button"
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300'
        />
        {!isViewingFinished && (
          <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
          />
        )}
      </div>

    </div>
  );
};
