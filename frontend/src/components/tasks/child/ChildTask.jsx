import { CustomButton } from "../../common/CustomButton";

const labelMap = {
  TODO: "はじめる",
  IN_PROGRESS: "完了報告",
  WAIT_REVIEW: "承認待ち",
};

export const ChildTask = ({ task, onNext }) => {
  const nextLabel = labelMap[task.status];
  const isWaitingReview = task.status === "WAIT_REVIEW";
  const isDone = task.status === "DONE";

  return (
    <li className="w-full max-w-2xl p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <p className="text-3xl font-medium">{task.t_name}</p>
        <p className="text-xl text-gray-700">{task.memo}</p>
      </div>
      <div className="ml-auto flex items-center space-x-12">
        <p className="text-3xl text-green-600">¥{task.reward}</p>

        {!isDone && (
          <CustomButton
            label={nextLabel}
            onClick={onNext}
            disabled={isWaitingReview}
            className={`px-4 py-2 rounded text-white ${
              isWaitingReview
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          />
        )}
      </div>
    </li>
  );
};
