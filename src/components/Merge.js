import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "semantic-ui-react";
import contract from "../ethereum/contracts/contract";
import getDataWithMulticall from "../ethereum/contracts/getTokensDataWithMulticall";

const Merge = ({ currentAccount }) => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);
  const [disableMergeBtn, setDisableMergeBtn] = useState(true);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds);
  }, [currentAccount]);

  const ref1Select = useRef(null);
  const ref2Select = useRef(null);

  const addLoading = (e) => {
    e.target.classList.add("loading", "disabled");
  };

  const removeLoading = (e) => {
    e.target.classList.remove("loading", "disabled");
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

  const mintedTokensToMergeDropdown = () => {
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

  const merge = async (e) => {
    const tokenId1 = ref1Select.current.value;
    const tokenId2 = ref2Select.current.value;
    addLoading(e);
    try {
      await contract.methods.merge(tokenId1, tokenId2).send({ from: currentAccount });
    } catch (error) {
      alert(error.message);
      removeLoading(e);
      return;
    }
    removeLoading(e);
  };

  return (
    <Modal
      trigger={<Button>Merge</Button>}
      onClose={() => {
        setDisableMergeBtn(true);
      }}
    >
      <Modal.Header>Merge</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <h3>Select the tokens you want to merge</h3>
          <select ref={ref1Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref2Select)}>
            {mintedTokensToMergeDropdown()}
          </select>
          <select ref={ref2Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref1Select)}>
            {mintedTokensToMergeDropdown()}
          </select>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={disableMergeBtn} onClick={merge}>
          Merge
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Merge;
