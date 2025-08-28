import { useState } from "react";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { CustomButton } from "../common/CustomButton";

export const NoticeSettings = ({ setActiveTab }) => {
    const [cutoffNoticeOn, setCutoffNoticeOn] = useState(false);
    const [paydayNoticeOn, setPaydayNoticeOn] = useState(false);

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab("settings");
    };

    // 決定ボタン
    const handleSubmitClick = (e) => {
        e.preventDefault();
        console.log("決定ボタンが押されました");
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
                        onChange={() => setCutoffNoticeOn((prev) => !prev)}
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                      dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                      rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute 
                      after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                    />
                </div>

                <div>
                    <p className="text-2xl mr-4 mb-4">給料日通知</p>
                    <ToggleSwitch
                        checked={paydayNoticeOn}
                        onChange={() => setPaydayNoticeOn((prev) => !prev)}
                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                      dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                      rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute 
                      after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                    />
                </div>

                <div className="mt-8 space-x-12">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={handleBackClick}
                        className="w-30 h-12 bg-gray-300 text-black text-2xl font-extrabold rounded-lg hover:bg-gray-200
                      transition-colors duration-300"
                    />
                    <CustomButton
                        type="button"
                        label="決定"
                        onClick={handleSubmitClick}
                        className="w-30 h-12 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                      transition-colors duration-300"
                    />
                </div>
            </div>
        </div>
    );
};
