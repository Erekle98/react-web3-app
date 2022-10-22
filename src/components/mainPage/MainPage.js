import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ListMintedTokens from "../listMintedTokens/ListMintedTokens";
import { getMintedTokensByAddress, getMaxPerAddress } from "../../ethereum/helperFuncs";
import Button from "../button/Button";
import "./MainPage.css";

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
    <div className="MainPage_Main">
      <ListMintedTokens
        currentAccount={currentAccount}
        newMint={newMint}
        newMerge={newMerge}
        loading={loading}
        onLoading={handleLoading}
      />
      {!loading && (
        <div className="MainPage-bottom">
          {parseInt(mintedTokensByAddress) < parseInt(maxMintQty) ? (
            <Link to="/mint">
              <Button className="BigButton">Mint</Button>
            </Link>
          ) : (
            <Button className="BigButton disabled">Mint</Button>
          )}
          <Link to="/merge">
            <Button className="BigButton">Merge</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MainPage;
