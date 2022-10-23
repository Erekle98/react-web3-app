import React, { useState, useEffect } from "react";

import { metamaskProvider, ethersProvider } from "../../ethereum/provider";
import CopyToolTip from "../copyToolTip/CopyToolTip";
import "./Connection.css";
import { getAccount } from "../../ethereum/helperFuncs";
import Button from "../button/Button";
import { ERROR_MESSAGE, CHAIN_ID_HEX, CHAIN_ID } from "../../ethereum/contracts/constants";

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
    setNetworkType((await ethersProvider().getNetwork()).name);
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
      alert(ERROR_MESSAGE);
      return;
    }
  };

  const checkConnection = async () => {
    const account = await getAccount();
    onAccountChange(account);
    if (account) {
      if ((await ethersProvider().getNetwork()).chainId === CHAIN_ID) {
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
      if ((await ethersProvider().getNetwork()).chainId === CHAIN_ID) {
        isConnected(account);
      } else {
        connectToGoerli().catch((error) => {
          alert(ERROR_MESSAGE);
        });
      }
    } catch (error) {
      notConnected();
      alert(ERROR_MESSAGE);
      return;
    }
  };

  return (
    <div>
      {connected ? (
        <div className="Connection-addressNetwork">
          <div className="Connection-addressNetwork-address">
            <span>
              Account:{" "}
              {currentAccount ? currentAccount.substring(0, 6) + "..." + currentAccount.substring(38, 42) : null}
            </span>
            <span>
              <CopyToolTip textToCopy={currentAccount} />
            </span>
          </div>
          <span>Network: {networkType}</span>
        </div>
      ) : (
        <Button onClick={connect}>Connect to wallet</Button>
      )}
    </div>
  );
};

export default Connection;
