import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";
import { CHILD_LOGIN } from "../config/api";

export const Keyword = () => {
  const [keyword, setKeyword] = useState('');
  const { parentUUID } = useParams();
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(CHILD_LOGIN, 
      {
        parent_id: parentUUID,
        keyword: keyword,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("child_id", response.data.child_id);
        navigate(`/child/home/${response.data.child_id}`);
      } else {
        console.log("あいことば違う");
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };

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
