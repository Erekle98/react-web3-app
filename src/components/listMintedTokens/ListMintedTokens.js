import React, { useEffect, useState } from "react";
import { getDataWithMulticall, getMintedTokensByAddress, getMaxPerAddress } from "../../ethereum/helperFuncs";
import "./ListMintedTokens.css";

const ListMintedTokens = ({ currentAccount, newMint, newMerge, loading, onLoading }) => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);
  const [maxMintQty, setMaxMintQty] = useState("");

  useEffect(() => {
    getMaxPerAddress(setMaxMintQty);
  }, []);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds, currentAccount, onLoading);
    if (currentAccount) {
      getMintedTokensByAddress(setMintedTokensByAddress, currentAccount);
    }
  }, [currentAccount, newMint, newMerge]);

  const listMintedTokens = () => {
    if (addressMintedTokenIds.length > 0) {
      return addressMintedTokenIds.map((tokenId, index) => (
        <div key={index} className="ListMintedTokens-item">
          <div className="ListMintedTokens-item-content">
            <div className="ListMintedTokens-item-title">Token</div>
            <div className="ListMintedTokens-item-value">#{tokenId}</div>
          </div>
        </div>
      ));
    } else {
      return <div className="ListMintedTokens-noMinted">You have not minted any tokens yet</div>;
    }
  };

  const mintsAvailable = () => {
    return `Mints Available: ${maxMintQty - mintedTokensByAddress}`;
  };

  return (
    <>
      {!loading && (
        <div className="ListMintedTokens_Main">
          <div className="ListMintedTokens-title">Your Minted Tokens</div>
          <div className="ListMintedTokens-items">{listMintedTokens()}</div>
          <div className="ListMintedTokens-mintsAvailable">{mintsAvailable()}</div>
        </div>
      )}
    </>
  );
};

export default ListMintedTokens;
