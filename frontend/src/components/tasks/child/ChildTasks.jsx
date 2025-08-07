import { useEffect, useState, useCallback } from "react";

import { ChildTask } from "./ChildTask";
import { TASK_STATUS, TASKS_COLLECTION } from "../../../config/api";
import { apiClient } from "../../../lib/apiClient";

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
      const token = localStorage.getItem("childtoken");
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
      const token = localStorage.getItem("childtoken");
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
      <div className="m-10">
        <h1 className="text-5xl font-bold p-8">おてつだい一覧</h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">現在表示できるおてつだいはありません。</p>
          ) : (
            tasks.map((task) => (
              <div key={task.task_id} className="w-full flex flex-col items-center">
                <ChildTask task={task} onNext={() => nextTaskStatus(task)} />
              </div>
            ))
          )}
        </ul>
      </div>
    );
  };
