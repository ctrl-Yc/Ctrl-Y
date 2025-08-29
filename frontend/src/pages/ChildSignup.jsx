import { useState } from "react";
import { CustomButton } from "../components/common/CustomButton";
import { InputField } from "../components/common/InputField";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../config/Token";
import { INIT_SETUP } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChildSignup = () => {
  const [c_name, setName] = useState('');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!c_name || !keyword) {
      toast.error("名前とあいことばを入力してください")
      return;
    }

    const token = getToken();

    if (!token) {
      toast.error("親のアカウントからやり直してください")
      return;
    }
    try {
      const response = await apiClient.post(INIT_SETUP,
      {
        c_name,
        keyword,
      });
      
      navigate('/ChildUrl',{ state: { childId: response.data.user_id } });
    } catch (error) {
      toast.error("子供のアカウント作成に失敗しました")
    }
  };
  return (
      <div className="bg-orange-100 h-screen">
        <ToastContainer />
        <h1 className="text-6xl font-bold text-center w-full py-25">子供用アカウント作成</h1>
        <form className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-3xl font-bold text-center pb-10">名前を入力してください</p>
            <InputField
              type="name"
              value={c_name}
              onChange={e => setName(e.target.value)}
              className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100"
            />
            <p className="text-3xl font-bold text-center pb-10">あいことばを入力してください</p>
            <InputField
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex space-x-100">
              <Link to={-1}>
                <CustomButton
                  type="button"
                  label="もどる"
                  className="w-50 h-15 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
             transition-colors duration-300 mt-4"
                />
              </Link>
              <CustomButton
                type="button"
                label="作成"
                onClick={handleSignup}
                className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
              transition-colors duration-300 mt-4"
              />
            </div>

          </div>
        </form>
      </div>
  );
};
