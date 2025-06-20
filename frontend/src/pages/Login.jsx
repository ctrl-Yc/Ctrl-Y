import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

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
    const response = await axios.post('',
      {
        email,
        password,
      },
      {
        headers:{
          'Content-type': 'application/json'
        }
      }
    );
    const responseToken = response.data.token;
    localStorage.setItem('token', responseToken);
    alert('成功', 'ログインに成功しました！');
    navigate('./top', { state: {'token':responseToken } });
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('失敗', 'ログインに失敗しました');
    }
  };
    
  

  return (
    <>
    <h1 className="text-3xl font-bold text-center w-full">ログイン</h1>
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
      <p>アカウントを持っていない場合<Link to="./Signup">アカウント作成</Link></p>
      <CustomButton
        type="button"
        label="ログイン"
        onClick={handleLogin}
        className=''
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
  )
}
