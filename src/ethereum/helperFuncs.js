import { web3 } from "./web3";
import contract from "./contracts/contract";
import multicall from "./multicall";
import { CONTRACT_ADDRESS } from "../constants";

export const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const getMintedTokensByAddress = async (setState, currentAccount) => {
  const mintedTokens = await contract.methods.tokensMintedByAddress(currentAccount).call();
  setState(mintedTokens);
};

export const getPriceAndMaxPerAddress = async (setPrice, setMaxPerWallet) => {
  const calls = [
    {
      target: CONTRACT_ADDRESS,
      callData: contract.methods.price().encodeABI(),
    },
    {
      target: CONTRACT_ADDRESS,
      callData: contract.methods.maxPerWallet().encodeABI(),
    },
  ];
  const [price, maxPerWallet] = await multicall.methods.tryAggregate(true, calls).call();
  setPrice(web3.utils.fromWei(web3.eth.abi.decodeParameter("uint256", price.returnData), "ether"));
  setMaxPerWallet(web3.eth.abi.decodeParameter("uint256", maxPerWallet.returnData));
};

export const getMaxPerAddress = async (setState) => {
  const maxPerWallet = await contract.methods.maxPerWallet().call();
  setState(maxPerWallet);
};
