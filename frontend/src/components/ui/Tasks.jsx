import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";
import { CustomButton } from "./CustomButton";
import { TASKS_FINISH_GET, TASKS_INCOMP_GET } from "../../config/api";

export const Tasks = ({ setActiveTab }) => {
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
        setTasks(response.data);
      } catch (err) {
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
  }

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return tasks.length === 0 ? (
    <p className="text-center text-gray-400">表示できるタスクがありません。</p>
  ) : (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <h1 className="text-5xl font-bold p-16">おてつだい一覧</h1>
      <div>
        <ul className="w-3/4 space-y-8 space-y-2 mx-auto">
          {visibleTasks.map(task => (
            <Task key={task.task_id} task={task} />
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center space-y-4 my-8">
        <CustomButton
          type="button"
          label="完了報告を見る"
          onClick={handleClick}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300 mx-auto'
        />
        <CustomButton
          type="button"
          label="お手伝いを作成"
          onClick={handleClick}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300 mx-auto'
        />
      </div>
    </div>
  )
}