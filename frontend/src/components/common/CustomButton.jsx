export const CustomButton = ({ label, onClick, type = 'button', className = '', disabled = false }) => {
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
