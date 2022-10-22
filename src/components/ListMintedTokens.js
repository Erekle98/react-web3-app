import React, { useEffect, useState } from "react";
import { getDataWithMulticall, getMintedTokensByAddress, getMaxPerAddress } from "../ethereum/helperFuncs";

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
      return (
        <ul>
          {addressMintedTokenIds.map((tokenId, index) => (
            <li key={index}>TokenID: {tokenId}</li>
          ))}
        </ul>
      );
    } else {
      return <p>You have not minted any tokens yet</p>;
    }
  };

  const mintsAvailable = () => {
    return `Mints Available: ${maxMintQty - mintedTokensByAddress}`;
  };

  return (
    <div>
      {!loading && (
        <>
          <h3>Your Minted Tokens</h3>
          <div>{listMintedTokens()}</div>
          <h3>{mintsAvailable()}</h3>
        </>
      )}
    </div>
  );
};

export default ListMintedTokens;
