import React, { useEffect, useState } from "react";
import getDataWithMulticall from "../ethereum/contracts/getTokensDataWithMulticall";

const ListMintedTokens = () => {
  const [addressMintedTokenIds, setAddressMintedTokenIds] = useState([]);

  useEffect(() => {
    getDataWithMulticall(setAddressMintedTokenIds);
  }, []);

  const listMintedTokens = () => {
    return addressMintedTokenIds.map((tokenId) => {
      return <li key={tokenId}>{tokenId}</li>;
    });
  };

  return (
    <div>
      <h3>Your Minted Token Ids</h3>
      <ul>{listMintedTokens()}</ul>
    </div>
  );
};

export default ListMintedTokens;
