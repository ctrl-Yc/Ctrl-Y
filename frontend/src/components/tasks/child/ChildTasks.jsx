import { useEffect, useState, useCallback } from "react";
import { ChildTask } from "./ChildTask";
import { PARENT_NOTIFY, TASK_STATUS, TASKS_COLLECTION } from "../../../config/api";
import { apiClient } from "../../../lib/apiClient";
import { getChildToken } from '../../../config/Token';

const STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  WAIT_REVIEW: 'WAIT_REVIEW',
  DONE: 'DONE',
};

export const ChildTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const label = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];
      const response = await apiClient.get(TASKS_COLLECTION(label)); 

      setTasks(
        response.data.sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextStatus = (currentStatus) => {
    const values = Object.values(STATUS);
    const normalized = currentStatus.toUpperCase();
    const index = values.indexOf(normalized);
    return index < values.length - 1 ? values[index + 1] : null;
  };

  const nextTaskStatus = async (task) => {
    const next = getNextStatus(task.status);
    if (!next) return;
    try {
      await apiClient.patch(TASK_STATUS(task.task_id, next));
      if (next === STATUS.WAIT_REVIEW) {
        try {
          await apiClient.post(PARENT_NOTIFY, {
            parent_id: getChildToken(),
          });
          console.log('親に通知を送信しました');
        } catch (notifyError) {
          console.error('親への通知送信に失敗しました:', notifyError);
        }
      }
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <p className="text-center text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
      <div className="p-10 m-15 h-[780px] bg-[url('/images/kokuban.png')] bg-no-repeat bg-cover bg-center flex flex-col">
      {/* タイトル */}
      <h1 className="text-5xl font-bold text-white px-12 pt-12 text-center">おてつだい&nbsp;いちらん</h1>

      {loading ? (
        <p className="text-center p-50 text-2xl text-gray-500">よみこみちゅう...</p>
      ) : error ? (
        <p className="text-center p-50 text-2xl text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center p-50 text-gray-400 text-2xl">
          いまできるおてつだいがないよ<br />
          親におてつだいをつくってもらおう！
        </p>
      ) : (
        <div className="p-15 h-[500px] overflow-y-auto px-10 pb-5 custom-scrollbar">
          <ul className="space-y-3 flex flex-col items-center">
            {tasks.map((task) => (
              <ChildTask
                key={task.task_id}
                task={task}
                onNext={() => nextTaskStatus(task)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
    );
  };
