import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "semantic-ui-react";

import { web3 } from "../ethereum/web3";
import contract from "../ethereum/contracts/contract";
import { getAccount } from "../ethereum/helperFuncs";
import { MAX_MINT_QTY, MIN_MINT_QTY, MINT_PRICE } from "../constants";

const Mint = () => {
  const [mintEnabled, setMintEnabled] = useState(false);
  const [mintQty, setMintQty] = useState(1);
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);

  const increaseRef = useRef(null);
  const decreaseRef = useRef(null);
  const mintRef = useRef(null);

  useEffect(() => {
    getIfMintEnabled();
  }, []);

  useEffect(() => {
    getMintedTokensByAddress();
  }, [mintedTokensByAddress]);

  const getMintedTokensByAddress = async () => {
    const mintedTokens = await contract.methods.tokensMintedByAddress(await getAccount()).call();
    setMintedTokensByAddress(mintedTokens);
  };

  //   Helper functions

  const disableButton = (buttonRef) => {
    if (!buttonRef.current.ref.current.disabled) {
      buttonRef.current.ref.current.disabled = true;
    }
  };

  const enableButton = (buttonRef) => {
    if (buttonRef.current.ref.current.disabled) {
      buttonRef.current.ref.current.disabled = false;
    }
  };

  const increaseMinQty = () => {
    if (mintQty < MAX_MINT_QTY - mintedTokensByAddress) {
      setMintQty(mintQty + 1);
      enableButton(decreaseRef);
      if (mintQty === MAX_MINT_QTY - mintedTokensByAddress - 1) {
        disableButton(increaseRef);
      }
    }
  };

  const decreaseMinQty = () => {
    if (mintQty > MIN_MINT_QTY) {
      setMintQty(mintQty - 1);
      enableButton(increaseRef);
      if (mintQty === MIN_MINT_QTY + 1) {
        disableButton(decreaseRef);
      }
    }
  };

  const addLoading = (e) => {
    e.target.classList.add("loading", "disabled");
  };

  const removeLoading = (e) => {
    e.target.classList.remove("loading", "disabled");
  };

  //   Contract functions

  const getIfMintEnabled = async () => {
    const isMintEnabled = await contract.methods.isMintEnabled().call();
    setMintEnabled(isMintEnabled);
  };

  const mint = async (e) => {
    addLoading(e);
    try {
      await contract.methods
        .mint(mintQty)
        .send({ from: await getAccount(), value: web3.utils.toWei(MINT_PRICE.toString(), "ether") * mintQty });
    } catch (error) {
      alert(error.message);
      removeLoading(e);
      return;
    }
    removeLoading(e);
  };

  return (
    <div>
      {mintEnabled ? (
        <Modal trigger={<Button ref={mintRef}>Mint Now</Button>}>
          <Modal.Header>Mint</Modal.Header>
          {mintedTokensByAddress === MAX_MINT_QTY.toString() ? (
            disableButton(mintRef)
          ) : (
            <Modal.Content>
              <Button ref={increaseRef} onClick={increaseMinQty}>
                +
              </Button>
              <div>{mintQty}</div>
              <Button ref={decreaseRef} onClick={decreaseMinQty}>
                -
              </Button>
              <Button
                onClick={(e) => {
                  mint(e);
                }}
              >
                Mint
              </Button>
              <p>
                <b>Total Price: {(mintQty * MINT_PRICE).toFixed(3)} ETH</b>
              </p>
            </Modal.Content>
          )}
        </Modal>
      ) : (
        "Mint is not enabled"
      )}
    </div>
  );
};

export default Mint;
