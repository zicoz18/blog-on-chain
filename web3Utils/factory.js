import web3 from './web3';
import BlogFactory from '../artifacts/contracts/BlogFactory.sol/BlogFactory.json';

const instance = new web3.eth.Contract(
    BlogFactory.abi, 
    '0xace8267B69C2ae98Fed8060F827c47EA88497e35'
);

export default instance;