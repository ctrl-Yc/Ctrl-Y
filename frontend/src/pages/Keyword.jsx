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
    <div
      className="
        min-h-[100svh] md:min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back2.png')] md:bg-[url('/images/back.png')]
        bg-center bg-no-repeat
        [@media(min-aspect-ratio:390/844)]:bg-cover
        [@media(max-aspect-ratio:390/844)]:bg-contain
        flex flex-col justify-center items-center
        px-4
        pt-[calc(env(safe-area-inset-top)+12px)]
        pb-[calc(env(safe-area-inset-bottom)+12px)]
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-2xl md:text-5xl font-extrabold text-center mb-6 md:mb-12 leading-snug">
          あいことばを入力してね
        </h1>

        <form
          onSubmit={handleClick}
          className="flex flex-col items-center gap-6 md:gap-10"
        >
          <InputField
            type="text"
            placeholder="あいことばを入力"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="
              w-72 md:w-120
              h-10 md:h-14
              px-3 md:px-5 border rounded-lg bg-gray-100
              placeholder-gray-500 text-base md:text-lg
            "
          />

          <CustomButton
            type="submit"
            label="ログイン"
            className="
              w-32 md:w-60
              h-10 md:h-14
              bg-blue-500 text-white text-base md:text-2xl font-extrabold
              rounded-lg hover:bg-blue-400 transition-colors duration-300
            "
          />
        </form>
      </div>
    </div>
  );
};