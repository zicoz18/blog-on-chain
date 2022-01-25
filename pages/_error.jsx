import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const _error = () => {
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
          let chainId = await ethereum.request({ method: 'eth_chainId' });
          console.log("Connected to chain " + chainId);
          // String, hex code of the chainId of the Rinkebey test network
          const fujiChainId = "0xA869"; 
          if (chainId !== fujiChainId) {
            alert("You are not connected to the Fuji Test Network!");
          }
          console.log("We have the ethereum object", ethereum);
        }
    
        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
        } else {
          console.log("No authorized account found")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, []);

        /*
  * Implement your connectWallet method here
  */
    const connectWallet = async () => {
            try {
              const { ethereum } = window;
        
              if (!ethereum) {
                alert("Get MetaMask!");
                return;
              }
        
              /*
              * Fancy method to request access to account.
              */
              const accounts = await ethereum.request({ method: "eth_requestAccounts" });
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
              await window.ethereum.request({method: 'wallet_addEthereumChain', params:data})
            //   usersWeb3 = new Web3(window.ethereum);


              /*
              * Boom! This should print out public address once we authorize Metamask.
              */
              console.log("Connected", accounts[0]);
              setCurrentAccount(accounts[0]); 
              // Setup listener! This is for the case where a user comes to our site
              // and connected their wallet for the first time.
            //   setupEventListener();
              console.log("pushing back to main page...");
              router.push('/');
            } catch (error) {
              console.log(error)
            }
    }


    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
          Connect to Wallet
        </button>
      );
    
      const renderMintUI = () => (
        <button onClick={() => (console.log("account connected and can minft nfts with account: ", currentAccount))} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      )

  return <div>
      {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}

  </div>;
};

export default _error;
