import { useState,useEffect } from "react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { CustomButton } from "../common/CustomButton";
import { apiClient } from "../../lib/apiClient";
import { PARENT_SUBSCRIBE,  } from "../../config/api";

export const NoticeSettings = ({ setActiveTab }) => {

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

  const [cutoffNoticeOn, setCutoffNoticeOn] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  //通知
  useEffect(() => {

      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("プッシュ通知はサポートされていません");
        setIsPermissionGranted(false);
        return;
      }

      const toggleSave = localStorage.getItem("Notification");
      if (toggleSave !== null) {
        setCutoffNoticeOn(toggleSave === "true");
      } else {
        navigator.serviceWorker
        .register("sw.js")
        .then(() => {
          console.log("Service Worker登録成功");
          if (Notification.permission === "granted") {
            setIsPermissionGranted(true);
          }
        })
        .catch((err) => {
          console.error("Service Worker登録失敗:", err);
        });
      }
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
          const response = await apiClient.post(PARENT_SUBSCRIBE, subscription );
        if (response.status === 201) {
          console.log("サーバーへの購読情報送信に成功しました。");
          setIsPermissionGranted(true);
          console.log("通知ON");
        } else {
          console.error("サーバーへの購読情報送信に失敗しました。");
        }
      } catch (error) {
        console.error("処理中にエラーが発生しました:", error);
      } finally {
        setIsRequestingPermission(false);
      }
    };

    const handleDeleteSubscription = async () => {
      try {
        const swRegistration = await navigator.serviceWorker.ready;
        const subscription = await swRegistration.pushManager.getSubscription();
        if (subscription) {
          //購読情報を削除
          await apiClient.patch(PARENT_SUBSCRIBE);
          await subscription.unsubscribe();
          console.log("購読情報解除に成功しました");
        } else {
          console.log("購読情報がない");
        }
        setIsPermissionGranted(false);
        console.log("通知OFF");
      } catch (error) {
        console.error("購読情報解除に失敗しました:", error)
      }
    };

    const handleToggleChange = async (e) => {
    const checked = e.target.checked;
    setCutoffNoticeOn(checked);
    localStorage.setItem("Notification",String(checked));

    if(checked && !isPermissionGranted && !isRequestingPermission) {
      //購読情報登録
      await handleRequestPermission();
    }else if (!checked) {
      await handleDeleteSubscription();
    };
  };

  // 戻るボタン
  const handleBackClick = (e) => {
    e.preventDefault();
    setActiveTab('settings');
  };

  return (
    <div className="m-15 h-full w-full bg-[url('/images/note.png')] bg-no-repeat bg-[length:100%_100%] bg-center flex flex-col">
      <div className="ml-[80px] mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl font-bold p-16">通知</h2>
          </div>
          <div className="mx-20 space-y-4 ">
            <div>
              <p className="text-2xl mr-4 mb-4">通知OFF/ON</p>
              <ToggleSwitch
                checked={cutoffNoticeOn}
                onChange={handleToggleChange}
                className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                          dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                          rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute 
                          after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
              />
            </div>
            <div className="mt-8 space-x-12">
              <CustomButton
                type="button"
                label="戻る"
                onClick={handleBackClick}
                className='w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                          transition-colors duration-300'
              />
            </div>
          </div>
        </div>
    </div>
  )
}