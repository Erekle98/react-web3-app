import { ethers } from "ethers";

import contract from "./contracts/contract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts/constants";
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

export const getPriceAndMaxPerAddress = async (setPrice, setMaxPerWallet, setLoading) => {
  const provider = new Provider();
  provider.init(ethersProvider());
  const multicallContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const [price, maxPerWallet] = await provider.all([multicallContract.price(), multicallContract.maxPerWallet()]);
  setPrice(ethers.utils.formatEther(price.toString()));
  setMaxPerWallet(maxPerWallet.toString());
  setLoading(false);
};

export const getMaxPerAddress = async (setState) => {
  const maxPerWallet = await contract.maxPerWallet();
  setState(maxPerWallet);
};

export const getDataWithMulticall = async (setState, currentAccount, onLoading) => {
  const provider = new Provider();
  provider.init(ethersProvider());
  const multicallContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const totalTokensMinted = await contract.totalTokensMinted();
  const data = await provider.tryAll(
    Array.from({ length: totalTokensMinted }, (_, i) => {
      return multicallContract.ownerOf(i + 1);
    })
  );

  const indexes = data.reduce((r, n, i) => {
    n === currentAccount && r.push(i + 1);
    return r;
  }, []);

  setState(indexes);
  onLoading();
};
