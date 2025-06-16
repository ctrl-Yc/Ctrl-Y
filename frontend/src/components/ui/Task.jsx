import { CustomButton } from "./CustomButton"

export const Task = ({ task }) => {
    const handleClick = (e) => {
        e.preventDefault();
        console.log('ボタンが押されました');
    }

    return (
        <li className="p-4 bg-white shadow rounded flex justify-between items-center">
            <div>
                <p className="text-lg font-medium">{task.t_name}</p>
                <p className="text-sm text-gray-500">{task.memo}</p>
                <p className="text-sm text-gray-500">￥{task.reward}</p>
                <CustomButton
                    type="button"
                    label="編集"
                    onClick={handleClick}
                    className=''
                />
            </div>
        </li>
    )
}

