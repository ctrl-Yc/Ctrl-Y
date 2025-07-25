import { format } from "date-fns";
export const Deadline = ({ deadline }) => {
    if (!deadline) {
        return <div className="w-60 text-right"><p className="font-semibold text-xl text-gray-400">期限未設定</p></div>;
    }
    
    const deadlineDate = new Date(deadline);
    const formattedDeadline = format(deadlineDate, "MM月dd日 HH:mmまで");
    return (
        <div className="w-60 text-right">
            <p className="font-semibold text-xl text-[#5C410E]">{formattedDeadline}</p>
        </div>
    );
};
