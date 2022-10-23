import React from "react";
import "./Main.css";

const EchoPage = ({ children }) => {
  return (
    <div className="Main">
      <div className="Main-width">{children}</div>
    </div>
  );
};

export default EchoPage;
