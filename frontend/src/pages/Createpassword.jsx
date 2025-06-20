import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton"
import { InputField } from "../components/ui/InputField"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

export const Createpassword = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handlepassword = async () => {
  if (!password) {
    alert('入力エラー', 'あいことばを入力してください');
  }
  try {
    const response = await axios.post('',
      {
        password,
      },
      {
        headers:{
          'Content-type': 'application/json'
        }
      }
    );


    alert('成功', 'ログインに成功しました！',response.data);
    navigate('./');
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
        type="password"
        placeholder="あいことばを入力"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className=""
      />
      <CustomButton
        type="button"
        label="完了"
        onClick={handlepassword}
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
