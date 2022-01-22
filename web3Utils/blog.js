import web3 from './web3';
import Blog from '../artifacts/contracts/Blog.sol/Blog.json';


const instanceCreatorFunction = (address) => {
    return new web3.eth.Contract(
        JSON.parse(Blog.abi), 
        address
    );
}


export default instanceCreatorFunction;