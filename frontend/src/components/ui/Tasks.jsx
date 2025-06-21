import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks");// エラー回避のため仮のURL、後でURL指定する！！！！！！！！！！！！
        setTasks(response.data);
      } catch (err) {
        setError("タスクの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const visibleTasks = Array.isArray(tasks)
    ? tasks.filter(task => task.s_id !== 3)
    : [];

  return visibleTasks.length === 0 ? (
    <p className="text-center text-gray-400">表示できるタスクがありません。</p>
  ) : (
    <ul className="space-y-3">
      {visibleTasks.map(task => (
        <Task key={task.task_id} task={task} />
      ))}
    </ul>
  )
}
