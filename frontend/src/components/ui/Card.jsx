export const Card = ({ title, icon, onClick }) => {
    return (
        <div
            className={`
                bg-gray-50 border border-gray-200 rounded-lg p-5
                cursor-pointer hover:shadow-lg transition-shadow duration-200
            `}
            onClick={onClick}
        >
            <img src={icon} alt={`${title}アイコン`} className="w-12 h-12 mb-3 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{title}</h3>
        </div>
    )
}
