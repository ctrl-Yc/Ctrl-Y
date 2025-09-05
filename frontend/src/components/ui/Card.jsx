export const Card = ({ title, icon, className, onClick }) => {
    return (
        <div
            className={`
                h-32 w-32 bg-gray-50 border border-gray rounded-lg m-3
                cursor-pointer hover:shadow-md transition-shadow duration-100
                flex flex-col items-center justify-center
                md:h-50 md:w-50 md:m-5
            `}
            onClick={onClick}
        >
            <img src={icon} className={className}/>
            <h3 className="
              text-lg font-semibold text-gray-900 text-center mt-2
              md:text-2xl md:mt-4
            ">{title}</h3>
        </div>
    )
}
