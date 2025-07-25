import { useState } from "react";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import {useNavigate } from "react-router-dom";
import axios from 'axios'; 
import { PARENT_SIGNUP } from "../config/api";
import { setToken } from "../config/Token";

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      const response = await axios.post(PARENT_SIGNUP, {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const Token = response.data.token;
    setToken(Token);
      console.log('登録成功:', response.data);
      navigate('/childName')
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  return (
    <div className="bg-orange-100 h-screen">
      <div className="flex items-center">
        <CustomButton
          type="button"
          label="＜"
          onClick={() => navigate(-1)}
          className="w-10 text-black text-2xl font-black position absolute md:hidden"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-center w-full py-30">アカウント作成</h1>
      </div>
      
      <form className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <InputField
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-12  w-100 md:w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
          <InputField
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-12 w-100 md:w-200 h-15 px-4 border rounded-lg bg-gray-100 placeholder-gray-500 placeholder-text-xl"
          />
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex space-x-100">
            <CustomButton
              type="button"
              label="もどる"
              onClick={() => navigate(-1)}
              className="hidden md:block w-50 h-15 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
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