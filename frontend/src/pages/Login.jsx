import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = (event) => {
    event.preventDefault();
    console.log('ボタンが押されました');
  }

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
      <p>アカウントを持っていない場合<a href="./NewRegister">アカウント作成</a></p>
      <CustomButton
        type="button"
        label="ログイン"
        onClick={handleClick}
        className=''
      />
    </form>
    </>
  )
}
