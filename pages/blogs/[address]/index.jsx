import Blog from "../../../web3Utils/blog";
import { useRouter } from 'next/router'
import { Button, Card, Icon, Header } from 'semantic-ui-react';
import web3 from '../../../web3Utils/web3';
import { useEffect, useState } from "react";

const BlogDetail = (props) => {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(async () => {
    const wallet = (await web3.eth.getAccounts())[0];
    if (props.owner == wallet) {
      setIsOwner(true)
    }
  }, []);
  

  // const publishDefaultArticle = async () => {
  //   // const sumObj = await props.blogContract.methods.getSummary().call();
  //   const accounts = await web3.eth.getAccounts();
  //   await props.blogContract.methods.publishArticle("My First NFT project", "I had done my first NFT project on the summer of 2021. It was called AvaxDoge")
  //     .send({
  //       from: accounts[0]
  //     });
  //   console.log("after publishing article")
  // }
  
  const renderArticles = () => {
    const items = props.articles.map((articleDetail, index) => {
      let date = new Date(articleDetail.publishDate * 1000);
      date = date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear();
      return {
        header: articleDetail.header,
        meta: articleDetail.content.slice(0,50) + "...",
        extra: (<div>
          <div>
            <p>
              {articleDetail.likeCount}
              <Icon onClick={() => console.log("heartClicked")} color='red' name='heart' />
            </p>
          </div>
          <p>Donated Amount: {articleDetail.donatedAmount} AVAX</p>
          <p>Publish date: {date}</p>
        </div>),
        fluid: true,
        link: true,
        onClick: () => {
          router.push(`/blogs/${props.blogAddresses[index]}`);
        }
      };
    });
    return <Card.Group items={items}/>;
  }

  return (
    <div className='min-h-screen' >
      <h1>
        {props.name}
      </h1>

      {
      isOwner ? 
        <div className="float-right" >
          <Header 
          sub
          // floated="right"
          >Total donated amount
          </Header>
          <div
          // className="float-right"
          className="text-center"
          >{props.donatedAmount} AVAX
          </div>
          <div className="flex justify-center" >
            <Button  
              className="mr-0"
              content="Create your Blog"
              icon="add circle"
              color='teal'
              primary={false}
              onClick={() => router.push(`/blogs/${props.address}/new`)}
              >
              Create Article!
            </Button>
          </div>
      </div>
      : 
      <div className="float-right" >
        <Header 
        sub
        // floated="right"
        >Total donated amount
        </Header>
        <div
          // className="float-right"
          className="text-center"
          >{props.donatedAmount} AVAX
        </div>
      </div>
      }
      {renderArticles()}

    </div>
    );
}

BlogDetail.getInitialProps = async (context) => {
  const address = context.query.address;
  const blogContract = await Blog(address);
  const summaryObject = await blogContract.methods.getSummary().call();
  const name = summaryObject[0];
  const owner = summaryObject[1]; 
  const articleCount = summaryObject[2]
  const donatedAmount = summaryObject[3]

  // Load articles
  const articles = await Promise.all(
    Array(parseInt(articleCount))
        .fill()
        .map((element, index) => (
            blogContract.methods.articles(index).call()
        ))
  );
  console.log("Articles: ", articles);

 // Returning this object add them to the props
  return { 
      address: context.query.address,
      blogContract: blogContract,
      name: name, 
      owner: owner, 
      articleCount: articleCount,
      articles: articles,
      donatedAmount: donatedAmount
   };
}

export default BlogDetail;

/*         {/* <div className="float-right" >
          <Header 
            sub
            // floated="right"
            >Total donated amount
            </Header>
            <span
            // className="float-right"
            >{props.articleCount} AVAX</span>
        <div>

        <Button  
            // floated="right"
            content="Create your Blog"
            icon="add circle"
            color='teal'
            primary={false}
            onClick={() => router.push(`/blogs/${props.address}/new`)}
            >
            Create Article!
        </Button>
              </div>
        </div> */