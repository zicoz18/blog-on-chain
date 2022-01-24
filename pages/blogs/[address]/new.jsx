import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, TextArea } from "semantic-ui-react";
import Blog from "../../../web3Utils/blog";
import web3 from "../../../web3Utils/web3";

const NewArticle = (props) => {
    const router = useRouter();
    const [articleHeader, setArticleHeader] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [loading, setLoading] = useState(false);

    const submitForm = async (event) => {
        // to not allow web browser to automaticly try to submit the form to our backend
        event.preventDefault();

        setLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            await props.blogContract.methods
                .publishArticle(articleHeader, articleContent)
                .send({
                    from: accounts[0]
                });
                toast.success('Article Published!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                router.push(`/blogs/${props.address}`);
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
        setLoading(false);
    }

  return (
    <div className='min-h-screen'>
    <h3>Publish your article</h3>
    <Form onSubmit={(event) => submitForm(event)} >
        <Form.Field>
            <label>Article's header</label>
            <Input 
                value={articleHeader}
                onChange={ event => setArticleHeader(event.target.value) }
            />
        </Form.Field>
        <Form.Field>
            <label>Article's Content</label>
            <TextArea 
                style={{ minHeight: "50vh" }}
                value={articleContent}
                onChange={ event => setArticleContent(event.target.value) }
            />
        </Form.Field>
        <Button 
            loading={loading}
            color='teal'
            primary={false}
            content="Publish"
        />
    </Form>
    </div>
  );
}

NewArticle.getInitialProps = async (context) => {
    const address = context.query.address;
    const blogContract = await Blog(address);
    return {
        address: address,
        blogContract: blogContract
    };
};

export default NewArticle;
