import { useEffect, useState } from "react";
import { CustomButton } from "../components/common/CustomButton"
import { InputField } from "../components/common/InputField"
import { Link, useNavigate } from "react-router-dom"
import { setToken } from "../config/Token";
import { apiClient } from "../lib/apiClient";
import { PARENT_LOGIN } from "../config/api";
import { getToken } from "../config/Token";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate('/top');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('入力エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }
    try {
      const response = await apiClient.post(PARENT_LOGIN,
        {
          email,
          password,
        }
      );
      const Token = response.data.token;
      setToken(Token);
      navigate('./top', { state: { token: setToken(Token) } });
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };



  return (
    <div className="bg-orange-100 h-screen">
      <h1 className="text-6xl font-bold text-center w-full py-30">ログイン</h1>
      <form>
        <div className="flex flex-col items-center justify-center space-y-4">
          <InputField
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <Link to="./resetRequest" className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300">
            パスワードリセット
          </Link>
        </p>
        <CustomButton
          type="button"
          label="ログイン"
          onClick={handleLogin}
          className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
        />
        <p className="flex items-center justify-center my-8 text-2xl">
          アカウントを持っていない場合
          <Link to="./Signup" className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300">
            アカウント作成
          </Link>
        </p>
      </form>
    </div>
  )
}
