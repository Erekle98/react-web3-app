import React, { useState, useRef, useEffect } from "react";
import { Button } from "semantic-ui-react";

import { web3 } from "../ethereum/web3";
import { metamaskProvider } from "../ethereum/provider";
import CopyToolTip from "./helpers/CopyToolTip";
import "../components/helpers/CopyToolTip.css";
import { getAccount } from "../ethereum/helperFuncs";
import { CHAIN_ID, CHAIN_ID_HEX } from "../constants";

const Connection = (props) => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [toolTipText, setToolTipText] = useState("Copy to clipboard");
  const [networkType, setNetworkType] = useState("");

  const connectButtonRef = useRef(null);

  useEffect(() => {
    checkConnection();
    checkNetworkType();

    metamaskProvider().on("accountsChanged", () => {
      checkConnection();
    });

    metamaskProvider().on("chainChanged", (chainId) => {
      if (chainId !== CHAIN_ID_HEX) {
        notConnected();
        // connectToGoerli();
      } else {
        checkConnection();
      }
    });
  }, []);

  const checkNetworkType = async () => {
    setNetworkType(await web3.eth.net.getNetworkType());
  };

  const isConnected = async (currentAccount) => {
    if (currentAccount) {
      setConnected(true);
      props.onConnect(true);
      setCurrentAccount(currentAccount);
      connectButtonRef.current.ref.current.innerText =
        currentAccount.substring(0, 6) + "..." + currentAccount.substring(38, 42);
      connectButtonRef.current.ref.current.disabled = true;
    }
  };

  const notConnected = () => {
    setConnected(false);
    props.onConnect(false);
    setCurrentAccount("");
    connectButtonRef.current.ref.current.innerText = "Connect to wallet";
    connectButtonRef.current.ref.current.disabled = false;
  };

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

  const copy = async () => {
    navigator.clipboard.writeText(currentAccount);
    setToolTipText("Copied!");
    setTimeout(() => {
      setToolTipText("Copy to clipboard");
    }, 1000);
  };

  return (
    <div>
      <Button ref={connectButtonRef} onClick={connect} color="green">
        Connect to wallet
      </Button>
      {connected ? <CopyToolTip text={toolTipText} onClick={copy} /> : null}
    </div>
  );
};

export default Connection;
