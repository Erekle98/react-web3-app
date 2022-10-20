import React from "react";
import { Icon } from "semantic-ui-react";

import "./CopyToolTip.css";
import "../../Main.css";

const CopyToolTip = ({ onClick }) => {
  return (
    <Icon name="copy" onClick={onClick} className="ToolTip pointer">
      <div className="ToolTipText">Copy to clipboard</div>
    </Icon>
  );
};

export default CopyToolTip;
