import Web3 from "web3";
import { metamaskProvider } from "./provider";

export const web3 = new Web3(metamaskProvider());
