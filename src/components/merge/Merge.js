import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import contract from "../../ethereum/contracts/contract";
import { getDataWithMulticall } from "../../ethereum/helperFuncs";
import { ethersProvider } from "../../ethereum/provider";
import Button from "../button/Button";
import "./Merge.css";

const Merge = ({ currentAccount, newMint, onNewMerge }) => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);
  const [disableMergeBtn, setDisableMergeBtn] = useState(true);
  const [newMerge, setNewMerge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds, currentAccount, handleLoading);
  }, [currentAccount, newMint, newMerge]);

  let history = useHistory();

  const ref1Select = useRef(null);
  const ref2Select = useRef(null);

  const handleLoading = () => {
    setLoading(false);
  };

  const addLoading = () => {
    setIsSubmitting(true);
  };

  const removeLoading = () => {
    setIsSubmitting(false);
  };

  const disableEnableMergeButton = () => {
    if (
      ref1Select.current.value &&
      ref2Select.current.value &&
      ref1Select.current.value !== "default" &&
      ref2Select.current.value !== "default"
    ) {
      setDisableMergeBtn(false);
    } else {
      setDisableMergeBtn(true);
    }
  };

  const mintedTokensInMergeDropdown = () => {
    const defaultOption = (
      <option key="default" value="default" disabled hidden>
        Select Token To Merge
      </option>
    );
    return [
      defaultOption,
      ...addressMintedTokenIds.map((tokenId) => {
        return (
          <option key={tokenId} value={tokenId}>
            {tokenId}
          </option>
        );
      }),
    ];
  };

  const onSelectChange = (e, ref) => {
    disableEnableMergeButton();
    for (let i = 0; i < ref.current.options.length; i++) {
      const element = ref.current.options[i];
      if (element.value === e.target.value) {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
    }
  };

  const merge = async () => {
    const tokenId1 = ref1Select.current.value;
    const tokenId2 = ref2Select.current.value;
    addLoading();
    try {
      const merge = await contract.connect(ethersProvider().getSigner()).merge(tokenId1, tokenId2);
      await merge.wait().then(() => {
        setNewMerge(true);
        onNewMerge(true);
      });
    } catch (error) {
      alert(error.message);
      removeLoading();
      return;
    }
    removeLoading();
    history.push("/");
  };

  return (
    <>
      {!loading && (
        <div className="Merge_Main">
          <div className="Merge-title">Merge</div>
          <div className="Merge-box">
            <div className="Merge-box-title">Select tokens you want to merge</div>
            <div className="Merge-box-selectDiv">
              <select ref={ref1Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref2Select)}>
                {mintedTokensInMergeDropdown()}
              </select>
              <b>to</b>
              <select ref={ref2Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref1Select)}>
                {mintedTokensInMergeDropdown()}
              </select>
            </div>
            <div className="Merge-box-buttonDiv">
              <Button isSubmitting={isSubmitting} className={disableMergeBtn ? "disabled" : ""} onClick={merge}>
                Merge
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Merge;
