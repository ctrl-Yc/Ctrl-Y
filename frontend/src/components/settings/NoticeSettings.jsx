import { useState } from "react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { CustomButton } from "../common/CustomButton";

export const NoticeSettings = ({ setActiveTab }) => {
  const [cutoffNoticeOn, setCutoffNoticeOn] = useState(false);
  const [paydayNoticeOn, setPaydayNoticeOn] = useState(false);

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
        <h2 className="text-5xl font-bold p-16">通知</h2>
      </div>
      <div className="mx-20 space-y-4">
        <div>
          <p className="text-2xl mr-4 mb-4">締め日通知</p>
          <ToggleSwitch
            checked={cutoffNoticeOn}
            onChange={() => setCutoffNoticeOn(prev => !prev)}
          />
        </div>

        <div>
          <p className="text-2xl mr-4 mb-4">給料日通知</p>
          <ToggleSwitch
            checked={paydayNoticeOn}
            onChange={() => setPaydayNoticeOn(prev => !prev)}
          />
        </div>

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