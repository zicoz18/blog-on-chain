//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blog is Ownable {
    uint public articleCount;
    mapping (uint => Article) public articles;
    uint public receivedDonationAmount;

    event ArticleCreated(uint id, string header, string content, uint publishDate, uint likeCount, uint donatedAmount);
    event Liked(uint id, address liker, uint likeCount);
    event DonationMade(uint id, address donator, uint donatedAmount, uint totalDonatedAmount);

    struct Article {
        uint id;
        string header;
        string content;
        uint publishDate;
        uint likeCount;
        uint donatedAmount;
        mapping (address => bool) likers;
        mapping (address => uint) donators;
    }

    constructor(address creator) {
        transferOwnership(creator);
    }

    modifier validArticleId(uint _articleId) {
        require(_articleId < articleCount);
        _;
    }
    
    function _createArticle(
        string memory _header, 
        string memory _content
    ) onlyOwner internal {
        Article storage article = articles[articleCount];
        // Article storage article = Article(_id, _header, _content, _publishDate, _likeCount, _donatedAmount);
        // articles.push(article);
        article.id = articleCount;
        article.header = _header;
        article.content = _content;
        article.publishDate = block.timestamp;
        article.likeCount = 0;
        article.donatedAmount = 0;
        emit ArticleCreated(articleCount, _header, _content, block.timestamp, 0, 0);
        articleCount++;
    }

    function publishArticle(string memory _header, string memory _content) onlyOwner external {
        _createArticle(_header, _content);
    }

    function likeArticle(uint _articleId) external validArticleId(_articleId){
        require(!articles[_articleId].likers[msg.sender]);
        Article storage currentArticle = articles[_articleId];
        _likeArticle(currentArticle);
    }

    function _likeArticle(Article storage _article) internal {
        _article.likeCount++;
        _article.likers[msg.sender] = true;
        emit Liked(_article.id, msg.sender, _article.likeCount);
    }

    function donateToWriter(uint _articleId) payable external validArticleId(_articleId) {
        // Is this even a thing?
        require(msg.value > 0);
        Article storage currentArticle = articles[_articleId];
        _donateToWriter(currentArticle);
    }

    function _donateToWriter(Article storage _article) internal {
        _article.donatedAmount = _article.donatedAmount + msg.value;
        _article.donators[msg.sender] = _article.donators[msg.sender] + msg.value;
        receivedDonationAmount = receivedDonationAmount + msg.value;
        emit DonationMade(_article.id, msg.sender, msg.value, receivedDonationAmount);
    }

}