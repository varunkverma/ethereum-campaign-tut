// configure web3 with a provider from metamask
import Web3 from "web3";

let web3;

// if (
//   global.window &&
//   global.window.ethereum &&
//   typeof global.window.ethereum != "undefined"
// ) {
//   web3 = new Web3(window.ethereum);
// }

// code is executed in browser and metamask is available
if (typeof window !== "undefined" && typeof window.ethereum != "undefined") {
  //the recommended way to connect to MetaMask is with ethereum.request(). The function takes an object with a JSON-RPC method (like eth_requestAccounts) and returns a Promise.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // code is executed on server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(process.env.INFURA_ROPSTEN);
  web3 = new Web3(provider);
}

export default web3;
