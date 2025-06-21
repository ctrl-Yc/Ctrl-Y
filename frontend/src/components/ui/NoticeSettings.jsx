import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import { CustomButton } from "./CustomButton";

export const NoticeSettings = () => {
  const [cutoffNoticeOn, setCutoffNoticeOn] = useState(false);
  const [paydayNoticeOn, setPaydayNoticeOn] = useState(false);

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
      <h1>通知</h1>
      <p>締め日通知</p>
      <ToggleSwitch
        checked={cutoffNoticeOn}
        onChange={() => setCutoffNoticeOn(prev => !prev)}
      />
      <p>給料日通知</p>
      <ToggleSwitch
        checked={paydayNoticeOn}
        onChange={() => setPaydayNoticeOn(prev => !prev)}
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