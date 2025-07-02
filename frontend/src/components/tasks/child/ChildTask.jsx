import { useState } from "react";
import { CustomButton } from "../../common/CustomButton";


export const ChildTask = ({ task, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = async () => {
    if (isCompleted || isDisabled) return;

    try {
      await onComplete(); 
      setIsCompleted(true);
      setIsDisabled(true);

      setTimeout(() => {
        setIsDisabled(false);
      }, 10 * 60 * 1000); 
    } catch (error) {
      console.error("失敗", error);
    }
  };

  return (
    <li className="w-full max-w-2xl p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{task.title}</h2>
        <p className="text-gray-500">締切: {task.deadline}</p>
      </div>
      <CustomButton
        label={isCompleted ? "完了済み" : "完了する"}
        onClick={handleClick}
        className={`px-4 py-2 rounded text-white ${
          isCompleted || isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-400"
        }`}
        disabled={isCompleted || isDisabled}
      />
    </li>
  );
};
