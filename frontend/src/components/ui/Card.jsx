export const Card = ({ title, icon, className, onClick }) => {
    return (
        <div
            className={`
                h-50 w-50 bg-gray-50 border border-gray rounded-lg m-20
                cursor-pointer hover:shadow-md transition-shadow duration-100
            `}
            onClick={onClick}
        >
            <img src={icon} className={className}/>
            <h3 className="text-2xl font-semibold text-gray-900 mt-auto text-center">{title}</h3>
        </div>
    )
}
