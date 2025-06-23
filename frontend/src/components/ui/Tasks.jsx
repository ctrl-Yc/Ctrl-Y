import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";
import { CustomButton } from "./CustomButton";
import { TASKS_ALL_GET } from "/src/config/api"

export const Tasks = () => {
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

  const handleClick = (e) => {
    e.preventDefault();
    console.log('ボタンが押されました');
  }

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const visibleTasks = Array.isArray(tasks)
    ? tasks.filter(task => task.s_id !== 3)
    : [];

  return visibleTasks.length === 0 ? (
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
