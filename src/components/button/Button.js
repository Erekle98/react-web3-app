import React, { forwardRef } from "react";
import "./Button.css";

const Button = forwardRef(({ children, className, onClick, isSubmitting }, ref) => {
  return (
    <div ref={ref} role="button" className={`Button ${className} ${isSubmitting && "disabled"}`} onClick={onClick}>
      {isSubmitting ? <span className="spinner" /> : children}
    </div>
  );
});

export default Button;
