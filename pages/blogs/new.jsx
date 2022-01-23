import React, { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../../web3Utils/web3';
import factory from '../../web3Utils/factory';
import Router from 'next/router';

const New = () => {
    const [blogName, setBlogName] = useState('');
    const [loading, setLoading] = useState(false);

    const submitForm = async (event) => {
        // to not allow web browser to automaticly try to submit the form to our backend
        event.preventDefault();

        setLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createBlog(blogName)
                .send({
                    from: accounts[0]
                });
            Router.push('/');
        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

  return (
    <div className='min-h-screen'>
        <h3>Create your blog</h3>
        <Form onSubmit={(event) => submitForm(event)} >
            <Form.Field>
                <label>Blog's name</label>
                <Input 
                    value={blogName}
                    onChange={ event => setBlogName(event.target.value) }
                />
            </Form.Field>

            <Button 
                loading={loading}
                color='teal'
                primary={false}
            >
                Create
            </Button>
        </Form>
    </div>
  );
}

export default New;
