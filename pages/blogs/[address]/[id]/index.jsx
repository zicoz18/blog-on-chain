import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Container, Form, Header, Icon, Input, Label, List } from 'semantic-ui-react';
import usersBlog from '../../../../web3Utils/usersBlog';
import usersWeb3 from '../../../../web3Utils/usersWeb3';
import Blog from '../../../../web3Utils/blog';
import web3 from '../../../../web3Utils/web3';


const ArticleDetail = (props) => {
    const [donatingAmount, setDonatingAmount] = useState('');
    const [donatingLoading, setDonatingLoading] = useState(false);
    const [likingLoading, setLikingLoading] = useState(false);
    const [isLikedByAddress, setIsLikedByAddress] = useState(false);
    const [userBlogContract, setUserBlogContract] = useState();
    const [articleLikeCount, setArticleLikeCount] = useState(0);
    const [donatersWithAmount, setDonatorsWithAmount] = useState([]);
    const [donatedAmount, setDonatedAmount] = useState(props.article.donatedAmount);

    useEffect(async () => {
      const wallet = (await usersWeb3.eth.getAccounts())[0];
    //   web3.eth.defaultAccount = wallet;
      const blogContract = usersBlog(props.address);
      blogContract.defaultAccount = wallet;
      setUserBlogContract(blogContract);
      const isLiked = await blogContract.methods.isArticleLikedByAddress(props.id).call();
      setIsLikedByAddress(isLiked);
      setArticleLikeCount(parseInt(props.article.likeCount));
      setDonatorsWithAmount(props.donators);
      setDonatedAmount(props.article.donatedAmount);
    }, []);

    const submitDonate = async (event) => {
        event.preventDefault();

        setDonatingLoading(true);
        try {
            const accounts = await usersWeb3.eth.getAccounts();
            const donatingAmountInWei = usersWeb3.utils.toWei(donatingAmount, 'ether')
            await userBlogContract.methods.donateToWriter(props.id).send({ 
                from: accounts[0], 
                value: donatingAmountInWei
            });
            const newDonationObject = {0: accounts[0], 1: donatingAmountInWei};
            setDonatorsWithAmount([...donatersWithAmount, newDonationObject]);
            const newDonatedAmountAsString = web3.utils.toWei((parseFloat(web3.utils.fromWei(donatedAmount, 'ether')) + parseFloat(donatingAmount)).toFixed(2), 'ether');
            setDonatedAmount(newDonatedAmountAsString);
            toast.success(`Donated ${donatingAmount} AVAX`, {
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
        setDonatingLoading(false);
    };

    const renderDonations = () => {
        return donatersWithAmount.map((donation, id) =>{
            const bnObjectDonatedAmount = new web3.utils.BN(donation[1])
            const donatedAmount = web3.utils.fromWei(bnObjectDonatedAmount, 'ether');
            return (
                <List.Item key={id} className='text-center my-3' >
                    <List.Header>{donatedAmount} AVAX</List.Header>{donation[0]}
                </List.Item>
            ) 
        })
    }

    const likeArticle = async () => {
        /* Sadece like'lamamışsa çalıştır? */
        if (!isLikedByAddress) {
            try {
                setLikingLoading(true);
                const accounts = await web3.eth.getAccounts();
                await userBlogContract.methods.likeArticle(props.id).send({
                    from: accounts[0]
                });
                setIsLikedByAddress(true);
                setLikingLoading(false);
                setArticleLikeCount(articleLikeCount + 1);
                toast.success(`Liked ${props.article.header} article`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch(err) {
                // Toastify ekle
                console.log(err);
            }
        } else {
            toast.error('You have already liked this article', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    }

    return (
        <div className='min-h-screen'>
            <div className="float-right ml-10 min-h-screen" >
                <div className='flex align-middle justify-center'>
                        <Button as='div' labelPosition='right'>
                            <Button 
                                icon
                                onClick={() => likeArticle()}
                                loading={likingLoading}
                                >
                                <Icon name='heart' color={isLikedByAddress ? 'red' : null} />
                            </Button>
                            <Label basic pointing='left'>
                                {articleLikeCount}
                            </Label>
                        </Button>
                </div>
                <div
                    className="text-center mt-3"
                >
                    {web3.utils.fromWei(donatedAmount, 'ether')} AVAX
                </div>
                <Header 
                sub
                className="text-center"
                style={{marginTop: "0.75rem", marginBottom: "0.75rem"}}
                >Donated to the article
                </Header>

                <Form onSubmit={(event) => submitDonate(event)} >
                    <Form.Field>
                        <Input 
                            placeholder="0.0"
                            label="AVAX" 
                            labelPosition='right'
                            onChange={ event => setDonatingAmount(event.target.value) }
                        />
                    </Form.Field>
                    <div className="flex justify-center" >
                        <Button  
                        style={{ marginRight: "0" }}
                        color='teal'
                        primary={false}
                        loading={donatingLoading}
                        >
                        Donate!
                        </Button>
                    </div>
                </Form>
                {donatersWithAmount.length ? 
                    <>
                        <Header 
                            sub
                            className="text-center"
                            style={{marginTop: "2rem", marginBottom: "0.75rem"}}
                        >Donators
                        </Header>
                        <List>
                            {renderDonations()}
                        </List> 
                    </>
                : null
                }

            </div>
            <Container fluid >
                <Header as='h2'>{props.article.header}</Header>
                <p>
                    {props.article.content}
                </p>
            </Container>
        </div>
    );
};

ArticleDetail.getInitialProps = async (context) => {
    const address = context.query.address;
    const id = context.query.id;
    const blogContract = await Blog(address);
    const article = await blogContract.methods.articles(id).call();
    const donators = await blogContract.methods.getArticlesDonatorsWithAmmount(id).call();
    return {address, id, blogContract, article, donators /* , isLikedByAddress */};
}

export default ArticleDetail;
