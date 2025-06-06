export const InputField = ({ type, placeholder = '', value, onChange, className = '' }) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} onChange={onChange} 
      className={className}
    />
  );
};
