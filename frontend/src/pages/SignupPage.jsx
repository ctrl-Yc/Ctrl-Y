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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      const response = await apiClient.post(PARENT_SIGNUP, {
        email,
        password,
      });
      const Token = response.data.token;
      setToken(Token);
      console.log('登録成功:', response.data);
      navigate('/childName');
    } catch {
      let msg = "登録に失敗しました";
      const data = error?.response?.data;

      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          msg = parsed?.message || parsed?.error || parsed?.detail || data;
        } catch {
          msg = data; // 素の文字列
        }
      } else if (data && typeof data === "object") {
        msg = data.message || data.error || data.detail || msg;
      }

      toast.error(msg);
    }
  };

  return (
    <div className="bg-orange-100 h-screen">
      <ToastContainer />
      <h1 className="text-6xl font-bold text-center w-full py-25">アカウント作成</h1>
      <form className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <InputField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <InputField
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex space-x-100">
            <CustomButton
              type="button"
              label="もどる"
              onClick={() => navigate(-1)}
              className="w-50 h-15 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
            transition-colors duration-300 mt-4"
            />

            <CustomButton
              type="button"
              label="作成"
              onClick={handleSignup}
              className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
              transition-colors duration-300 mt-4"
            />
          </div>

        </div>
      </form>
    </div>
  );
};