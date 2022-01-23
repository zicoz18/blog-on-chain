import { useEffect, useState } from 'react';
import factory from '../web3Utils/factory';
import web3 from '../web3Utils/web3';
import Blog from '../web3Utils/blog';
import { Card, Button, Loader, Dimmer } from 'semantic-ui-react';
import Router from 'next/router';

const Home = () => {
  const [blogAddresses, setBlogAddresses] = useState([]);
  const [blogContracts, setBlogContracts] = useState([]);
  const [blogDetails, setBlogDetails] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(async () => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const blogs = await factory.methods.getDeployedBlogs().call();
    setBlogAddresses(blogs);

    const blogContracts = await Promise.all(
      blogs.map(async (blogAddress) => {
        return await Blog(blogAddress);
      })
    );
    setBlogContracts(blogContracts);

    const blogDetails = await Promise.all(
      blogContracts.map(async (blogContract) => {
        const blogsArticleCount = await blogContract.methods.articleCount().call();
        const blogsName = await blogContract.methods.blogsName().call();
        const blogsOwner = await blogContract.methods.owner().call();
        return {articleCount: blogsArticleCount, name: blogsName, owner: blogsOwner};
      })
    )
    setBlogDetails(blogDetails);

    setLoadingBlogs(false);
  }

  // const setupEventListener = () => {
  //   factory.events.BlogCreated({}, (err, event) => {
  //     console.log(event)
  //     const blogAddress = event.returnValues.blogAddress;
  //     console.log("newly created blog's address: ", blogAddress);
  //     console.log("Old addresses: ", blogAddresses);
  //     console.log("Newly created: ", blogAddress);

  //     setBlogAddresses([...blogAddresses, blogAddress]);
  //     alert("new blog created.");
  //   })
  // }


/*   const createBlog = async () => {
    // await factory.methods.createBlog().send();
    try {
      setupEventListener();
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
  
      await factory.methods
      .createBlog()
      .send({
          from: accounts[0]
      });
      console.log("blog created");
    } catch(err) {
      console.log("cannot create a blog");
      console.error(err);
    }
  } */

/*   const createAnArticle = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      
      await blogContracts[0].methods
      .publishArticle(
        "first article's header",
        "firstr articles' content"
      )
      .send({
          from: accounts[0]
      });
      console.log("blog created");
    } catch(err) {
      console.log("cannot create a blog");
      console.error(err);
    }
  } */

const renderBlogs = () => {
    const items = blogDetails.map((blogDetail, index) => (
        {
            header: blogDetail.name,
            meta: `${blogDetail.articleCount} articles`,
            extra: `by ${blogDetail.owner}`,
            fluid: true,
            link: true,
            onClick: () => {
              Router.push(`/blogs/${blogAddresses[index]}`);
            }
        }
    ));
    return <Card.Group items={items} />;
}


  return (
    <div className='min-h-screen'>
      <h3 className='text-ptpWeirdBlue' >Blogs</h3>
      {
        // loadingBlogs ? 
        //   <Loader />
        // : 
        <>

        <Dimmer active={loadingBlogs}>
          <Loader />
          </Dimmer>
        <Button 
                        floated="right"
                        content="Create your Blog"
                        icon="add circle"
                        color='teal'
                        primary={false}
                        onClick={() => Router.push("/blogs/new")}
                    />
        {renderBlogs()}
        </>
      }


      {/* <button className='ptp-gradient-animated-button p-5 rounded' onClick={() => createAnArticle()} >
        Create an Article for the blog: {blogAddresses[0]}
      </button>
      
      <button className='buildspace-gradient-animated-button p-5 rounded' onClick={() => createBlog()} >
        Create Blog!
      </button> */}
    </div>
  )
}

export default Home;