export const InputField = ({
	type,
	placeholder = '',
	value,
	onChange,
	className = '',
	disabled,
	onKeyDown = () => {},
}) => {
	return (
		<input
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			className={className}
			disabled={disabled}
			onKeyDown={onKeyDown}
		/>
	);
};
