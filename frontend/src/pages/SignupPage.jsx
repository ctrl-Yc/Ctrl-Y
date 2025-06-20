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
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div className="bg-orange-100 rounded-xl w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">アカウント作成</h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-full bg-gray-100 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-full bg-gray-100 placeholder-gray-500"
          />
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
              もどる
            </button>
            <button
              type="button"
              onClick={handleSignup}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};