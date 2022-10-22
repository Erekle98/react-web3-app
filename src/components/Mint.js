import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";

import contract from "../ethereum/contracts/contract";
import { getMintedTokensByAddress, getPriceAndMaxPerAddress } from "../ethereum/helperFuncs";
import { MIN_MINT_QTY } from "../ethereum/contracts/constants";
import { ethersProvider } from "../ethereum/provider";
import Button from "./button/Button";

const Mint = ({ currentAccount, onNewMint }) => {
  const [mintEnabled, setMintEnabled] = useState(false);
  const [mintQty, setMintQty] = useState(1);
  const [maxMintQty, setMaxMintQty] = useState("");
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);
  const [mintPrice, setMintPrice] = useState("");
  const [newMint, setNewMint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const increaseRef = useRef(null);
  const decreaseRef = useRef(null);

  let history = useHistory();

  useEffect(() => {
    getIfMintEnabled();
    getPriceAndMaxPerAddress(setMintPrice, setMaxMintQty, setLoading);
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getMintedTokensByAddress(setMintedTokensByAddress, currentAccount);
    }
  }, [mintedTokensByAddress, currentAccount, newMint]);

  //   Helper functions

  const addLoading = (e) => {
    setIsSubmitting(true);
  };

  const removeLoading = (e) => {
    setIsSubmitting(false);
  };

  //   Contract functions

  const getIfMintEnabled = async () => {
    const isMintEnabled = await contract.isMintEnabled();
    setMintEnabled(isMintEnabled);
  };

  const mint = async () => {
    addLoading();
    try {
      const mint = await contract.connect(ethersProvider().getSigner()).mint(mintQty, {
        value: parseInt(ethers.utils.parseEther(mintPrice).toString()) * mintQty,
      });
      await mint.wait().then(() => {
        setNewMint(true);
        onNewMint(true);
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
      {!loading && (
        <>
          {mintEnabled ? (
            parseInt(mintedTokensByAddress) < parseInt(maxMintQty) ? (
              <div>
                <h1>Mint</h1>
                <p>
                  Mint Price: {mintPrice} ETH
                  <br />
                  Max Mints Per Wallet: {maxMintQty}
                  <br />
                  Minted Tokens By Address: {mintedTokensByAddress}
                  <br />
                  <br />
                </p>
                <Button
                  className={`${mintQty === MIN_MINT_QTY ? "disabled" : ""}`}
                  ref={decreaseRef}
                  onClick={() => setMintQty(mintQty - 1)}
                >
                  -
                </Button>
                <Button className="disabled">{mintQty}</Button>
                <Button
                  className={`${mintQty === maxMintQty - mintedTokensByAddress ? "disabled" : ""}`}
                  ref={increaseRef}
                  onClick={() => {
                    setMintQty(mintQty + 1);
                  }}
                >
                  +
                </Button>
                <Button isSubmitting={isSubmitting} onClick={mint}>
                  Mint Now
                </Button>
                <p>
                  <b>Total Price: {(mintQty * mintPrice).toFixed(3)} ETH</b>
                </p>
              </div>
            ) : (
              <Button className="disabled">Mint</Button>
            )
          ) : (
            "Mint is not enabled"
          )}
        </>
      )}
    </div>
  );
};

export default Mint;
