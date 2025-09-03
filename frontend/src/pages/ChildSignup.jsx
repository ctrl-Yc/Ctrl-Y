import { useState } from "react";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { useNavigate } from "react-router-dom";
import { getToken } from "../config/Token";
import { INIT_SETUP } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChildSignup = () => {
  const [c_name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!c_name || !keyword) {
      toast.error("名前とあいことばを入力してください");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("親のアカウントからやり直してください");
      return;
    }

    try {
      const response = await apiClient.post(INIT_SETUP, { c_name, keyword });
      navigate("/ChildUrl", { state: { childId: response.data.user_id } });
    } catch {
      toast.error("子供のアカウント作成に失敗しました");
    }
  };

  return (
    <div
      className="
        min-h-[100svh] md:min-h-[100dvh] w-screen
        bg-[#FFF877]
        bg-[url('/images/back2.png')] md:bg-[url('/images/back.png')]
        bg-center bg-no-repeat
        [@media(min-aspect-ratio:725/1625)]:bg-cover
        [@media(max-aspect-ratio:725/1625)]:bg-contain
        flex flex-col justify-center items-center
        px-5
        pt-[calc(env(safe-area-inset-top)+16px)]
        pb-[calc(env(safe-area-inset-bottom)+16px)]
        overflow-x-hidden
      "
    >
      <ToastContainer />

      <div className="w-full max-w-[680px] flex flex-col items-center gap-10 md:gap-12">
        <h1 className="text-5xl md:text-5xl font-extrabold text-center">
          子供用アカウント作成
        </h1>

        <form className="w-full flex flex-col items-center gap-8 md:gap-10">
          <div className="w-full flex flex-col items-center gap-6 md:gap-8">
            <p className="text-3xl md:text-2xl font-bold text-center">
              名前を入力してください
            </p>
            <InputField
              type="text"
              value={c_name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前"
              className="
                w-140 md:w-120
                h-16 md:h-14
                px-5 border rounded-lg bg-gray-100
                text-2xl md:text-lg
              "
            />

            <p className="text-3xl md:text-2xl font-bold text-center">
              あいことばを入力してください
            </p>
            <InputField
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="あいことば"
              className="
                w-140 md:w-120
                h-16 md:h-14
                px-5 border rounded-lg bg-gray-100
                text-2xl md:text-lg
              "
            />
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center gap-70 md:gap-50">
            <CustomButton
              type="button"
              label="もどる"
              onClick={() => navigate(-1)}
              className="
                w-40 md:w-40
                h-16 md:h-14
                bg-gray-300 text-black text-2xl md:text-xl font-extrabold
                rounded-lg hover:bg-gray-200
                transition-colors duration-300
              "
            />
            <CustomButton
              type="button"
              label="作成"
              onClick={handleSignup}
              className="
                w-40 md:w-40
                h-16 md:h-14
                bg-blue-500 text-black text-2xl md:text-xl font-extrabold
                rounded-lg hover:bg-blue-400
                transition-colors duration-300
              "
            />
          </div>
        </form>
      </div>
    </div>
  );
};
