import { useEffect, useState, useCallback, useRef } from "react";
import { ChildTask } from "./ChildTask";
import { PARENT_NOTIFY, TASK_STATUS, TASKS_COLLECTION } from "../../../config/api";
import { apiClient } from "../../../lib/apiClient";
import { getChildToken } from "../../../config/Token";

const STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  WAIT_REVIEW: "WAIT_REVIEW",
  DONE: "DONE",
};

export const ChildTasks = ({ onLoadingChange }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchTasks = useCallback(async () => {
    onLoadingChange?.(true);
    setError(null);
    try {
      const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];
      const res = await apiClient.get(TASKS_COLLECTION(labels));
      if (!mountedRef.current) return;
      const sorted = (res.data ?? []).sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
      setTasks(sorted);
    } catch (err) {
      console.error(err);
      if (mountedRef.current) setError("タスクの取得に失敗しました");
    } finally {
      if (mountedRef.current) onLoadingChange?.(false);
    }
  }, [onLoadingChange]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getNextStatus = (currentStatus) => {
    const values = Object.values(STATUS);
    const normalized = (currentStatus || "").toUpperCase();
    const index = values.indexOf(normalized);
    return index < values.length - 1 ? values[index + 1] : null;
  };

  const nextTaskStatus = async (task) => {
    const next = getNextStatus(task.status);
    if (!next) return;
    onLoadingChange?.(true);
    try {
      await apiClient.patch(TASK_STATUS(task.task_id, next));
      if (next === STATUS.WAIT_REVIEW) {
        try {
          await apiClient.post(PARENT_NOTIFY, { parent_id: getChildToken() });
          console.log("親に通知を送信しました");
        } catch (notifyError) {
          console.error("親への通知送信に失敗しました:", notifyError);
        }
      }
      await fetchTasks(); 
    } catch (error) {
      console.error(error);
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <div className="m-10">
      <h1 className="text-5xl font-bold p-8">おてつだい一覧</h1>

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      <ul className="space-y-3 flex justify-center items-center flex-col">
        {(!tasks || tasks.length === 0) ? (
          <p className="text-center text-gray-400 text-xl">
            現在表示できるおてつだいはありません。
          </p>
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
