import { web3 } from "../web3";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants";

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export default contract;
