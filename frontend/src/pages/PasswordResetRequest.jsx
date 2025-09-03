import { useEffect, useState } from "react";
import { InputField } from "../components/common/InputField";
import { CustomButton } from "../components/common/CustomButton";
import { PASS_RESET_REQUEST } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(30);

  useEffect(() => {
    if (!isCooldown) return;
    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCooldown(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCooldown]);

  const handleSendClick = async () => {
    if (!email) {
      toast.error("メールアドレスを入力してください。");
      return;
    }
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("正しいメールアドレス形式を入力してください。");
      return;
    }
    try {
      await apiClient.post(PASS_RESET_REQUEST, { email });
      toast.success("パスワードリセットリンクを送信しました。メールをご確認ください。");
      setIsCooldown(true);
    } catch {
      toast.error("送信に失敗しました。メールアドレスをご確認ください。");
    }
  };

  return (
    <div
      className="
        min-h-[100svh] md:min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back2.png')] md:bg-[url('/images/back.png')]
        bg-center bg-no-repeat
        [@media(min-aspect-ratio:725/1625)]:bg-cover
        [@media(max-aspect-ratio:725/1625)]:bg-contain
        flex flex-col justify-center items-center
        px-5
        pt-[calc(env(safe-area-inset-top)+16px)]
        pb-[calc(env(safe-area-inset-bottom)+16px)]
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="w-full max-w-[680px] flex flex-col items-center gap-10 md:gap-12">
        <h1 className="text-5xl md:text-5xl font-extrabold text-center">
          パスワードのリセット
        </h1>

        <p className="text-2xl md:text-2xl text-center leading-snug">
          ご入力いただいたメールアドレスに
          <br className="hidden sm:block" />
          パスワード再設定用のリンクを送ります
        </p>

        <div className="w-full flex flex-col items-center gap-8 md:gap-8">
          <InputField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-140 md:w-120
              h-16 md:h-14
              px-5 border rounded-lg bg-gray-100
              placeholder-gray-500 text-2xl md:text-lg
            "
          />

          <CustomButton
            type="button"
            label={isCooldown ? `再送信 (${cooldownTime}s)` : "送信"}
            onClick={handleSendClick}
            disabled={isCooldown}
            className="
              w-60 md:w-60
              h-16 md:h-14
              bg-blue-500 text-black text-3xl md:text-xl font-extrabold
              rounded-lg hover:bg-blue-400 disabled:opacity-60
              transition-colors duration-300
            "
          />
        </div>
      </div>
    </div>
  );
};
