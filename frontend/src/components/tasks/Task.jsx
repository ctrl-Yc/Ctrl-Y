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

    const getStatusColor = (status) => {
        switch (status) {
            case "TODO":
                return "border-gray-500";
            case "IN_PROGRESS":
                return "border-orange-500";
            case "WAIT_REVIEW":
                return "border-blue-500";
            case "DONE":
                return "border-green-500";
            default:
                return "border-gray-500";
        }
    };

    return (
        <li
            className={`px-6 py-2 bg-gray-50 shadow-lg h-34 w-3/4 flex items-center my-2 border-3 ${getStatusColor(
                task.status
            )}  rounded-lg`}
        >
            <div className="flex items-center w-1/2">
                <p className="text-left w-1/2 text-3xl font-medium text-[#5C410E]">{task.t_name}</p>
                <p className="ml-5 w-1/2 text-xl text-[#5C410E]">{task.memo}</p>
            </div>
            <div className="ml-auto flex items-center space-x-12">
                <Deadline deadline={task.deadline} />

                <p className="w-20 text-3xl text-green-600">¥{task.reward}</p>

                {task.status === "WAIT_REVIEW" ? (
                    <CustomButton
                        type="button"
                        label="承認する"
                        onClick={handleApproveClick}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 transition"
                    />
                ) : (
                    <CustomButton
                        type="button"
                        label="編集"
                        onClick={handleEditClick}
                        className="border-1 border-[#5C410E] w-30 h-15 bg-orange-300 text-white text-2xl font-extrabold rounded-lg transition-colors duration-300 mx-auto"
                    />
                )}
            </div>
        </li>
    );
};
