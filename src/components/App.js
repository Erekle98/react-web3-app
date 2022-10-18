import React, { useState } from "react";
import { Container } from "semantic-ui-react";

import { metamaskProvider } from "../ethereum/provider";
import { WarningMessage } from "./helpers/Message";
import Connection from "./Connection";
import Mint from "./Mint";
import ListMintedTokens from "./ListMintedTokens";
import Merge from "./Merge";

const App = () => {
  const [connected, setConnected] = useState(false);
  const handleConnect = (connection) => {
    setConnected(connection);
  };

  if (!metamaskProvider()) {
    return <WarningMessage header="You need a Metamask wallet to use this app" />;
  } else {
    return (
      <Container>
        <Connection onConnect={handleConnect} />
        {connected ? <Mint /> : null}
        {connected ? <ListMintedTokens /> : null}
        {connected ? <Merge /> : null}
      </Container>
    );
  }
};

export default App;
