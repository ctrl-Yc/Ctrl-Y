import React from "react";

function Btn({ children, onClick }) {
    return(
    <button onClick={onClick}>
      {children}
    </button>
  );
}

export default Btn;

