import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"
import { Link, useNavigate } from "react-router-dom"
import { getToken } from "../config/Token";
import axios from "axios";
import { LOGIN_ENDPOINT } from "../config/api";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('入力エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }
    try {
      const response = await axios.post(LOGIN_ENDPOINT,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-type': 'application/json'
          }
        }
      );
      const Token = response.data.token;
      getToken(Token);
      alert('成功', 'ログインに成功しました！');
      navigate('./top', { state: { token: getToken(Token) } });
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('失敗', 'ログインに失敗しました');
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
              className="mb-4 w-200 h-15 px-4 py-2 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
            />
          </div>


          <p className="flex items-center justify-center my-8 text-2xl">
            アカウントを持っていない場合
            <Link to="./Signup" className="text-blue-600 underline ml-2 hover:text-blue-400 duration-300">
              アカウント作成
            </Link>
          </p>
          <CustomButton
            type="button"
            label="ログイン"
            onClick={handleLogin}
            className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
          />
        </form>
      </div>
  )
}
