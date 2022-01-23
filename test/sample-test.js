const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

// Function for us to check if async functions will be throwing any errors
const expectThrowsAsync = async (method, errorMessage) => {
  let error = null
  try {
    await method()
  }
  catch (err) {
    error = err
  }
  expect(error).to.be.an('Error')
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage)
  }
}

const articleInitialLikeCount = 0;
const articleInitialDonatedAmount = 0;

const firstArticleHeaderValue = "this is the header";
const firstArticleContentValue = "and this is the content";

const secondArticleHeaderValue = "this is a second header";
const secondArticleContentValue = "and this is the second content";

const newlyCreatedBlogsName = "newly created blog's name";
const publishedArticleCountBeforeEach = 2;


// let accounts;
let owner;
let addr1;
let addr2;

let factoryContract;
let blogAddress;
let blogContract;

// runs beforeEach it 
beforeEach(async () => {
  
    [owner, addr1, addr2] = await ethers.getSigners();
    const BlogFactory = await ethers.getContractFactory("BlogFactory");
    factoryContract = await BlogFactory.deploy();
    await factoryContract.deployed();
    
    const createBlogTx = await factoryContract.createBlog(newlyCreatedBlogsName);
    await createBlogTx.wait();

    [blogAddress] = await factoryContract.getDeployedBlogs();

    const BlogContract = await ethers.getContractFactory("Blog");
    blogContract = await BlogContract.attach(
      blogAddress
    );

    const publishArticleTx = await blogContract.publishArticle(firstArticleHeaderValue, firstArticleContentValue);
    await publishArticleTx.wait();

    const publishArticleTx2 = await blogContract.publishArticle(secondArticleHeaderValue, secondArticleContentValue);
    await publishArticleTx2.wait();
})


describe("Article", function () {
  it("Should return array of articles published to the blog", async function () {
    const articleCount = await blogContract.articleCount();
    expect(articleCount, 2);
    const articles = await Promise.all(
      Array(parseInt(articleCount))
          .fill()
          .map((element, index) => (
            blogContract.articles(index)
          ))
    );
    expect(articles).to.be.an('array');
  });

  it("Article values correctly assigned", async () => {
    const firstArticle = (await blogContract.articles(0));
    assert.equal(firstArticle.header, firstArticleHeaderValue);
    assert.equal(firstArticle.content, firstArticleContentValue);
    assert.equal(firstArticle.likeCount, articleInitialLikeCount);
    assert.equal(firstArticle.donatedAmount, articleInitialDonatedAmount);
  });

  it("Some address that is not the owner of the blogContract cannot publish an article", async () => {
    expectThrowsAsync(async () => {
      const publishArticleTx = await blogContract.connect(addr1).publishArticle("random header", "random content");
      await publishArticleTx.wait();
    });
  });

  it("Article Count gets incremented correctly", async () => {
    const articleCount = (await blogContract.articleCount()).toNumber();
    const publishArticleTx = await blogContract.publishArticle("random header", "random content");
    await publishArticleTx.wait();
    const updatedArticleCount = (await blogContract.articleCount()).toNumber();
    expect(articleCount + 1).to.equal(updatedArticleCount);
  });
});

describe("Like", () => {
  it("Liking article, correctly updates like count", async () => {
    const firstArticle = (await blogContract.articles(0));
    const likeTx = await blogContract.likeArticle(0);
    await likeTx.wait();
    const firstArticleAfterLike = (await blogContract.articles(0));
    const initialLikeCount = firstArticle.likeCount.toNumber();
    const updatedLikeCount = firstArticleAfterLike.likeCount.toNumber();
    expect(initialLikeCount + 1).to.equal(updatedLikeCount);
  })
  
  it("Same address cannot like the same article twice", async () => {
    expectThrowsAsync(async () => {
      const likeTx = await blogContract.likeArticle(0);
      await likeTx.wait();
      const likeTx2 = await blogContract.likeArticle(0);
      await likeTx2.wait();
    })
  })
  
  it("Same address can like different articles", async () => {
      const likeTx = await blogContract.likeArticle(0);
      await likeTx.wait();
      const likeTx2 = await blogContract.likeArticle(1);
      await likeTx2.wait();
  })

  it("Cannot like an article that has not been written yet", async () => {
    expectThrowsAsync(async () => {
      const likeTx = await blogContract.likeArticle(100);
      await likeTx.wait();
    })
  })
})

