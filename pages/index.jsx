import { useEffect, useState } from 'react';
import factory from '../web3Utils/factory';
import Blog from '../web3Utils/blog';
import { Card, Button, Loader, Dimmer } from 'semantic-ui-react';
import { useRouter } from 'next/router'


const Home = () => {
  const [blogAddresses, setBlogAddresses] = useState([]);
  const [blogContracts, setBlogContracts] = useState([]);
  const [blogDetails, setBlogDetails] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const router = useRouter();
  // const [blogContracMethods, setBlogContracMethods] = useRecoilState(blogContractMethodsState);

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
        const summaryObject = await blogContract.methods.getSummary().call();
        return { name: summaryObject[0],  owner: summaryObject[1], articleCount: summaryObject[2] };
      })
    )
    setBlogDetails(blogDetails);

    setLoadingBlogs(false);
  }

const renderBlogs = () => {
    const items = blogDetails.map((blogDetail, index) => (
        {
            header: blogDetail.name,
            meta: `${blogDetail.articleCount} articles`,
            extra: `by ${blogDetail.owner}`,
            fluid: true,
            link: true,
            onClick: () => {
              // setBlogContracMethods(blogContracts[index].methods);
              router.push(`/blogs/${blogAddresses[index]}`);
              // set blogContractMethods on recoil (since some properties of Contract are read only we cannot save the hole contract to global state)
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
    </div>
  )
}

export default Home;