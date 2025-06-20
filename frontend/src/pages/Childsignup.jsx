import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 

export const Childsignup = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name) {
      alert('入力エラー', '名前を入力してください');
      return;
    }

    try {
      const response = await axios.post('', {
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

      console.log('登録成功:', response.data);
      alert('名前を入力完了！');
      navigate('./')
    } catch (error) {
      console.error('エラー:', error);
      alert('登録に失敗しました');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center w-full">子供用アカウント作成</h1>
      <form>
        <p>名前を入力してください</p>
        <InputField
          type="name"
          value={name}
          onChange={e => setName(e.target.value)}
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
