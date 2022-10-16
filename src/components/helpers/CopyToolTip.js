import React from "react";
import { Icon } from "semantic-ui-react";

import "./CopyToolTip.css";
import "../../Main.css";

const CopyToolTip = ({ text, onClick }) => {
  return (
    <Icon name="copy" onClick={onClick} className="ToolTip pointer">
      <div className="ToolTipText">{text}</div>
    </Icon>
  );
};

export default CopyToolTip;
