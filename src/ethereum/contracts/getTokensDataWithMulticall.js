import contract from "./contract";
import { ethersProvider } from "../provider";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants";
import { Contract, Provider } from "ethcall";

const getDataWithMulticall = async (setState, currentAccount) => {
  const provider = new Provider();
  provider.init(ethersProvider());
  const multicallContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI);
  const totalTokensMinted = await contract.totalTokensMinted();
  const data = await provider.tryAll(
    Array.from({ length: totalTokensMinted }, (_, i) => {
      return multicallContract.ownerOf(i + 1);
    })
  );

  let mintedTokenIds = [];
  for (let index in data) {
    if (data[index] && data[index] === currentAccount) {
      mintedTokenIds.push(parseInt(index) + 1);
    }
  }
  setState(mintedTokenIds);
};

export default getDataWithMulticall;
