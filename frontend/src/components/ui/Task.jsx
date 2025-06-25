import { CustomButton } from "./CustomButton"

export const Task = ({ task, onEdit }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onEdit();
    }

    return (
        <li className="px-6 py-2 bg-white shadow rounded h-38 flex items-center my-4">

            <div className="space-y-4">
                <p className="text-4xl font-medium">{task.t_name}</p>
                <p className="text-xl text-gray-700">{task.memo}</p>
            </div>
            <div className="ml-auto flex items-center space-x-12">

                <p className="text-3xl text-black">¥{task.reward}</p>


                <CustomButton
                    type="button"
                    label="編集"
                    onClick={handleClick}
                    className='w-30 h-15 bg-orange-300 text-black text-2xl font-extrabold rounded-lg hover:bg-orange-200
                            transition-colors duration-300 mx-auto'
                />

            </div>



        </li>
    )
}

