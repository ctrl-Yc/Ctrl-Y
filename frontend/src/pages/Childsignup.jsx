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
      <div className="bg-orange-100 h-screen">
        <h1 className="text-6xl font-bold text-center w-full py-30">子供用アカウント作成</h1>
        <form>
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-3xl font-bold text-center">名前を入力してください</p>
            <InputField
              type="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mb-12 w-200 h-15 px-4 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex justify-between mt-6">
            <Link to={-1}>
              <CustomButton
                type="button"
                label="戻る"
                className="w-50 h-15 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
              />
              </Link>
              <CustomButton
                type="button"
                label="作成"
                onClick={handleSignup}
                className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
             transition-colors duration-300 mx-auto flex items-center justify-center mt-4"
              />
            
          </div>
        </form>
      </div>
    </>
  );
};
