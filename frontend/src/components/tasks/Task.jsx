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
      className={`
        bg-gray-50 shadow-lg items-center border-1
        md:px-6 md:py-2  md:h-[150px] md:w-[90%] md:flex  md:my-2  md:rounded-lg md:mr-0
        px-3 py-3 w-[92%] h-auto flex rounded-lg my-2 mr-0
      `}
    >
      {/* タスク名とメモ */}
      <div className="
        md:flex md:flex-row md:items-center md:flex-1 md:ml-5 md:space-x-6
        flex flex-col items-start flex-1 min-w-0 gap-1
      ">
        <p
          className="md:text-4xl text-base font-bold text-[#5C410E] truncate"
          title={task.t_name}
        >
          {task.t_name}
        </p>
        <p
          className="md:text-2xl text-sm text-[#5C410E] line-clamp-2"
          title={task.memo}
        >
          {task.memo}
        </p>
      </div>

      <div className="
        md:flex md:items-center md:space-x-12
        flex items-center gap-2
      ">
        {/* 期限と金額 */}
        <div className="
          md:flex md:flex-row md:items-center md:space-x-6 md:text-right md:mr-15
          flex flex-col items-end text-right mr-2
        ">
          <Deadline className="text-sm md:text-1xl text-[#5C410E]" deadline={task.deadline} />
          <p className="text-lg md:text-4xl font-bold text-green-600">¥{task.reward}</p>
        </div>

        {task.status === "WAIT_REVIEW" ? (
          <CustomButton
            type="button"
            label="承認"
            onClick={handleApproveClick}
            className="
              bg-green-400 text-white font-extrabold rounded-lg hover:bg-green-500
              md:w-25 md:h-12 md:text-3xl md:mx-auto md:transition-colors md:duration-300
              w-18 h-9 text-sm mx-auto
            "
          />
        ) : (
          <CustomButton
            type="button"
            label="編集"
            onClick={handleEditClick}
            className="
              bg-orange-300 text-[#5C410E] font-extrabold rounded-lg hover:bg-orange-400 transition-colors duration-300 mx-auto
              md:w-25 md:h-12 md:text-3xl
              w-10 h-9 text-sm
            "
          />
        )}
      </div>
    </li>
  );
};
