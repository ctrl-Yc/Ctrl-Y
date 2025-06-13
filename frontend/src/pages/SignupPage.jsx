import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { Link } from "react-router-dom";
import axios from 'axios'; 

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('', {//後でURL指定する！！！！！！！！！！！！
        email,
        password,
      }); 

      console.log('登録成功:', response.data);
      alert('アカウント作成に成功しました！');
    } catch (error) {
      console.error('エラー:', error);
      alert('登録に失敗しました');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center w-full">アカウント作成</h1>
      <form>
        <InputField
          type="email"
          placeholder="メールアドレスを入力"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className=""
        />
        <InputField
          type="password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
        />
        <CustomButton
          type="button"
          label="作成"
          onClick={handleSignup}
          className=""
        />
        <Link to={-1}>
          <CustomButton
            type="button"
            label="戻る"
            className=""
          />
        </Link>
      </form>
    </>
  );
};
