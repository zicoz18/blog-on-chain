import web3 from './web3';
import BlogFactory from '../artifacts/contracts/BlogFactory.sol/BlogFactory.json';

const instance = new web3.eth.Contract(
    BlogFactory.abi, 
    '0xaFbbC10AFAcA3fcc9393DbAEe2A5aBF256A0517e'
);

export default instance;