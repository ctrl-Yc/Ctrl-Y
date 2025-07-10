export const CustomButton = ({ label, onClick, type = 'button', className = '', disabled }) => {
  return (
     <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      >
        {label}
     </button>
  );
};
