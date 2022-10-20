import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

import { metamaskProvider } from "../ethereum/provider";
import { WarningMessage } from "./helpers/Message";
import MainPage from "./MainPage";
import Connection from "./Connection";
import Mint from "./Mint";
import Merge from "./Merge";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const [newMint, setNewMint] = useState(false);
  const [newMerge, setNewMerge] = useState(false);

  const handleConnect = (connection) => {
    setConnected(connection);
  };
  const handleAccountChange = (account) => {
    setCurrentAccount(account);
  };

  const handleNewMint = (newMint) => {
    setNewMint(newMint);
  };

  const handleNewMerge = (newMerge) => {
    setNewMerge(newMerge);
  };

  if (!metamaskProvider()) {
    return <WarningMessage header="You need a Metamask wallet to use this app" />;
  } else if (!connected) {
    return (
      <Menu>
        <Menu.Item position="right">
          <Connection onConnect={handleConnect} onAccountChange={handleAccountChange} />
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <div>
        <BrowserRouter>
          <Container>
            <div>
              <Menu>
                <Menu.Item position="right">
                  <Connection onConnect={handleConnect} onAccountChange={handleAccountChange} />
                </Menu.Item>
              </Menu>
            </div>
            <Route path="/" exact>
              <MainPage currentAccount={currentAccount} newMint={newMint} newMerge={newMerge} />
            </Route>
            <Route path="/mint" exact>
              <Mint currentAccount={currentAccount} onNewMint={handleNewMint} />
            </Route>
            <Route path="/merge" exact>
              <Merge currentAccount={currentAccount} onNewMerge={handleNewMerge} newMint={newMint} />
            </Route>
          </Container>
        </BrowserRouter>
      </div>
    );
  }
};

export default App;
