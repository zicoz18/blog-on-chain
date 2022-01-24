import Blog from "../../../web3Utils/blog";
import { useRouter } from 'next/router'
import { Button, Card, Icon, Header, Form, Input } from 'semantic-ui-react';
import web3 from '../../../web3Utils/web3';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import usersBlog from '../../../web3Utils/usersBlog';

const BlogDetail = (props) => {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [blogsBalance, setBlogsBalance] = useState();
  const [userBlogContract, setUserBlogContract] = useState();

  useEffect(async () => {
      const wallet = (await web3.eth.getAccounts())[0];
      const blogContract = usersBlog(props.address);
      blogContract.defaultAccount = wallet;
      setUserBlogContract(blogContract);
      setBlogsBalance(props.blogsBalance);
      if (props.owner == wallet) {
        setIsOwner(true)
      }
  }, []);

  const submitWithdrawal = async (event) => {
    event.preventDefault();

    setWithdrawalLoading(true);
    try {
        const accounts = await web3.eth.getAccounts();
        const withdrawalAmountConst = withdrawalAmount; // 0.1 string
        const withdrawalAmountInWei = web3.utils.toWei(withdrawalAmount, 'ether')
        const remainigBalanceAsString = web3.utils.toWei((parseFloat(web3.utils.fromWei(blogsBalance, 'ether')) - parseFloat(withdrawalAmount)).toFixed(2), 'ether');
        await userBlogContract.methods.withdraw(withdrawalAmountInWei).send({ 
            from: accounts[0]
        });
        setBlogsBalance(remainigBalanceAsString);
        toast.success(`Withdrew ${withdrawalAmountConst} AVAX`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    } catch (err) {
        console.log(err)
        toast.error('Transaction Failed!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }
    setWithdrawalLoading(false);
};
  
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
              <Icon color='red' name='heart' />
            </p>
          </div>
          <p>Donated Amount: {web3.utils.fromWei(articleDetail.donatedAmount, 'ether')} AVAX</p>
          <p>Publish date: {date}</p>
        </div>),
        fluid: true,
        link: true,
        onClick: () => {
          router.push(`/blogs/${props.address}/${articleDetail.id}`);
        }
      };
    });
    return <Card.Group items={items}/>;
  }

  const renderOwnerView = () => (
    <div className="float-right" >
      <div className="flex justify-center" >
            <Button  
              style={{ marginRight: "0" }}
              content="Create Article"
              icon="add circle"
              color='teal'
              primary={false}
              onClick={() => router.push(`/blogs/${props.address}/new`)}
            />
      </div>
          <Header 
            sub
            className="text-center"
            style={{marginTop: "0.75rem", marginBottom: "0.75rem"}}
          // floated="right"
          >Total donated amount
          </Header>
          <div
          // className="float-right"
          className="text-center"
          >{web3.utils.fromWei(props.donatedAmount, 'ether')} AVAX
          </div>

          <Header 
            sub
            className="text-center"
            style={{marginTop: "0.75rem", marginBottom: "0.75rem"}}
          // floated="right"
          >Blog's balance
          </Header>
          <div
          // className="float-right"
          className="text-center"
          >{web3.utils.fromWei(blogsBalance, 'ether')} AVAX
          </div>
                <h3></h3>
                <Form onSubmit={(event) => submitWithdrawal(event)} >
                    <Form.Field>
                        <Input 
                            placeholder="0.0"
                            label="AVAX" 
                            labelPosition='right'
                            onChange={ event => setWithdrawalAmount(event.target.value) }
                        />
                    </Form.Field>
                    <div className="flex justify-center" >
                          <Button  
                          style={{ marginRight: "0" }}
                          color='teal'
                          primary={false}
                          loading={withdrawalLoading}
                        >
                        Withdraw
                        </Button>
                    </div>
                </Form>
      </div>
  );

  const renderNonOwnerView = () => (
    <div className="float-right" >
    <Header 
    sub
    className="text-center"
    >Total donated amount
    </Header>
    <div
      // className="float-right"
      className="text-center"
      >{web3.utils.fromWei(props.donatedAmount, 'ether')} AVAX
    </div>
  </div>
  )

  return (
    <div className='min-h-screen' >
      <h1>
        {props.name}
      </h1>

      {
      isOwner ? 
        renderOwnerView()
      : 
        renderNonOwnerView()
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
  const articleCount = summaryObject[2];
  const donatedAmount = summaryObject[3];
  const blogsBalance = summaryObject[4];
  // Load articles
  const articles = await Promise.all(
    Array(parseInt(articleCount))
        .fill()
        .map((element, index) => (
            blogContract.methods.articles(index).call()
        ))
  );
 // Returning this object add them to the props
  return { 
      address: context.query.address,
      blogContract: blogContract,
      name: name, 
      owner: owner, 
      articleCount: articleCount,
      articles: articles,
      donatedAmount: donatedAmount,
      blogsBalance: blogsBalance
   };
}

export default BlogDetail;
