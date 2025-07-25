import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";

import { TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";

const STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  WAIT_REVIEW: 'WAIT_REVIEW',
  DONE: 'DONE',
};

export const Tasks = ({ setActiveTab, setSelectedTaskId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];

      const response = await axios.get(TASKS_COLLECTION(labels), {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setTasks(
        response.data.sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        )
      )
    } catch (error) {
      console.error(error);
      setError("タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab('tasks/create');
  };

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


  return (
    <div className="bg-orange-100 rounded-xl h-full">
      <h1 className="text-3xl font-bold text-center pt-6 mx-auto md:text-5xl md:pt-10">おてつだい一覧</h1>

      {loading ? (
        <p className="md:text-center text-gray-500">読み込み中...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <>
          <p className="text-center text-gray-400 md:text-xl">表示できるタスクがありません。</p>
          <div className="h-full mx-auto md:w-2/3">
            <div className="flex justify-end my-6 md:my-12">
              <CustomButton
                type="button"
                label="おてつだいを作成"
                onClick={handleCreateClick}
                className="w-60 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300 align-right"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-full mx-auto w-15/16 md:w-2/3">
            <div className="flex justify-end my-6 md:my-12">
              <CustomButton
                type="button"
                label="おてつだいを作成"
                onClick={handleCreateClick}
                className="w-45 h-12 bg-orange-300 text-black font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300 md:text-2xl md:h-15"
              />
            </div>

            <ul className="space-y-3 flex justify-center items-center flex-col">
              {tasks.map(task => (
                <Task
                  key={task.task_id}
                  task={task}
                  onEdit={() => {
                    setSelectedTaskId(task.task_id);
                    setActiveTab('tasks/edit');
                  }}
                  onApprove={() => {
                    nextTaskStatus(task);
                  }}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
};