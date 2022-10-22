import React, { useRef } from "react";
import { CopySvg } from "../../../assets/icons";

import "./CopyToolTip.css";

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
    <div className="ToolTip pointer">
      <div onClick={copy} className="copySvg">
        <CopySvg />
      </div>
      <span ref={refCopyText} className="ToolTipText">
        Copy to clipboard
      </span>
    </div>
  );
};

export default CopyToolTip;
