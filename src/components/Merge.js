import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import contract from "../ethereum/contracts/contract";
import { getDataWithMulticall } from "../ethereum/helperFuncs";
import { ethersProvider } from "../ethereum/provider";
import Button from "./button/Button";

const Merge = ({ currentAccount, newMint, onNewMerge }) => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);
  const [disableMergeBtn, setDisableMergeBtn] = useState(true);
  const [newMerge, setNewMerge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds, currentAccount, setLoading);
  }, [currentAccount, newMint, newMerge]);

  let history = useHistory();

  const ref1Select = useRef(null);
  const ref2Select = useRef(null);

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
    <div>
      <h1>Merge</h1>
      <h3>Select tokens you want to merge</h3>
      <select ref={ref1Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref2Select)}>
        {mintedTokensInMergeDropdown()}
      </select>
      <select ref={ref2Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref1Select)}>
        {mintedTokensInMergeDropdown()}
      </select>
      <Button isSubmitting={isSubmitting} className={disableMergeBtn ? "disabled" : ""} onClick={merge}>
        Merge
      </Button>
    </div>
  );
};

export default Merge;
