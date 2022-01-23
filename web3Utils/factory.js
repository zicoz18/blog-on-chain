import web3 from './web3';
import BlogFactory from '../artifacts/contracts/BlogFactory.sol/BlogFactory.json';

const instance = new web3.eth.Contract(
    BlogFactory.abi, 
    '0xf827C84e9D4E2dC09a267CA3bC919d2c5441E1A8'
);

export default instance;