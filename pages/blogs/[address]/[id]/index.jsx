import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Container, Form, Header, Icon, Input, Label, List } from 'semantic-ui-react';
import Blog from '../../../../web3Utils/blog';
import web3 from '../../../../web3Utils/web3';


const ArticleDetail = (props) => {
    const [donatingAmount, setDonatingAmount] = useState('');
    const [donatingLoading, setDonatingLoading] = useState(false);
    const [isLikedByAddress, setIsLikedByAddress] = useState(false);

    useEffect(async () => {
      const wallet = (await web3.eth.getAccounts())[0];
      web3.eth.defaultAccount = wallet;
      const blogContract = Blog(props.address);
      const isLiked = await blogContract.methods.isArticleLikedByAddress(props.id).call();
      setIsLikedByAddress(isLiked);
    }, []);

    const submitDonate = async (event) => {
        event.preventDefault();

        setDonatingLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const donatingAmountInWei = web3.utils.toWei(donatingAmount, 'ether')
            // props.blogContract.defaultAccount = accounts[0];
            console.log("contract: ", props.blogContract);
            console.log("methods: ", props.blogContract.methods);
            console.log("function: ", props.blogContract.methods.donateToWriter);
            await props.blogContract.methods.donateToWriter(props.id).send({ 
                from: accounts[0], 
                value: donatingAmountInWei
            });
                toast.success(`Donated ${donatingAmount} AVAX`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                // router.push('/');
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
        return props.donators.map((donation, id) =>{
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
        console.log("isLiked?: ", props.isLikedByAddress)
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("Contract: ", props.blogContract);
            await props.blogContract.methods.likeArticle(props.id).send({
                from: accounts[0]
            });
            setIsLikedByAddress(true);
        } catch(err) {
            console.log(err);
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
                                >
                                <Icon name='heart' color={isLikedByAddress ? 'red' : null} />
                            </Button>
                            <Label basic pointing='left'>
                                {props.article.likeCount}
                            </Label>
                        </Button>
                </div>
                <div
                    className="text-center mt-3"
                >
                    {web3.utils.fromWei(props.article.donatedAmount, 'ether')} AVAX
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
                <Header 
                    sub
                    className="text-center"
                    style={{marginTop: "2rem", marginBottom: "0.75rem"}}
                >Donators
                </Header>
                    <List>
                        {renderDonations()}
                    </List>
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
    // const isLikedByAddress = await blogContract.methods.isArticleLikedByAddress(id).call();
    // console.log("isLİked?: ", isLikedByAddress);
    // console.log("Article: ", article)
    // console.log("Donators: ", donators);
    return {address, id, blogContract, article, donators /* , isLikedByAddress */};
}

export default ArticleDetail;