describe("Donation", () => {
  it("Cannot donate through an article that has not been written yet", async () => {
    expectThrowsAsync(async () => {
      const options = {value: ethers.utils.parseEther("1.0")}
      const donationTx = await blogContract.donateToWriter(1000, options);
      await donationTx.wait();
    });
  });

  it("Donate through an existing article", async () => {
      const options = {value: ethers.utils.parseEther("1.0")}
      const donationTx = await blogContract.donateToWriter(0, options);
      await donationTx.wait();
  });

  it("Donation correctly increments receivedDonationAmount", async () => {
    const recievedDonationAmountBefore = await blogContract.receivedDonationAmount();
    const etherBefore = parseFloat(ethers.utils.formatEther(recievedDonationAmountBefore));
    const options = {value: ethers.utils.parseEther("1.0")}
    const donationTx = await blogContract.donateToWriter(0, options);
    await donationTx.wait();
    const recievedDonationAmountAfter = await blogContract.receivedDonationAmount();
    const etherAfter = parseFloat(ethers.utils.formatEther(recievedDonationAmountAfter));
    expect(etherBefore + 1.0).to.equal(etherAfter);
  });

  it("Donation cannot be 0.0 ether", async () => {
    expectThrowsAsync(async () => {
      const options = {value: ethers.utils.parseEther("0.0")}
      const donationTx = await blogContract.donateToWriter(0, options);
      await donationTx.wait();
    });
  });

  it("Donation should update article's donatedAmount", async () => {
    const articleBeforeDonation = await blogContract.articles(0);
    const options = {value: ethers.utils.parseEther("1.0")}
    const donationTx = await blogContract.donateToWriter(0, options);
    await donationTx.wait();

    const articleAfterDonation = await blogContract.articles(0);
    const donatedAmountInEtherBefore = parseFloat(ethers.utils.formatEther(articleBeforeDonation.donatedAmount));
    const donatedAmountInEtherAfter = parseFloat(ethers.utils.formatEther(articleAfterDonation.donatedAmount));
    expect(donatedAmountInEtherBefore + 1.0).to.equal(donatedAmountInEtherAfter);
  });

  it("Donation should update article's donaterCount", async () => {
    const articleBeforeDonation = await blogContract.articles(0);
    const options = {value: ethers.utils.parseEther("1.0")}
    const donationTx = await blogContract.donateToWriter(0, options);
    await donationTx.wait();

    const articleAfterDonation = await blogContract.articles(0);
    const donaterCountBefore = (articleBeforeDonation.donaterCount).toNumber();
    const donaterCountAfter = (articleAfterDonation.donaterCount).toNumber();
    expect(donaterCountBefore + 1.0).to.equal(donaterCountAfter);
  });

  it("Donation should update article's donatorsWithAmount", async () => {
    const articlesWithDonatorsAndAmountsBefore = await blogContract.getArticlesDonatorsWithAmmount(0);
    const options = {value: ethers.utils.parseEther("1.0")}
    const donationTx = await blogContract.donateToWriter(0, options);
    await donationTx.wait();

    const articlesWithDonatorsAndAmountsAfter = await blogContract.getArticlesDonatorsWithAmmount(0);
    const options2 = {value: ethers.utils.parseEther("2.0")}
    const donationTx2 = await blogContract.donateToWriter(0, options2);
    await donationTx2.wait();
    const articlesWithDonatorsAndAmountsAfter2 = await blogContract.getArticlesDonatorsWithAmmount(0);

    expect(articlesWithDonatorsAndAmountsBefore).to.be.an('array');
    expect(articlesWithDonatorsAndAmountsAfter).to.be.an('array');
    expect(articlesWithDonatorsAndAmountsAfter2).to.be.an('array');

    expect(articlesWithDonatorsAndAmountsBefore).to.have.lengthOf(0);
    expect(articlesWithDonatorsAndAmountsAfter).to.have.lengthOf(1);
    expect(articlesWithDonatorsAndAmountsAfter2).to.have.lengthOf(2);
  });
}) 

describe("Get Summary", () => {
  it("Return values are as expected", async () => {
    const summaryObject = await blogContract.getSummary();
    expect(summaryObject[0]).to.be.equal(newlyCreatedBlogsName);
    expect(summaryObject[1]).to.be.equal(owner.address);
    expect(summaryObject[2]).to.be.equal(publishedArticleCountBeforeEach);
    expect(summaryObject[3]).to.be.equal(0);

  })
})



    /*
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

    const wallets = (await ethers.getSigners()).map(signer => signer.address);
    console.log(wallets)
    */

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");