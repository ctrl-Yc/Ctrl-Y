import { useEffect, useState, useRef } from "react";
import { apiClient } from "../../lib/apiClient";
import { Task } from "./Task";
import { TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";

const STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  WAIT_REVIEW: "WAIT_REVIEW",
  DONE: "DONE",
};

export const Tasks = ({ setActiveTab, setSelectedTaskId, onLoadingChange }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchTasks = async (signal) => {
    onLoadingChange?.(true);
    setError(null);
    try {
      const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];
      const res = await apiClient.get(TASKS_COLLECTION(labels), { signal });
      if (!mountedRef.current) return;
      const sorted = (res.data ?? []).sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
      setTasks(sorted);
    } catch (err) {
      // fetch/axios のキャンセルは無視
      if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
        console.error(err);
        if (mountedRef.current) setError("タスクの取得に失敗しました");
      }
    } finally {
      if (mountedRef.current) onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(controller.signal);
    return () => controller.abort();
    // 初回マウント時だけ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab("tasks/create");
  };

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
      await apiClient.patch(TASK_STATUS(task.task_id, next), {});
      if (!mountedRef.current) return;

      // 状態更新後に一覧をリロード
      const controller = new AbortController();
      await fetchTasks(controller.signal);
      // controller は fetchTasks 内でしか使っていないのでここで abort は不要
    } catch (err) {
      console.error(err);
    } finally {
      if (mountedRef.current) onLoadingChange?.(false);
    }
  };

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold p-8">おてつだい一覧</h1>
        <div className="my-12 flex justify-center items-center space-x-32">
          <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="shadow-lg border-3 border-[#5C410E] rounded-lg w-55 h-15 bg-orange-300 text-white text-2xl font-extrabold hover:bg-orange-200 transition-colors duration-300"
          />
        </div>
      </div>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-400 text-2xl">表示できるタスクがありません。</p>
      ) : (
        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.map((task) => (
            <Task
              key={task.task_id}
              task={task}
              onEdit={() => {
                setSelectedTaskId(task.task_id);
                setActiveTab("tasks/edit");
              }}
              onApprove={() => nextTaskStatus(task)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
