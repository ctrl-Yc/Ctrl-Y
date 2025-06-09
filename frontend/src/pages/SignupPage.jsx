import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"
import { Link } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createButton = (event) => {
    event.preventDefault();
    console.log('ボタンが押されました');
  }

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
        onClick={createButton}
        className=''
      />
      <Link to={-1}>
      <CustomButton
        type="button"
        label="戻る"
        className=''
      />
      </Link>
    </form>
    </>
  )
}
