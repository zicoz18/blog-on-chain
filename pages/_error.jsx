import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Dimmer, Loader, Segment } from "semantic-ui-react";


const _error = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      const handleRouteChange = (url, { shallow }) => {
        setRedirecting(true);
      }
  
      router.events.on('routeChangeStart', handleRouteChange)
  
      // If the component is unmounted, unsubscribe
      // from the event with the `off` method:
      return () => {
        router.events.off('routeChangeStart', handleRouteChange)
      }
    }, [])

    const connectWallet = async () => {
        try {
          setLoading(true);
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
          router.push('/');
        } catch (error) {
          console.log(error)
        }
        setLoading(false);
    }


    const renderNotConnectedContainer = () => (
      <>
        <Dimmer active={redirecting}>
          <Loader content="Redirecting"/>
        </Dimmer>
        <div className="flex justify-center items-center min-h-screen" >
            <div className="mb-48 flex flex-col items-center" >
                <p>You need to connect your Metamask wallet and use Avax FUJI test network to use this site</p>
                <Button 
                    onClick={connectWallet} 
                    className="text-center max-h-20"
                    loading={loading}
                    color="teal"
                    >
                  Connect to Wallet
                </Button>
            </div>
        </div>
      </>
    );


  return (
      <>
        {renderNotConnectedContainer()}
      </>
    )
};

export default _error;
