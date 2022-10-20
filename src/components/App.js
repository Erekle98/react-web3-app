import React, { useState } from "react";
import { Container } from "semantic-ui-react";

import { metamaskProvider } from "../ethereum/provider";
import { WarningMessage } from "./helpers/Message";
import Connection from "./Connection";
import Mint from "./Mint";
import Merge from "./Merge";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const handleConnect = (connection) => {
    setConnected(connection);
  };
  const handleAccountChange = (account) => {
    setCurrentAccount(account);
  };

  if (!metamaskProvider()) {
    return <WarningMessage header="You need a Metamask wallet to use this app" />;
  } else if (!connected) {
    return (
      <Container>
        <Connection onConnect={handleConnect} onAccountChange={handleAccountChange} />
      </Container>
    );
  } else {
    return (
      <Container>
        <Connection onConnect={handleConnect} onAccountChange={handleAccountChange} />
        <Mint currentAccount={currentAccount} />
        <Merge currentAccount={currentAccount} />
      </Container>
    );
  }
};

export default App;
