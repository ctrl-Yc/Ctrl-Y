import { useEffect, useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { Select } from "../common/Select";
import { PAYDAY_CUTOFF_CHANGE, PAYDAY_CUTOFF_GET } from "../../config/api";
import axios from "axios";

export const SalarySettings = ({ setActiveTab }) => {

  const [selectedPayday, setSelectedPayday] = useState('月末');
  const [selectedCutoff, setSelectedCutoff] = useState('月末');
  const [error, setError] = useState('');
  
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
      try {
        const response = await axios.get(PAYDAY_CUTOFF_GET, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedPayday(booleanToLabel(response.data.pay_day));
        setSelectedCutoff(booleanToLabel(response.data.cutoff_day));

      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

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
    try {
      const response = await axios.post(
        PAYDAY_CUTOFF_CHANGE,
        {
          pay_day: labelToBoolean(selectedPayday),
          cutoff_day: labelToBoolean(selectedCutoff),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      alert("保存しました");
    } catch (err) {
      alert("保存に失敗しました");
      console.error(err);
    }
  };

  return (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold p-16">給与</h2>
        {error && <p className="text-red-500">{error}</p>}
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
            className='w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                      transition-colors duration-300'
          />
          <CustomButton
            type="button"
            label="決定"
            onClick={handleSubmitClick}
            className='w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                      transition-colors duration-300'
          />
        </div>
      </div>
    </div>
  )
}