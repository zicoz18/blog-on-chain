import Web3 from "web3";
 
let usersWeb3;
 
try {
    console.log("using users web3 in frontend");
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    const data = [{
      chainId: '0xA869',
      chainName: 'Avalanche FUJI C-Chain',
      nativeCurrency:
          {
              name: 'AVAX',
              symbol: 'AVAX',
              decimals: 18
          },
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      blockExplorerUrls: ['https://testnet.snowtrace.io/'],
    }]
    window.ethereum.request({method: 'wallet_addEthereumChain', params:data})
    usersWeb3 = new Web3(window.ethereum);
} catch (err) {
  console.log("trying to use userWeb3 in server");
}

 
export default usersWeb3;