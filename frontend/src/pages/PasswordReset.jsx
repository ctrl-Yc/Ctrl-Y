import { useState } from "react";
import { InputField } from "../components/common/InputField";
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { useNavigate, useLocation } from "react-router-dom";

export const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleSubmitClick = async () => {
    if (!newPassword || !confirmNewPassword) return;
    if (newPassword !== confirmNewPassword) return;
    if (!token) return;

    try {
      await apiClient.post(
        PASS_RESET,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (error) {
      console.error("リセットエラー:", error);
    }
  };

  
   return (
    <div
      className="
        min-h-[100svh] md:min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back2.png')] md:bg-[url('/images/back.png')]
        bg-center bg-no-repeat
        [@media(min-aspect-ratio:390/844)]:bg-cover
        [@media(max-aspect-ratio:390/844)]:bg-contain
        flex flex-col justify-center items-center
        px-4
        pt-[calc(env(safe-area-inset-top)+12px)]
        pb-[calc(env(safe-area-inset-bottom)+12px)]
        overflow-x-hidden
      "
    >
      <div className="w-full max-w-[600px] flex flex-col items-center gap-6 md:gap-12">
        <h1 className="text-2xl md:text-5xl font-extrabold text-center">
          パスワードのリセット
        </h1>

        <p className="text-base md:text-2xl font-semibold text-center leading-snug">
          新しいパスワードを設定してください
        </p>

        <div className="w-full flex flex-col items-center gap-6 md:gap-8">

          <InputField
            type="password"
            placeholder="新しいパスワード"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="
              w-72 md:w-120
              h-10 md:h-14
              px-3 md:px-5 border rounded-lg bg-gray-100
              placeholder-gray-500 text-sm md:text-lg
            "
          />

          <InputField
            type="password"
            placeholder="新しいパスワード（確認）"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="
              w-72 md:w-120
              h-10 md:h-14
              px-3 md:px-5 border rounded-lg bg-gray-100
              placeholder-gray-500 text-sm md:text-lg
            "
          />

          <CustomButton
            type="button"
            label="決定"
            onClick={handleSubmitClick}
            className="
              w-32 md:w-60
              h-10 md:h-14
              bg-blue-500 text-black text-sm md:text-xl font-extrabold
              rounded-lg hover:bg-blue-400 transition-colors duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};