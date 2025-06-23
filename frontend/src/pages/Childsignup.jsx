import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 

export const Childsignup = () => {
  const [c_name, setName] = useState('');
   const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!c_name || !keyword) {
      alert('入力エラー', '入力してください');
      return;
    }
    try {
      const response = await axios.post('', 
      {
        c_name,
        keyword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

      console.log('登録成功:', response.data);
      alert('入力完了！');
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
          value={c_name}
          onChange={e => setName(e.target.value)}
          className=""
        />
        <InputField
          type="password"
          placeholder="あいことばを入力"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
