import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";
import { CustomButton } from "./CustomButton";
import { TASKS_ALL_GET } from "/src/config/api"

export const Tasks = ({ setActiveTab }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(TASKS_ALL_GET);// エラー回避のため仮のURL、後でURL指定する！！！！！！！！！！！！
        setTasks(response.data);
        console.log(response.data)
      } catch (err) {
        setError("タスクの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab('tasks/create');
  }

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const visibleTasks = Array.isArray(tasks)
    ? tasks.filter(task => task.s_id !== 3)
    : [];

  return visibleTasks.length === 0 ? (
    <p className="text-center text-gray-400">表示できるタスクがありません。</p>

  ) : (
    <div>
      <h1 className="">おてつだい一覧</h1>
      <ul className="space-y-3">
        {visibleTasks.map(task => (
          <Task key={task.task_id} task={task} />
        ))}
      </ul>
      <CustomButton
        type="button"
        label="完了報告を見る"
        className=''
      />
      <CustomButton
        type="button"
        label="お手伝いを作成"
        onClick={handleCreateClick}
        className=''
      />
    </div>
  )
}
