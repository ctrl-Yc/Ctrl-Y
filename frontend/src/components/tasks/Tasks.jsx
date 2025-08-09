import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./Task";

import { TASK_NOTIFY, TASK_STATUS, TASKS_COLLECTION } from "../../config/api";
import { CustomButton } from "../common/CustomButton";

const STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  WAIT_REVIEW: "WAIT_REVIEW",
  DONE: "DONE",
};

const VAPID_PUBLIC_KEY =
  "BJI-8poQYapHkP_ao98GFzctHKUG-ILAd_4BeBwwTy2PHsbcEMgE4RvWHo9ID-peTlbPY59cNgp2iK3SFigHGDA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const Tasks = ({ setActiveTab, setSelectedTaskId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const labels = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.WAIT_REVIEW];

      const response = await axios.get(TASKS_COLLECTION(labels), {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(
        response.data.sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
      );
    } catch (error) {
      console.error(error);
      setError("タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("プッシュ通知はサポートされていません");
      setIsPermissionGranted(false);
      return;
    }

    navigator.serviceWorker
      .register("sw.js")
      .then(() => {
        console.log("Service Worker登録成功");
        if (Notification.permission === "granted") {
          setIsPermissionGranted(true);
          setShowSendButton(true); 
        }
      })
      .catch((err) => {
        console.error("Service Worker登録失敗:", err);
      });
  }, []);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("通知が許可されませんでした。");
        setIsRequestingPermission(false);
        return;
      }
      console.log("通知が許可されました。");

      const swRegistration = await navigator.serviceWorker.ready;
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log("プッシュ通知の購読に成功しました:", subscription);

      // 購読情報をサーバーに送信
      const response = await axios.post(TASK_NOTIFY, subscription, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("サーバーへの購読情報送信に成功しました。");
        setShowSendButton(true);
        setIsPermissionGranted(true);
      } else {
        console.error("サーバーへの購読情報送信に失敗しました。");
      }
    } catch (error) {
      console.error("処理中にエラーが発生しました:", error);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      const response = await axios.post(TASK_NOTIFY);
      if (response.status === 200) {
        console.log("通知送信リクエスト成功");
      } else {
        console.error("通知送信リクエスト失敗");
      }
    } catch (error) {
      console.error("通知送信リクエストでエラー:", error);
    }
  };

  const handleCreateClick = (e) => {
    e.preventDefault();
    setActiveTab("tasks/create");
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
      await axios.patch(
        TASK_STATUS(task.task_id, next),
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error(error);
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

      {/* 通知許可ボタン */}
      {!isPermissionGranted && (
        <div className="mb-4 flex justify-center">
          <CustomButton
            label={isRequestingPermission ? "許可をリクエスト中..." : "通知を許可する"}
            onClick={handleRequestPermission}
            disabled={isRequestingPermission}
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded"
          />
        </div>
      )}

      {/* 通知送信ボタン */}
      {showSendButton && (
        <div className="mb-6 flex justify-center">
          <CustomButton
            label="サーバーから通知を送信"
            onClick={handleSendNotification}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded"
          />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : error ? (
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
              onApprove={() => {
                nextTaskStatus(task);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
