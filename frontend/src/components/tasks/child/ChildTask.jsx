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
    <li className="px-6 py-2 bg-gray-50 shadow h-34 w-3/4 flex items-center my-2 border-gray-200 rounded-lg shadow-sm">
      <div className="space-y-4">
        <p className="text-3xl font-medium">{task.t_name}</p>
        <p className="text-xl text-gray-700">{task.memo}</p>
        {task.status === "DONE" && task.updated_at && (
          <p className="text-sm text-gray-500 mt-1">
            完了日: {new Date(task.updated_at).toLocaleDateString()}
          </p>
        )}
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
