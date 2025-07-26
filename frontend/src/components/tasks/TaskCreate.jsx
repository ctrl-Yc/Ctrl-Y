import { useState } from "react";
import { TASKS_BASE } from "../../config/api";
import { CustomButton } from "../common/CustomButton";
import { InputField } from "../common/InputField";
import Modal from '@mui/material/Modal';
import { bgStyles, buttonStyles } from "../ui/Color";
import { api } from "../../api";

export const TaskCreate = ({ open, setOpen, fetchTasks }) => {
    const [name, setName] = useState('');
    const [reward, setReward] = useState('');
    const [deadline, setDeadline] = useState('');
    const [memo, setMemo] = useState('');

    // 決定ボタン
    const handleSubmitClick = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(TASKS_BASE, {
                t_name: name,
                memo: memo,
                reward: Number(reward),
                deadline,
            });
            console.log("登録成功:", response.data);
            setOpen(false);
            fetchTasks();
        } catch (error) {
            console.error('登録エラー:', error);
        }
    };

    const inputField = (label, value, onChange, className, type = "text", placeholder = "") => {
        return (
            <div className="flex justify-start items-center space-x-4 mb-8">
                <p className="text-4xl text-[#2c3e50] w-50 text-right">{label}</p>
                <InputField
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={className}
                />
            </div>
        )
    }

    const inputStyle = "border bg-white rounded-lg";

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
<div className={`${bgStyles} w-2/3 h-auto overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            <div className="p-4">
                <h1 className="text-5xl font-bold p-10 text-[#2c3e50]">おてつだいの作成</h1>
                <div className="w-3/5 mx-auto mt-12 space-y-20">
                    {inputField("タスク名", name, e => setName(e.target.value), `w-70 h-11 px-4 text-3xl ${inputStyle}`, "text", "タスク名を入力してください")}
                    {inputField("金額", reward, e => setReward(e.target.value), `w-30 h-11 px-4 text-3xl ${inputStyle}`, "number", "金額を入力してください")}
                    {inputField("期限", deadline, e => setDeadline(e.target.value), `text-2xl w-67 h-11 px-4 ${inputStyle}`, "datetime-local", "期限を入力してください")}
                    {inputField("説明", memo, e => setMemo(e.target.value), `w-3/5 h-11 px-4 ${inputStyle}`, "text", "説明を入力してください")}
                </div>
            </div>
                <div className="w-3/5 mt-24 pb-10 flex items-end justify-between mx-auto">
                    <CustomButton
                        type="button"
                        label="戻る"
                        onClick={() => setOpen(false)}
                        className="w-30 h-12 px-4 text-3xl border rounded-lg bg-[#3498db] border-[#2980b9] text-white hover:bg-[#2980b9] font-bold"
                    />
                    <CustomButton
                        type="button"
                        label="決定"
                        onClick={handleSubmitClick}
                        className={`${buttonStyles} w-30 h-12 px-4 text-3xl hover:bg-orange-200 font-bold`}
                    />
                </div>
            </div>
        </Modal>
    )
}