export const Card = ({ title, icon, className, onClick }) => {
	return (
		<div
			className={`
                h-50 w-50 bg-white border-4 border-gray-300 rounded-2xl m-5
                cursor-pointer shadow-md transition-shadow duration-100
                hover:border-gray-500
            `}
			onClick={onClick}
		>
			<img src={icon} className={className} />
			<h3 className="text-2xl font-semibold text-gray-900 mt-auto text-center">{title}</h3>
		</div>
	);
};
