import { ethers } from "ethers";

export const metamaskProvider = () => {
  let metamaskProvider;
  if (window.ethereum) {
    if (window.ethereum.isMetaMask && !window.ethereum.providers) {
      metamaskProvider = window.ethereum;
    } else if (window.ethereum.providers) {
      metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    return metamaskProvider;
  }
};

export const ethersProvider = () => {
  if (metamaskProvider()) {
    return new ethers.providers.Web3Provider(metamaskProvider());
  }
};
