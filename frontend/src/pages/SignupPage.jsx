//親アカウントの初回登録画面

import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { SIGNUP_ENDPOINT } from "/src/config/api";

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert('入力エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      const response = await axios.post(SIGNUP_ENDPOINT, {
        email,
        password,
      },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const responseToken = response.data.token;
      localStorage.setItem('token', responseToken);
      console.log('登録成功:', response.data);
      alert('アカウント作成に成功しました！');
      navigate('/childname')
    } catch (error) {
      console.error('エラー:', error);
      alert('登録に失敗しました');
    }
  };

  return (
    <div className="bg-orange-100 h-screen">
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