import factory from '../web3Utils/factory';
import Blog from '../web3Utils/blog';
import { Card, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router'
import { usersWeb3 } from '../web3Utils/usersWeb3';
import web3 from '../web3Utils/web3';
import { useEffect } from 'react';


const Home = (props) => {
  const router = useRouter();

  useEffect(() => {
    web3.eth.getAccounts();
  }, []);
  

  const renderBlogs = () => {
    const items = props.blogDetails.map((blogDetail, index) => (
        {
            header: blogDetail.name,
            meta: `${blogDetail.articleCount} articles`,
            extra: `by ${blogDetail.owner}`,
            fluid: true,
            link: true,
            onClick: () => {
              router.push(`/blogs/${props.blogAddresses[index]}`);
            }
        }
    ));
    return <Card.Group items={items} />;
  }


  return (
    <div className='min-h-screen'>
      <h3 className='text-ptpWeirdBlue' >Blogs</h3>
      {
        <>
        <Button 
                        floated="right"
                        content="Create your Blog"
                        icon="add circle"
                        color='teal'
                        primary={false}
                        onClick={() => router.push("/blogs/new")}
                    />
        {renderBlogs()}
        </>
      }
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const blogAddresses = await factory.methods.getDeployedBlogs().call();

  const blogContracts = await Promise.all(
    blogAddresses.map(async (blogAddress) => {
      return await Blog(blogAddress);
    })
  );

  const blogDetails = await Promise.all(
    blogContracts.map(async (blogContract) => {
      const summaryObject = await blogContract.methods.getSummary().call();
      return { name: summaryObject[0],  owner: summaryObject[1], articleCount: summaryObject[2] };
    })
  )

 // Returning this object add them to the props
  return { 
      blogAddresses: blogAddresses,
      blogContracts: blogContracts, 
      blogDetails: blogDetails, 
   };
}


export default Home;