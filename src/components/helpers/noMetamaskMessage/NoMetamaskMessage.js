import React from "react";
import { WarningSvg } from "../../../assets/icons";

import "./NoMetamaskMessage.css";

const NoMetamaskMessage = () => {
  return (
    <div className="WarningMessage">
      <div className="WarningMessage-content">
        <div className="WarningMessage-warningImage">
          <WarningSvg />
        </div>
        <p>You need a Metamask wallet to use this app</p>
      </div>
    </div>
  );
};

export default NoMetamaskMessage;
