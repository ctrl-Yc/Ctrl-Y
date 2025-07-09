import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ChildTask } from "./ChildTask";
import { TASK_STATUS, TASKS_COLLECTION } from "../../../config/api";

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
      const token = localStorage.getItem("token");
      const label = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];

      const response = await axios.get(TASKS_COLLECTION(label), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

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
      const token = localStorage.getItem("token");
      await axios.patch(TASK_STATUS(task.task_id, next), {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
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
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="m-10">
        <h1 className="text-5xl font-bold p-8">おてつだい一覧</h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">現在表示できるおてつだいはありません。</p>
          ) : (
            tasks.map((task) => (
              <div key={task.task_id} className="w-full flex flex-col items-center">
                <ChildTask task={task} onNext={() => nextTaskStatus(task)} />
                {/* ここがモックの承認ボタン   */}
                {task.status === STATUS.WAIT_REVIEW && (
                  <button
                    onClick={() => nextTaskStatus(task)}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 transition"
                  >
                    承認する
                  </button>
                )}
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
