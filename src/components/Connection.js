import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";

import { web3 } from "../ethereum/web3";
import { metamaskProvider } from "../ethereum/provider";
import CopyToolTip from "./helpers/CopyToolTip";
import "../components/helpers/CopyToolTip.css";
import { getAccount } from "../ethereum/helperFuncs";
import { CHAIN_ID, CHAIN_ID_HEX } from "../constants";

const Connection = ({ onAccountChange, onConnect }) => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [networkType, setNetworkType] = useState("");

  useEffect(() => {
    checkConnection();
    checkNetworkType();

    metamaskProvider().on("accountsChanged", (accounts) => {
      checkConnection();
      setCurrentAccount(accounts[0]);
      onAccountChange(accounts[0]);
    });

    metamaskProvider().on("chainChanged", (chainId) => {
      if (chainId !== CHAIN_ID_HEX) {
        notConnected();
      } else {
        checkConnection();
      }
    });
  }, []);

  // Helper functions

  const checkNetworkType = async () => {
    setNetworkType(await web3.eth.net.getNetworkType());
  };

  const isConnected = async (currentAccount) => {
    if (currentAccount) {
      setConnected(true);
      onConnect(true);
      setCurrentAccount(currentAccount);
    }
  };

  const notConnected = () => {
    setConnected(false);
    onConnect(false);
    setCurrentAccount("");
  };

  const copy = async (e) => {
    console.log(e.target);
    navigator.clipboard.writeText(currentAccount);
    e.target.lastChild.nodeValue = "Copied!";
    setTimeout(() => {
      e.target.lastChild.nodeValue = "Copy to clipboard";
    }, 1000);
  };

  // Connect Functions

  const connectToGoerli = async () => {
    try {
      await metamaskProvider()
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_ID_HEX }],
        })
        .then(async () => {
          isConnected(await getAccount());
        });
    } catch (error) {
      notConnected();
      alert(error.message);
      return;
    }
  };

  const checkConnection = async () => {
    const account = await getAccount();
    onAccountChange(account);
    if (account) {
      if ((await web3.eth.net.getId()) === CHAIN_ID) {
        isConnected(account);
      }
    } else {
      notConnected();
    }
  };

  const connect = async () => {
    try {
      await metamaskProvider().request({ method: "eth_requestAccounts" });
      const account = await getAccount();
      onAccountChange(account);
      if ((await web3.eth.net.getId()) === CHAIN_ID) {
        isConnected(account);
      } else {
        connectToGoerli().catch((error) => {
          alert(error.message);
        });
      }
    } catch (error) {
      notConnected();
      alert(error.message);
      return;
    }
  };

  return (
    <div>
      {connected ? (
        <div>
          Connected to {networkType} network with account:{" "}
          {currentAccount ? currentAccount.substring(0, 6) + "..." + currentAccount.substring(38, 42) : null}
          <CopyToolTip textToCopy={currentAccount} />
        </div>
      ) : (
        <Button onClick={connect} color="green">
          Connect to wallet
        </Button>
      )}
    </div>
  );
};

export default Connection;
