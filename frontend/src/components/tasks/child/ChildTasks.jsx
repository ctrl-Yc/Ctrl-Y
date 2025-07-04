import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ChildTask } from "./ChildTask";
import { CustomButton } from "../../common/CustomButton";
import { TASKS_COLLECTION } from "../../../config/api";
import { STATUS_TASK } from "../../../config/api";

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
  const [isViewingFinished, setIsViewingFinished] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const label = isViewingFinished ? [STATUS.WAIT_REVIEW, STATUS.DONE] : [STATUS.TODO, STATUS.IN_PROGRESS];

      const response = await axios.get(TASKS_COLLECTION(label), {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
      setTasks(
        response.data.sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        )
      );
    } catch (error) {
      console.error(error);
      setError("タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }

  }, [isViewingFinished]);


  const getNextStatus = (currentStatus) => {
    const values = Object.values(STATUS)
    const normalized = currentStatus.toUpperCase();
    const index = values  .indexOf(normalized);
    return index < values.length - 1 ? values[index + 1] : null;
  };

  const nextTaskStatus = async (task) => {
    const next = getNextStatus(task.status);
    if (!next) {
        console.warn("ステータスが見つからない", task.status);
      return;
    }

    try {
      const token = localStorage.getItem("token")
      console.log("送信するステータス:", next);
      await axios.patch(STATUS_TASK(task.task_id,next), {},{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("成功");
      fetchTasks(); 
    } catch (error) {
      console.error(error);
      if (error.response) {
      console.error("レスポンスデータ:", error.response.data);
      console.error("ステータスコード:", error.response.status);
      console.error("レスポンスヘッダー:", error.response.headers);
    } else if (error.request) {
      console.error("リクエスト:", error.request);
    } else {

      console.error("エラーメッセージ:", error.message);
    }

    alert("完了処理に失敗しました");
  }
};



  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleView = (e) => {
    e.preventDefault();
    setIsViewingFinished((prev) => !prev);
  };

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
        </div>
    </>
  ) : (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="m-10">
        <h1 className="text-5xl font-bold p-8">
          {isViewingFinished ? "完了報告一覧" : "おてつだい一覧"}
        </h1>

        <ul className="space-y-3 flex justify-center items-center flex-col">
          {tasks.map((task) => (
            <ChildTask
              key={task.task_id}
              task={task}
              onNext={() => nextTaskStatus(task)}
            />
          ))}
        </ul>
      </div>

      <div className="my-12 flex justify-center items-center">
        <CustomButton
          label={isViewingFinished ? "もどる" : "完了報告を見る"}
          onClick={handleToggleView}
          className="w-45 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300"
        />
      </div>
    </div>
  );
};
