import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { Select } from "../common/Select";

export const SalarySettings = ({ setActiveTab }) => {

  const [selectedPayday, setSelectedPayday] = useState('月末');
  const [selectedCutoff, setSelectedCutoff] = useState('月末');
  const paydayOptions = [
    { value: '月末', label: '月末' },
    { value: '15日', label: '15日' },
  ];

  const cutoffOptions = [
    { value: '月末', label: '月末' },
    { value: '15日', label: '15日' },
  ];

  const handlePaydayChange = (e) => {
    setSelectedPayday(e.target.value);
    console.log('選択された給料日:', e.target.value);
  };

  const handleCutoffChange = (e) => {
    setSelectedCutoff(e.target.value);
    console.log('選択された給料日:', e.target.value);
  };

  // 戻るボタン
  const handleBackClick = (e) => {
    e.preventDefault();
    setActiveTab('settings');
  };

  // 決定ボタン
  const handleSubmitClick = (e) => {
    e.preventDefault();
    console.log('決定ボタンが押されました');
  };

  return (
    <div className="bg-stone-100 w-full h-full rounded-xl overflow-y-auto">
      <div className="flex justify-between items-center">
        <CustomButton
          type="button"
          label="＜"
          onClick={handleBackClick}
          className="md:hidden position absolute w-10 h-10 mt-6 ml-4 text-3xl border rounded-lg 
                                      text-black font-bold"
        />
        <h2 className="text-3xl font-bold text-center mb-10 pt-6 mx-auto md:text-5xl md:pt-10">給与</h2>
      </div>
      <div className="mx-20 md:mx-150 space-y-4">
        <p className="text-xl md:text-2xl">給料日の変更</p>
        <Select
          options={paydayOptions}
          value={selectedPayday}
          onChange={handlePaydayChange}
          className="w-26"
        />

        <p className="text-xl md:text-2xl">締め日の変更</p>
        <Select
          options={cutoffOptions}
          value={selectedCutoff}
          onChange={handleCutoffChange}
          className="w-26"
        />
        <div className="mt-8 space-x-12 flex">
          <CustomButton
            type="button"
            label="戻る"
            onClick={handleBackClick}
            className='hidden md:block w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
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