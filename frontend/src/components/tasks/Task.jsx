import { CustomButton } from "../common/CustomButton";
import { Deadline } from "../common/Deadline.jsx";

// 文字数制限用
const ellipsize = (str, max) => {
    if (!str) return "";
    const chars = Array.from(str);
    return chars.length > max ? chars.slice(0, max).join("") + "…" : str;
};

export const Task = ({ task, onEdit, onApprove }) => {
    const handleEditClick = (e) => {
        e.preventDefault();
        onEdit();
    };

    const handleApproveClick = (e) => {
        e.preventDefault();
        onApprove();
    };

    const memoShort = ellipsize(task.memo || "", 10);

    return (
        <li
            className={`
            bg-gray-50 shadow-lg items-center border-3
            md:px-6 md:py-2  md:h-[150px] md:w-[90%] md:flex  md:my-2  md:rounded-lg md:mr-0
            px-6 py-2  h-[130px] w-[80%] flex  -my-10  rounded-lg mt-20 mr-3
            `}
        >

            <div className="
            md:flex md:flex-row md:items-center md:flex-1 md:ml-5 md:space-x-6
            flex flex-col items-start flex-1
        ">
                <p className="md:text-4xl text-3xl font-bold text-[#5C410E]">{task.t_name}</p>
                <p className="md:text-2xl text-[21px] text-[#5C410E]" title={task.memo || ""}>{memoShort}</p>
            </div>

            <div className="
                    md:flex md:items-center md:space-x-12
                    flex items-center space-x-1
                ">

                <div className="
                        md:flex md:flex-row md:items-center md:space-x-6 md:text-right md:mr-15
                        flex flex-col items-end  text-left mr-4
                    ">
                    <Deadline className="text-2xl text-[#5C410E] " deadline={task.deadline} />
                    <p className="text-4xl font-bold  text-green-600 ">¥{task.reward}</p>
                </div>

                {task.status === "WAIT_REVIEW" ? (
                    <CustomButton
                        type="button"
                        label="承認"
                        onClick={handleApproveClick}
                        className="
                    bg-green-400 text-white font-extrabold rounded-lg hover:bg-green-500
                    md:w-25 md:h-12  md:text-3xl  md:mx-auto  md:transition-colors md:duration-300
                    w-20 h-11  text-2xl mx-auto
                "
                    />
                ) : (
                    <CustomButton
                        type="button"
                        label="詳細"
                        onClick={handleEditClick}
                        className="
                    bg-orange-300 text-[#5C410E] font-extrabold rounded-lg hover:bg-orange-400 transition-colors duration-300 mx-auto
                    md:w-25 md:h-12  md:text-3xl  
                    w-20 h-11  text-2xl  
                "
                    />
                )}
            </div>
        </li>
    );
};