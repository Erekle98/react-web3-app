import React, { useLayoutEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { metamaskProvider, ethersProvider } from "../ethereum/provider";
import NoMetamaskMessage from "./helpers/noMetamaskMessage/NoMetamaskMessage";
import Header from "./header/Header";
import MainPage from "./MainPage";
import Mint from "./Mint";
import Merge from "./Merge";
import "./Main.css";
import { getAccount } from "../ethereum/helperFuncs";
import { CHAIN_ID } from "../ethereum/contracts/constants";

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
        <h1>
          You Need To Connect To Wallet With Goerli Test Network <br /> In Order To Use This App
        </h1>
      </>
    );
  } else if (!loading) {
    return (
      <div>
        <BrowserRouter>
          <Header onConnect={handleConnect} onAccountChange={handleAccountChange} />
          <Route path="/" exact>
            <MainPage currentAccount={currentAccount} newMint={newMint} newMerge={newMerge} />
          </Route>
          <Route path="/mint" exact>
            <Mint currentAccount={currentAccount} onNewMint={handleNewMint} />
          </Route>
          <Route path="/merge" exact>
            <Merge currentAccount={currentAccount} onNewMerge={handleNewMerge} newMint={newMint} />
          </Route>
        </BrowserRouter>
      </div>
    );
  }
};

export default App;
