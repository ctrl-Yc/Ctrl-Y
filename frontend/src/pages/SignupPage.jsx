import { useState } from "react";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/apiClient";
import { PARENT_SIGNUP } from "../config/api";
import { setToken } from "../config/Token";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("メールアドレスとパスワードを入力してください");
      return;
    }

    const em = email.trim().toLowerCase();
    const isValidEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!isValidEmail(em)) {
      toast.error("メールアドレスの形式が正しくありません");
      return;
    }

    try {
      const response = await apiClient.post(PARENT_SIGNUP, { email, password });
      const Token = response.data.token;
      setToken(Token);
      navigate("/childName");
    } catch (error) {
      let msg = "登録に失敗しました";
      const data = error?.response?.data;

      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          msg = parsed?.message || parsed?.error || parsed?.detail || data;
        } catch {
          msg = data;
        }
      } else if (data && typeof data === "object") {
        msg = data.message || data.error || data.detail || msg;
      }

      toast.error(msg);
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
        px-5
        pt-[calc(env(safe-area-inset-top)+16px)]
        pb-[calc(env(safe-area-inset-bottom)+16px)]
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="w-full max-w-[680px] flex flex-col items-center gap-8 md:gap-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center">
          アカウント作成
        </h1>

        <form
          onSubmit={handleSignup}
          className="w-full flex flex-col items-center gap-6 md:gap-10"
        >
          <InputField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full md:w-140
              h-12 md:h-14
              px-3 border rounded-lg bg-gray-100
              placeholder-gray-500 text-base md:text-lg
            "
          />
          <InputField
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full md:w-140
              h-12 md:h-14
              px-3 border rounded-lg bg-gray-100
              placeholder-gray-500 text-base md:text-lg
            "
          />

          <div className="flex justify-center gap-40 w-full">
            <CustomButton
              type="button"
              label="もどる"
              onClick={() => navigate(-1)}
              className="
                w-28 md:w-40
                h-12 md:h-14
                bg-gray-300 text-black text-base md:text-xl font-bold
                rounded-lg hover:bg-gray-200
                transition-colors duration-300
              "
            />
            <CustomButton
              type="submit"
              label="作成"
              className="
                w-28 md:w-40
                h-12 md:h-14
                bg-blue-500 text-black text-base md:text-xl font-bold
                rounded-lg hover:bg-blue-400
                transition-colors duration-300
              "
            />
          </div>
        </form>
      </div>
    </div>
  );
};
