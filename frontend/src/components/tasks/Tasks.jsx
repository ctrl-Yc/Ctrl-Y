import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";

import { TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";

// タスクのステータスを定義
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
  const [isViewingFinished, setIsViewingFinished] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const labels = isViewingFinished ? STATUS.WAIT_REVIEW : ['TODO', 'IN_PROGRESS'];

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
  }, [isViewingFinished]);

  const handleToggleView = (e) => {
    e.preventDefault();
    setIsViewingFinished(prev => !prev);
  };

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

  // 承認ボタンの処理
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
  }, [isViewingFinished]);

  if (loading) return <p className="text-center text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return tasks.length === 0 ? (
    <>
      <p className="text-center text-gray-400">表示できるタスクがありません。</p>
      <div className="mt-6 flex flex-col items-center space-y-4">
        <CustomButton
          type="button"
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300 mx-auto'
        />
        {!isViewingFinished && (
          <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
          />
        )}
      </div>
    </>
  ) : (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="m-10">

        <h1 className="text-5xl font-bold p-8">
          {isViewingFinished ? "完了報告一覧" : "おてつだい一覧"}
        </h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.map(task => (
            <Task
              key={task.task_id}
              task={task}
              isViewingFinished={isViewingFinished}
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
      <div className="my-12 flex justify-center items-center space-x-32">
        <CustomButton
          type="button"
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className='w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
          transition-colors duration-300'
        />
        {!isViewingFinished && (
          <CustomButton
            type="button"
            label="お手伝いを作成"
            onClick={handleCreateClick}
            className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
          />
        )}
      </div>

    </div>
  );
};