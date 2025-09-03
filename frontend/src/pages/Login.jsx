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
        min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back.png')] bg-center bg-no-repeat
        [@media(min-aspect-ratio:725/1625)]:bg-cover
        [@media(max-aspect-ratio:725/1625)]:bg-contain
      "
    >
      <ToastContainer />

      <div className="flex justify-center py-20">
        <img
          src="/images/180icon.png"
          className="h-40 object-contain"
          alt="logo"
        />
      </div>

      <form>
        <div className="flex flex-col items-center justify-center space-y-4">
          <InputField
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <InputField
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-12 w-200 h-15 px-4 py-2 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
        </div>

        <p className="flex items-center justify-center my-8 text-2xl">
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
          className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400 transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
        />

        <p className="flex items-center justify-center my-8 text-2xl">
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