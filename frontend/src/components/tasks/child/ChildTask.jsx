import { CustomButton } from "../../common/CustomButton"; 
import { Deadline } from "../../common/Deadline.jsx"; 

const labelMap = { 
    TODO: "はじめる", 
    IN_PROGRESS: "できた‼", 
    WAIT_REVIEW: "かくにんちゅう", 
}; 

const buttonColorMap = {
    TODO: "bg-blue-500 hover:bg-blue-400 text-white",
    IN_PROGRESS: "bg-yellow-400 hover:bg-yellow-300 text-white",
    WAIT_REVIEW: "bg-gray-400 cursor-not-allowed text-white",
};

export const ChildTask = ({ task, onNext }) => { 
    const nextLabel = labelMap[task.status]; 
    const isWaitingReview = task.status === "WAIT_REVIEW"; 
    const isDone = task.status === "DONE"; 

    return ( 
        <li className="px-6 py-4 bg-gray-50 shadow-lg h-[150px] w-[90%] flex items-center my-2 border-3 border-gray-200 rounded-lg"> 
            <div className="flex flex-row flex-1 items-center space-x-6 ml-6"> 
                <p className="text-4xl font-bold text-[#5C410E]">{task.t_name}</p> 
                <p className="text-2xl text-[#5C410E]">{task.memo}</p> 
            </div> 
            <div className="flex items-center space-x-12 ml-auto"> 
                <Deadline className="text-3xl text-[#5C410E]" deadline={task.deadline} /> 
                <p className="text-4xl font-bold text-green-600">¥{task.reward}</p> 

                {!isDone && ( 
                    <CustomButton 
                        label={nextLabel} 
                        onClick={onNext} 
                        disabled={isWaitingReview} 
                        className={`w-40 h-15 text-3xl font-extrabold rounded-lg mx-auto transition-colors duration-300 ${
                            buttonColorMap[task.status]
                        }`} 
                    /> 
                )} 
            </div> 
        </li> 
    ); 
};
