import web3 from './web3';
import BlogFactory from '../artifacts/contracts/BlogFactory.sol/BlogFactory.json';

const instance = new web3.eth.Contract(
    BlogFactory.abi, 
    '0xf52247D91F31cE5d06F19F97B686dC7C061E8914'
);

export default instance;