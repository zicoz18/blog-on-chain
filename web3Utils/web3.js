import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  console.log("using web3 in frontend");
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  // since it for ropsten with alchemy and thde project is on avax fuji testnet this would not work
  console.log("using web3 on server");
  const provider = new Web3.providers.HttpProvider(
    process.env.FUJI_TESTNET_RPC
  );
  web3 = new Web3(provider);
}
 
export default web3;