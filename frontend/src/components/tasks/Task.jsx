import { CustomButton } from "../common/CustomButton";

export const Task = ({ task, onEdit, onApprove }) => {
    const handleEditClick = (e) => {
        e.preventDefault();
        onEdit();
    }

    const handleApproveClick = (e) => {
        e.preventDefault();
        onApprove();
    };

    return (
        <li className="bg-gray-50 shadow flex items-center border-gray-200 rounded-lg shadow-sm 
        w-full h-30 
        md:px-6 md:py-2 md:h-34 md:w-3/4 md:my-2">
            <div className="space-y-4 ml-4">
                <p className="text-2xl font-extrabold md:text-3xl md:font-medium">{task.t_name}</p>
                <p className="text-lg text-gray-700 md:text-xl">{task.memo}</p>
            </div>
            <div className="ml-auto flex items-center space-x-8 md:space-x-12">

                <p className="text-2xl text-green-600 md:text-3xl">¥{task.reward}</p>

                {task.status === "WAIT_REVIEW" ? (
                    <CustomButton
                    type = "button"
                    label = "承認する"
                    onClick = { handleApproveClick }
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400 transition"
                    />
                ) : (
                    <CustomButton
                    type = "button"
                    label = "編集"
                    onClick = { handleEditClick }
                    className = "bg-orange-300 text-black font-extrabold rounded-lg hover:bg-orange-200transition-colors duration-300 mr-4 w-16 h-10 md:w-30 md:h-15 md:text-2xl"
                    />
                )}
            </div>
        </li>
    )
}

