import { ethers } from "ethers";
import { ethersProvider } from "../provider";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constants";

let contract;
if (ethersProvider()) {
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethersProvider());
}

export default contract;
