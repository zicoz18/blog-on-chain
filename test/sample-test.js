const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlogFactory", function () {
  it("Should return the new greeting once it's changed", async function () {
    const BlogFactory = await ethers.getContractFactory("BlogFactory");
    const blogFactory = await BlogFactory.deploy();
    await blogFactory.deployed();
    console.log("BlogFactory's address: ", blogFactory.address);

    const createBlogTx = await blogFactory.createBlog();
    await createBlogTx.wait();

    const deployedBlogs = await blogFactory.getDeployedBlogs();
    console.log("Deployed blogs address: ", deployedBlogs[0]);
    const deployedBlogAddress = deployedBlogs[0];

    const BlogContract = await ethers.getContractFactory("Blog");
    const blogContract = await BlogContract.attach(
      deployedBlogAddress
    );
    const articleCount = await blogContract.articleCount();
    console.log("Newly deployed blog contract's article count: ", articleCount);

    const blogContractOwnerAddress = await blogContract.owner();
    console.log("Owner of the blogContract: ", blogContractOwnerAddress)
    const publishArticleTx = await blogContract.publishArticle("This is the header", "and this is the content.");

    await publishArticleTx.wait();

    const updatedArticleCount = await blogContract.articleCount();
    console.log("Newly deployed blog contract's article count: ", updatedArticleCount);

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
