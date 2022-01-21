const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlogFactory", function () {
  it("Should return the new greeting once it's changed", async function () {
    const BlogFactory = await ethers.getContractFactory("BlogFactory");
    const blogFactory = await BlogFactory.deploy();
    await blogFactory.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
