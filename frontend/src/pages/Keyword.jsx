import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";

export const Keyword = () => {
    const [keyword, setKeyword] = useState('');

    const handleClick = (event) => {
        event.preventDefault();
        console.log('ボタンが押されました');
    }

    return (
        <div className="bg-orange-100 h-screen">
            <h1 className="text-3xl font-bold text-center pt-50 pb-20">あいことばを入力してね</h1>
            <div className="flex flex-col items-center justify-center space-y-4">
                <InputField
                    type="text"
                    placeholder="あいことばを入力"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="mb-12 w-150 h-15 px-4 border rounded-lg bg-gray-100"
                />
            </div>
            <div className="flex mt-6">
                <CustomButton
                    type="button"
                    label="ログイン"
                    onClick={handleClick}
                    className="w-50 h-15 bg-blue-500 text-black text-2xl font-extrabold rounded-lg hover:bg-blue-400
                    transition-colors duration-300 mt-4 mx-auto"
                />
            </div>
        </div>
    )
}
