export const metamaskProvider = () => {
  let provider;
  if (window.ethereum) {
    if (window.ethereum.isMetaMask && !window.ethereum.providers) {
      provider = window.ethereum;
    } else if (window.ethereum.providers) {
      provider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }
    return provider;
  }
};
