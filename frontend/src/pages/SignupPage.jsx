import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

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
      const response = await axios.post('', {
        email,
        password,
      },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('登録成功:', response.data);
      alert('アカウント作成に成功しました！');
      navigate('./childname')
    } catch (error) {
      console.error('エラー:', error);
      alert('登録に失敗しました');
    }
  };

  return (
    <div className="bg-orange-100 h-screen">
      <h1 className="text-6xl font-bold text-center w-full py-30">アカウント作成</h1>
      <form>
        <div className="flex flex-col items-center justify-center space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-50 h-15 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
          >
            もどる
          </button>
          <button
            type="button"
            onClick={handleSignup}
            className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
          >
            作成
          </button>
        </div>
      </form>

    </div>
  );
};