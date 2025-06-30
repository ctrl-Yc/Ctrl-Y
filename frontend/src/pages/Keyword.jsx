import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { LOGIN_CHILD } from "../config/api";
import { setChildToken } from "../config/Token"

export const Keyword = () => {
  const [keyword, setKeyword] = useState('');
  const { childUUID } = useParams();
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    try {
    const response = await axios.post(LOGIN_CHILD(childUUID),
        {
        keyword: keyword,
        },
        {
        headers: {
            'Content-Type': 'application/json',
        },
        }
    );
    console.log(childUUID)
    if (response.data.token) {
        const childtoken = response.data.token;
        setChildToken(childtoken);
        navigate(`/child/top/${response.data.child_id}`);
    } else {
        console.log("あいことば違う");
    }
    } catch (error) {
    console.error("通信エラー:", error);
    }
  }


  return (
    <div className="bg-orange-100 h-screen">
      <h1 className="text-3xl font-bold text-center pt-12 pb-8">あいことばを入力してね</h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <InputField
          type="text"
          placeholder="あいことばを入力"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="mb-12 w-64 h-12 px-4 border rounded-lg bg-gray-100"
        />

        <CustomButton
          type="button"
          label="ログイン"
          onClick={handleClick}
          className="w-48 h-12 bg-blue-500 text-white text-xl font-bold rounded-lg hover:bg-blue-400 transition"
        />
      </div>
    </div>
  );
};
