import React, { useEffect, useState } from "react";
import getDataWithMulticall from "../ethereum/contracts/getTokensDataWithMulticall";
import { getMintedTokensByAddress } from "../ethereum/helperFuncs";
import { getMaxPerAddress } from "../ethereum/helperFuncs";

const ListMintedTokens = ({ currentAccount, newMint, newMerge }) => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);
  const [maxMintQty, setMaxMintQty] = useState("");

  useEffect(() => {
    getMaxPerAddress(setMaxMintQty);
  }, []);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds, currentAccount);
    if (currentAccount) {
      getMintedTokensByAddress(setMintedTokensByAddress, currentAccount);
    }
  }, [currentAccount, newMint, newMerge]);

  const listMintedTokens = () => {
    if (addressMintedTokenIds.length > 0) {
      return addressMintedTokenIds.map((tokenId) => {
        return <li key={tokenId}>TokenID: {tokenId}</li>;
      });
    } else {
      return <p>You have not minted any tokens yet</p>;
    }
  };

  const mintsAvailable = () => {
    return maxMintQty - mintedTokensByAddress;
  };

  return (
    <div>
      <h3>Your Minted Tokens</h3>
      <ul>{listMintedTokens()}</ul>
      <h3>Mints Available: {mintsAvailable()}</h3>
    </div>
  );
};

export default ListMintedTokens;
