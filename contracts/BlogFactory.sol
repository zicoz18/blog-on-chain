//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Blog.sol";

contract BlogFactory {
    address[] public deployedBlogs;

    event BlogCreated(address blogAddress);

    function createBlog(string memory blogsName) public {
        address newBlog = address(new Blog(msg.sender, blogsName));
        deployedBlogs.push(newBlog);
        emit BlogCreated(newBlog);
    }

    function getDeployedBlogs() public view returns (address[] memory) {
        return deployedBlogs;
    }
}