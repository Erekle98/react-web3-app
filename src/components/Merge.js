import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "semantic-ui-react";
import { web3 } from "../ethereum/web3";
import contract from "../ethereum/contracts/contract";
import { getAccount } from "../ethereum/helperFuncs";
import getDataWithMulticall from "../ethereum/contracts/getTokensDataWithMulticall";

const Merge = () => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds);
  }, []);

  const ref1Select = useRef(null);
  const ref2Select = useRef(null);

  const mintedTokensToMergeDropdown = () => {
    return addressMintedTokenIds.map((tokenId) => {
      return (
        <option key={tokenId} value={tokenId}>
          {tokenId}
        </option>
      );
    });
  };

  const onSelectChange = (e, ref) => {
    for (let i = 0; i < ref.current.options.length; i++) {
      const element = ref.current.options[i];
      if (element.value === e.target.value) {
        element.hidden = true;
      } else {
        if (element.value !== "default") {
          element.hidden = false;
        }
      }
    }
  };

  const merge = async () => {
    const tokenId1 = ref1Select.current.value;
    const tokenId2 = ref2Select.current.value;
    try {
      await contract.methods.merge(tokenId1, tokenId2).send({ from: await getAccount() });
    } catch (error) {
      alert(error.message);
      return;
    }
  };

  return (
    <Modal trigger={<Button>Merge</Button>}>
      <Modal.Header>Merge</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <h3>Select the tokens you want to merge</h3>
          <select ref={ref1Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref2Select)}>
            <option value="default" disabled hidden>
              Select Token To Merge
            </option>
            {mintedTokensToMergeDropdown()}
          </select>
          <select ref={ref2Select} defaultValue="default" onChange={(e) => onSelectChange(e, ref1Select)}>
            <option value="default" disabled hidden>
              Select Token To Merge
            </option>
            {mintedTokensToMergeDropdown()}
          </select>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={merge}>Merge</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Merge;
