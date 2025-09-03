import { format } from "date-fns";

export const Deadline = ({ deadline, className }) => {
    if (!deadline) {
        return (
            <div className="text-right">
                <p className={`font-semibold text-gray-400 ${className}`}>期限未設定</p>
            </div>
        );
    }

    const deadlineDate = new Date(deadline);
    const formattedDeadline = format(deadlineDate, "MM月dd日 HH:mmまで");

    return (
        <div className=" text-right">
            <p className={`font-semibold text-[#5C410E] ${className}`}>{formattedDeadline}</p>
        </div>
    );
};
