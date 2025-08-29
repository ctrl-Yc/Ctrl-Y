import { useEffect, useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { Select } from "../common/Select";
import { PAYDAY_CUTOFF_SETTING } from "../../config/api";
import { apiClient } from "../../lib/apiClient";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export const SalarySettings = ({ setActiveTab }) => {
  const [selectedPayday, setSelectedPayday] = useState('月末');
  const [selectedCutoff, setSelectedCutoff] = useState('月末');
  const navigate = useNavigate();

  const paydayOptions = [
    { value: '月末', label: '月末' },
    { value: '15日', label: '15日' },
  ];

  const cutoffOptions = [
    { value: '月末', label: '月末' },
    { value: '15日', label: '15日' },
  ];

  const booleanToLabel = (value) => (value ? '15日' : '月末');
  const labelToBoolean = (label) => label === '15日';

  // 初期データ取得
  useEffect(() => {
    const fetchSettings = async () => {

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("ログイン情報が失効しました。再度ログインしてください。");
        navigate("/");
        return;
      }
      try {
        const response = await apiClient.get(PAYDAY_CUTOFF_SETTING);
        setSelectedPayday(booleanToLabel(response.data.pay_day));
        setSelectedCutoff(booleanToLabel(response.data.cutoff_day));

      } catch {
        toast.error('データの取得に失敗しました');
      }
    };
    fetchSettings();
  }, [navigate]);

  const handlePaydayChange = (e) => {
    setSelectedPayday(e.target.value);
  };

  const handleCutoffChange = (e) => {
    setSelectedCutoff(e.target.value);
  };

  // 戻るボタン
  const handleBackClick = (e) => {
    e.preventDefault();
    setActiveTab('settings');
  };

  // 決定ボタン
  const handleSubmitClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("ログイン情報が失効しました。再度ログインしてください。");
      navigate("/");
      return;
    }

    try {
      await apiClient.post(PAYDAY_CUTOFF_SETTING, {
        pay_day: labelToBoolean(selectedPayday),
        cutoff_day: labelToBoolean(selectedCutoff),
      });
      toast.success("保存しました");
    } catch {
      toast.error("保存に失敗しました。");
    }
  };

  return (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold p-16">給与</h2>
      </div>
      <div className="mx-20 space-y-4">
        <p className="text-xl">給料日の変更</p>
        <Select
          options={paydayOptions}
          value={selectedPayday}
          onChange={handlePaydayChange}
          className="w-26"
        />

        <p className="text-xl">締め日の変更</p>
        <Select
          options={cutoffOptions}
          value={selectedCutoff}
          onChange={handleCutoffChange}
          className="w-26"
        />
        <div className="mt-8 space-x-12">
          <CustomButton
            type="button"
            label="戻る"
            onClick={handleBackClick}
            className='w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200 transition-colors duration-300'
          />
          <CustomButton
            type="button"
            label="決定"
            onClick={handleSubmitClick}
            className='w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200 transition-colors duration-300'
          />
        </div>
      </div>
    </div>
  );
};