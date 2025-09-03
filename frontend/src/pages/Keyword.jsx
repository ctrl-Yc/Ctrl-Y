import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { CHILDREN_LOGIN } from "../config/api";
import { setChildToken } from "../config/Token";
import { apiClient } from "../lib/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Keyword = () => {
  const [keyword, setKeyword] = useState("");
  const { childUUID } = useParams();
  const navigate = useNavigate();

  const handleClick = async (event) => {
    event.preventDefault();

    const k = keyword.trim();
    if (!k) {
      toast.error("あいことばを入力してください");
      return;
    }

    try {
      const response = await apiClient.post(CHILDREN_LOGIN(childUUID), {
        keyword: keyword,
      });

      if (response.data.token) {
        const childToken = response.data.token;
        setChildToken(childToken);
        navigate(`/child/top/${response.data.child_id}`);
      } else {
        toast.error("あいことば違います");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        toast.error("あいことば違います");
      } else {
        toast.error("通信エラー");
      }
    }
  };

  return (
    <div className="bg-[#FFF877] min-h-screen w-screen"
      style={{
        backgroundImage: "url('/images/back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ToastContainer />
      <h1 className="text-5xl font-bold text-center pt-70 pb-15">
        あいことばを入力してね
      </h1>

      <form onSubmit={handleClick} className="flex flex-col items-center justify-center space-y-4">
        <InputField
          type="text"
          placeholder="あいことばを入力"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="mb-12 w-105 h-12 px-4 border rounded-lg bg-gray-100"
        />

        <CustomButton
          type="submit"
          label="ログイン"
          className="w-50 h-12 bg-blue-500 text-white text-xl font-bold rounded-lg hover:bg-blue-400 transition"
        />
      </form>
    </div>
  );
};
