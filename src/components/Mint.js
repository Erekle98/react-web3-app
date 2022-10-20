import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "semantic-ui-react";

import { web3 } from "../ethereum/web3";
import contract from "../ethereum/contracts/contract";
import { getMintedTokensByAddress } from "../ethereum/helperFuncs";
import { MIN_MINT_QTY } from "../constants";
import ListMintedTokens from "./ListMintedTokens";
import { getPriceAndMaxPerAddress } from "../ethereum/helperFuncs";

const Mint = ({ currentAccount }) => {
  const [mintEnabled, setMintEnabled] = useState(false);
  const [mintQty, setMintQty] = useState(1);
  const [maxMintQty, setMaxMintQty] = useState("");
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);
  const [mintPrice, setMintPrice] = useState("");

  const increaseRef = useRef(null);
  const decreaseRef = useRef(null);

  useEffect(() => {
    getIfMintEnabled();
    getPriceAndMaxPerAddress(setMintPrice, setMaxMintQty);
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getMintedTokensByAddress(setMintedTokensByAddress, currentAccount);
    }
  }, [mintedTokensByAddress, currentAccount]);

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
    if (mintQty < maxMintQty - mintedTokensByAddress) {
      setMintQty(mintQty + 1);
      enableButton(decreaseRef);
      if (mintQty === maxMintQty - mintedTokensByAddress - 1) {
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
        .send({ from: currentAccount, value: web3.utils.toWei(mintPrice.toString(), "ether") * mintQty });
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
        parseInt(mintedTokensByAddress) < parseInt(maxMintQty) ? (
          <div>
            <Modal trigger={<Button>Mint</Button>}>
              <Modal.Header>Mint</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <p>
                    Mint Price: {mintPrice} ETH
                    <br />
                    Max Mints Per Wallet: {maxMintQty}
                    <br />
                    Minted Tokens By Address: {mintedTokensByAddress}
                    <br />
                    <br />
                  </p>
                  <Button.Group>
                    <Button ref={decreaseRef} onClick={decreaseMinQty}>
                      -
                    </Button>
                    <Button color="grey" disabled>
                      {mintQty}
                    </Button>
                    <Button ref={increaseRef} onClick={increaseMinQty}>
                      +
                    </Button>
                  </Button.Group>
                </Modal.Description>
                <Button
                  onClick={(e) => {
                    mint(e);
                  }}
                >
                  Mint Now
                </Button>
                <p>
                  <b>Total Price: {(mintQty * mintPrice).toFixed(3)} ETH</b>
                </p>
              </Modal.Content>
            </Modal>
            <div>
              <ListMintedTokens currentAccount={currentAccount} />
            </div>
          </div>
        ) : (
          <Button disabled>Mint Now</Button>
        )
      ) : (
        "Mint is not enabled"
      )}
    </div>
  );
};

export default Mint;
