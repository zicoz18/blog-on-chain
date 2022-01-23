import web3 from './web3';
import BlogFactory from '../artifacts/contracts/BlogFactory.sol/BlogFactory.json';

const instance = new web3.eth.Contract(
    BlogFactory.abi, 
    '0x62E910488991497450077C7Ac4f9e67ddC337Ea3'
);

export default instance;