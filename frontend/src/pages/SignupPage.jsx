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
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div className="bg-orange-100 rounded-xl w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">アカウント作成</h1>
        <form className="space-y-4">
          <InputField
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <InputField
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <div className="flex justify-between mt-6">
            <CustomButton
              type="button"
              label="もどる"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
            </CustomButton>
            <CustomButton
              type="button"
              label="作成"
              onClick={handleSignup}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};