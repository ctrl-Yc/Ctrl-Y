import { CustomButton } from "../../common/CustomButton"; 
import { Deadline } from "../../common/Deadline.jsx"; 

const labelMap = { 
    TODO: "はじめる", 
    IN_PROGRESS: "できた!", 
    WAIT_REVIEW: "まってね", 
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
        <li className="
            bg-gray-50 shadow-lg items-center border-3
            md:px-7 md:py-2  md:h-[120px] md:w-[90%] md:flex  md:my-2  md:rounded-lg md:mr-0
            px-2 py-2  h-[70px] w-[75%] flex  -my-3  rounded-lg mt-5 
        "> 
            <div className="
                    md:flex md:flex-row md:items-center md:flex-1 md:ml-5 md:space-x-6
                    flex flex-col items-start flex-1
                "> 
                <p className="md:text-4xl text-[20px] font-bold text-[#5C410E]">{task.t_name}</p> 
                <p className="md:text-2xl text-[14px] text-[#5C410E]">{task.memo}</p> 
            </div>
            <div className="
                    md:flex md:items-center md:space-x-12
                    flex items-center space-x-0
                ">
                <div className="
                        md:flex md:flex-row md:items-center md:space-x-6 md:text-right md:mr-15
                        flex flex-col items-end  mr-2  
                "> 
                <Deadline className="md:text-2xl text-[11px] text-[#5C410E]" deadline={task.deadline} /> 
                <p className="md:text-4xl text-[18px] font-bold text-green-600">¥{task.reward}</p> 
            </div>
                {!isDone && ( 
                    <CustomButton 
                        label={nextLabel} 
                        onClick={onNext} 
                        disabled={isWaitingReview} 
                        className={` bg-blue-500 text-[#5C410E] font-extrabold rounded-lg hover:bg-orange-400 transition-colors duration-300 mx-auto
                                    md:w-26 md:h-13  md:text-3xl  
                                    w-12 h-7  text-[12px]  
                                    ${buttonColorMap[task.status]
                        }`} 
                    /> 
                )} 
                </div> 
        </li> 
    ); 
};
