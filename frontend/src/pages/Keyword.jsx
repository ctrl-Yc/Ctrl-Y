import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import { InputField } from "../components/ui/InputField";

const Keyword = () => {
    const [keyword, setKeyword] = useState('');

    const handleClick = (event) => {
    event.preventDefault();
    console.log('ボタンが押されました');
  }

    return (
        <div>
            <h1>↓あいことばを入力してね↓</h1>
            <InputField
                type="text"
                placeholder="あいことばを入力"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className=""
            />
            <CustomButton
                type="button"
                label="すすむ"
                onClick={handleClick}
                className=''
            />
        </div>
    )
}

export default Keyword
