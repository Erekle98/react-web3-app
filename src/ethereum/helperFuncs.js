import { ethers } from "ethers";

import contract from "./contracts/contract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import { ethersProvider } from "./provider";
import { Contract, Provider } from "ethcall";

export const getAccount = async () => {
  try {
    const signer = ethersProvider().getSigner();
    const account = await signer.getAddress();
    return account;
  } catch (error) {
    return;
  }
};

export const getMintedTokensByAddress = async (setState, currentAccount) => {
  const mintedTokens = await contract.tokensMintedByAddress(currentAccount);
  setState(mintedTokens.toString());
};

export const getPriceAndMaxPerAddress = async (setPrice, setMaxPerWallet) => {
  const provider = new Provider();
  provider.init(ethersProvider());
  const multicallContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [price, maxPerWallet] = await provider.all([multicallContract.price(), multicallContract.maxPerWallet()]);
  setPrice(ethers.utils.formatEther(price.toString()));
  setMaxPerWallet(maxPerWallet.toString());
};

export const getMaxPerAddress = async (setState) => {
  const maxPerWallet = await contract.maxPerWallet();
  setState(maxPerWallet);
};
