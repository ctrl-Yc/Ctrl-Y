export const InputField = ({ type, placeholder = '', value, onChange, className = '', disabled }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} onChange={onChange} 
      className={className}
      disabled={disabled}
    />
  );
};
