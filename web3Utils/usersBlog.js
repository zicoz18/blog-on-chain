import usersWeb3 from './usersWeb3';
import Blog from '../artifacts/contracts/Blog.sol/Blog.json';


const instanceCreatorFunction = (address) => {
    return new usersWeb3.eth.Contract(
        Blog.abi, 
        address
    );
}


export default instanceCreatorFunction;