import { web3 } from "../web3";
import contract from "./contract";
import { CONTRACT_ADDRESS } from "../../constants";
import multicall from "../multicall";
import { getAccount } from "../helperFuncs";

const getDataWithMulticall = async (setState) => {
  const multicallData = async () => {
    const totalTokensMinted = await contract.methods.totalTokensMinted().call();
    let data = [];
    for (let i = 1; i <= totalTokensMinted; i++) {
      data.push({
        target: CONTRACT_ADDRESS,
        callData: contract.methods.ownerOf(i).encodeABI(),
      });
    }
    return data;
  };

  const data = await multicall.methods.tryAggregate(false, await multicallData()).call();

  let mintedTokenIds = [];
  for (let index in data) {
    if (data[index].success) {
      const owner = web3.eth.abi.decodeParameter("address", data[index].returnData);
      if (owner === (await getAccount())) {
        mintedTokenIds.push(parseInt(index) + 1);
      }
    }
  }
  setState(mintedTokenIds);
};

export default getDataWithMulticall;
