import { useState } from "react";
import { InputField } from "./InputField"
import axios from "axios";
import { CustomButton } from "./CustomButton";
import { TASK_CREATE_POST } from "../../config/api";

export const TaskCreate = ({ setActiveTab }) => {
    const [name, setName] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    // 戻るボタン
    const handleBackClick = (e) => {
        e.preventDefault();
        setActiveTab('tasks');
    };

    // 決定ボタン
    const handleSubmitClick = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(TASK_CREATE_POST, 
                {
                    t_name: name,
                    memo: memo,
                    reward: Number(reward),
                    deadline: new Date(deadline)
                }
        );
            console.log("登録成功:", response.data);
            setActiveTab('tasks');
        } catch (error) {
            console.error('登録エラー:', error);
        }
    };
  
    return (
        <div>
            <h1>おてつだいの作成</h1>
            <p>・名前</p>
            <InputField
                type="text"
                placeholder=""
                value={name}
                onChange={e => setName(e.target.value)}
                className=""
            />
            <p>・金額</p>
            <InputField
                type="number"
                placeholder=""
                value={reward}
                onChange={e => setReward(e.target.value)}
                className=""
            />
            （円）
            <p>・期限</p>
            <InputField
                type="datetime-local"
                placeholder=""
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className=""
            />
            <p>・説明</p>
            <InputField
                type="text"
                placeholder=""
                value={memo}
                onChange={e => setMemo(e.target.value)}
                className=""
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