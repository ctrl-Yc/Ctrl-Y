export const InputField = ({ type, placeholder = '', value, onChange, className = '', disabled, min = undefined }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} onChange={onChange} 
      className={className}
      disabled={disabled}
      min={min}
    />
  );
};
