import { useEffect, useState } from "react";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { Link, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../config/Token";
import { apiClient } from "../lib/apiClient";
import { PARENT_LOGIN } from "../config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/top");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error("メールアドレスを入力してください");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.error("メールアドレスの形式が正しくありません");
      return;
    }
    if (!password) {
      toast.error("パスワードを入力してください");
      return;
    }

    try {
      const response = await apiClient.post(PARENT_LOGIN, { email, password });
      const token = response.data.token;
      setToken(token);
      navigate("/top"); 
    } catch {
      toast.error("メールアドレスまたはパスワードが正しくありません");
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
        gap-8 md:gap-10
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="mb-10 md:mb-12 mt-[-10px] md:mt-[-20px]">
        <img
          src="/images/180icon.png"
          className="h-60 md:h-48 max-w-[90%] object-contain"
        />
      </div>

      <form className="w-full md:w-auto flex flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-6 md:gap-8 w-150 md:w-120">
          <InputField
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full h-20 md:h-14
              px-4 border rounded-lg bg-gray-100
              placeholder-gray-500 text-lg md:text-lg
            "
          />
          <InputField
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full h-20 md:h-14
              px-4 border rounded-lg bg-gray-100
              placeholder-gray-500 text-lg md:text-lg
            "
          />
        </div>

        <p className="flex flex-wrap items-center justify-center text-2xl md:text-xl font-semibold leading-snug">
          パスワードをお忘れですか？
          <Link
            to="./resetRequest"
            className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300"
          >
            パスワードリセット
          </Link>
        </p>

        <CustomButton
          type="button"
          label="ログイン"
          onClick={handleLogin}
          className="
            w-60 md:w-60 h-16 md:h-14
            bg-blue-500 text-black text-2xl md:text-xl font-extrabold
            rounded-lg hover:bg-blue-400 transition-colors duration-300
            mx-auto flex items-center justify-center
          "
        />

        <p className="flex flex-wrap items-center justify-center text-2xl md:text-xl font-semibold leading-snug">
          アカウントを持っていない場合
          <Link
            to="./Signup"
            className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300"
          >
            アカウント作成
          </Link>
        </p>
      </form>
    </div>

  );
};