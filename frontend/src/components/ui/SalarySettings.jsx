import { useState } from "react";
import { Select } from "./Select";
import { CustomButton } from "./CustomButton";

export const SalarySettings = () => {

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
    console.log('戻るボタンが押されました');
  };

  // 決定ボタン
  const handleSubmitClick = (e) => {
    e.preventDefault();
    console.log('決定ボタンが押されました');
  };

  return (
    <div>
      <h1>給与</h1>
      <p>給料日の変更</p>
      <Select
        options={paydayOptions}
        value={selectedPayday}
        onChange={handlePaydayChange}
      />
      <p>締め日の変更</p>
      <Select
        options={cutoffOptions}
        value={selectedCutoff}
        onChange={handleCutoffChange}
      />
      <CustomButton
        type="button"
        label="戻る"
        onClick={handleBackClick}
        className=''
      />
      <CustomButton
        type="button"
        label="決定"
        onClick={handleSubmitClick}
        className=''
      />
    </div>
  )
}