import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { metamaskProvider, ethersProvider } from "../ethereum/provider";
import NoMetamaskMessage from "./noMetamaskMessage/NoMetamaskMessage";
import { getAccount } from "../ethereum/helperFuncs";
import { CHAIN_ID } from "../ethereum/contracts/constants";

import Header from "./header/Header";
import MainPage from "./mainPage/MainPage";
import Mint from "./mint/Mint";
import Merge from "./merge/Merge";
import EchoPage from "./EchoPage";
import "./Main.css";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [newMint, setNewMint] = useState(false);
  const [newMerge, setNewMerge] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const ifConnected = async () => {
    const account = await getAccount();
    if (account) {
      if ((await ethersProvider().getNetwork()).chainId === CHAIN_ID) {
        setConnected(true);
      }
    } else {
      setConnected(false);
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    ifConnected();
  }, []);

  if (!metamaskProvider()) {
    return <NoMetamaskMessage />;
  } else if (!connected && !loading) {
    return (
      <>
        <Header onConnect={handleConnect} onAccountChange={handleAccountChange} />
        <EchoPage>
          <h1>In Order To Use This App You Need To Connect To Wallet With Goerli Test Network</h1>
        </EchoPage>
      </>
    );
  } else if (!loading) {
    return (
      <BrowserRouter>
        <Header onConnect={handleConnect} onAccountChange={handleAccountChange} />
        <EchoPage>
          <Route path="/" exact>
            <MainPage currentAccount={currentAccount} newMint={newMint} newMerge={newMerge} />
          </Route>
          <Route path="/mint" exact>
            <Mint currentAccount={currentAccount} onNewMint={handleNewMint} />
          </Route>
          <Route path="/merge" exact>
            <Merge currentAccount={currentAccount} onNewMerge={handleNewMerge} newMint={newMint} />
          </Route>
        </EchoPage>
      </BrowserRouter>
    );
  }
};

export default App;
