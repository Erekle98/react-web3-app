import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

import ListMintedTokens from "./ListMintedTokens";

const MainPage = ({ currentAccount, newMint, newMerge }) => {
  return (
    <div>
      <ListMintedTokens currentAccount={currentAccount} newMint={newMint} newMerge={newMerge} />
      <Link to="/mint">
        <Button primary>Mint</Button>
      </Link>
      <Link to="/merge">
        <Button primary>Merge</Button>
      </Link>
    </div>
  );
};

export default MainPage;
