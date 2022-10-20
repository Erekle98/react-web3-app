import React, { useRef } from "react";
import { Icon } from "semantic-ui-react";

import "./CopyToolTip.css";
import "../../Main.css";

const CopyToolTip = ({ textToCopy }) => {
  const refCopyText = useRef(null);

  const copy = async () => {
    navigator.clipboard.writeText(textToCopy);
    refCopyText.current.innerText = "Copied!";
    setTimeout(() => {
      refCopyText.current.innerText = "Copy to clipboard";
    }, 1000);
  };

  return (
    <Icon name="copy" onClick={copy} className="ToolTip pointer">
      <div ref={refCopyText} className="ToolTipText">
        Copy to clipboard
      </div>
    </Icon>
  );
};

export default CopyToolTip;
