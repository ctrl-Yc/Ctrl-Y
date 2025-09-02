import { CustomButton } from "../common/CustomButton";
import { Deadline } from "../common/Deadline.jsx";

export const Task = ({ task, onEdit, onApprove }) => {
    const handleEditClick = (e) => {
        e.preventDefault();
        onEdit();
    };

    const handleApproveClick = (e) => {
        e.preventDefault();
        onApprove();
    };

    return (
        <li
    className={`px-6 py-2 bg-gray-50 shadow-lg h-[150px] w-[90%] flex items-center my-2 border-3 rounded-lg`}
>
    {/* タスク名とメモ 横並び */}
    <div className="flex flex-row items-center flex-1 ml-20 space-x-6">
        <p className="text-4xl font-bold text-[#5C410E]">{task.t_name}</p>
        <p className="text-2xl text-[#5C410E]">{task.memo}</p>
    </div>

    <div className="flex items-center space-x-12">
        {/* 期限と金額 横並び */}
        <div className="flex flex-row items-center space-x-6 text-right">
            <Deadline className="text-2xl text-[#5C410E]" deadline={task.deadline} />
            <p className="text-4xl font-bold text-green-600">¥{task.reward}</p>
        </div>

        {task.status === "WAIT_REVIEW" ? (
            <CustomButton
                type="button"
                label="承認"
                onClick={handleApproveClick}
                className="w-25 h-12 bg-green-400 text-white text-3xl font-extrabold rounded-lg mx-auto hover:bg-green-500 transition-colors duration-300"
            />
        ) : (
            <CustomButton
                type="button"
                label="編集"
                onClick={handleEditClick}
                className="w-25 h-12 bg-orange-300 text-[#5C410E] text-3xl font-extrabold rounded-lg mx-auto hover:bg-orange-400 transition-colors duration-300"
            />
        )}
    </div>
</li>
    );
};