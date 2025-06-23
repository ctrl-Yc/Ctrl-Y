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
    <div>
      <h1 className="">{isViewingFinished ? "完了報告一覧" : "おてつだい一覧"}</h1>
      <ul className="space-y-3">
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
      <CustomButton
        type="button"
        label={isViewingFinished ? "もどる" : "完了報告を見る"}
        onClick={handleToggleView}
        className=''
      />
      {!isViewingFinished && (
        <CustomButton
          type="button"
          label="お手伝いを作成"
          onClick={handleCreateClick}
          className=''
        />
      )}
    </div>
  )
}