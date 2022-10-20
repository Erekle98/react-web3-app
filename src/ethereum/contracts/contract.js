import { ethers } from "ethers";
import { ethersProvider } from "../provider";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants";

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethersProvider());

export default contract;
