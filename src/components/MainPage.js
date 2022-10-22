import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ListMintedTokens from "./ListMintedTokens";
import { getMintedTokensByAddress, getMaxPerAddress } from "../ethereum/helperFuncs";
import Button from "./button/Button";

const MainPage = ({ currentAccount, newMint, newMerge }) => {
  const [mintedTokensByAddress, setMintedTokensByAddress] = useState(0);
  const [maxMintQty, setMaxMintQty] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaxPerAddress(setMaxMintQty);
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getMintedTokensByAddress(setMintedTokensByAddress, currentAccount);
    }
  }, [mintedTokensByAddress, currentAccount, newMint]);

  const handleLoading = () => {
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <ListMintedTokens
        currentAccount={currentAccount}
        newMint={newMint}
        newMerge={newMerge}
        loading={loading}
        onLoading={handleLoading}
      />
      {!loading && (
        <>
          {parseInt(mintedTokensByAddress) < parseInt(maxMintQty) ? (
            <Link to="/mint">
              <Button>Mint</Button>
            </Link>
          ) : (
            <Button className="disabled">Mint</Button>
          )}
          <Link to="/merge">
            <Button>Merge</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default MainPage;
