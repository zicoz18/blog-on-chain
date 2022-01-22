import { useEffect, useState } from 'react';
import factory from '../web3Utils/factory';
import web3 from '../web3Utils/web3';
import Blog from '../web3Utils/blog';

const Home = (props) => {
  const [blogAddresses, setBlogAddresses] = useState([]);

  useEffect(async () => {
    const blogs = await factory.methods.getDeployedBlogs().call();
    setBlogAddresses(blogs);
    console.log("Blogs: ", blogs);
    return { blogs };
  }, []);

  const setupEventListener = () => {
    factory.events.BlogCreated({}, (err, event) => {
      console.log(event)
      const blogAddress = event.returnValues.blogAddress;
      console.log("newly created blog's address: ", blogAddress);
      console.log("Old addresses: ", blogAddresses);
      console.log("Newly created: ", blogAddress);

      setBlogAddresses([...blogAddresses, blogAddress]);
      alert("new blog created.");


    })
    // .on("connected", function(subscriptionId){
    //   console.log("connected: ",subscriptionId);
    // })


    /* .on('data', function(event){
      console.log("data: ", event); // same results as the optional callback above
    }) */


    // .on('changed', function(event){
    //    // remove event from local database
    //    console.log("changed")
    // })
    // .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    //   console.log(error);
    // });

/*
    let blogCreatedEvent = factory.events.BlogCreated();

    blogCreatedEvent.watch(function(error, blogAddress){
      console.log("newly created blog's address: ", blogAddress);
      console.log("Old addresses: ", blogAddresses);
      console.log("Newly created: ", blogAddress);

      setBlogAddresses([...blogAddresses, blogAddress]);
      alert("new blog created.");
    });
*/




    /*
    factory.events.BlogCreated([], (blogAddress) => {
      console.log("newly created blog's address: ", blogAddress);
      console.log("Old addresses: ", blogAddresses);
      console.log("Newly created: ", blogAddress);

      setBlogAddresses([...blogAddresses, blogAddress]);
      alert("new blog created.");
    });
    */
  }


  const createBlog = async () => {
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
  }


  return (
    <div>
      hi there... 
      {blogAddresses.map((element, index) => (
        <div key={index}>
          {element}
        </div>
      ))}
      <button className='p-5 bg-green-400 rounded' onClick={() => createBlog()} >
        Create Blog!
      </button>
    </div>
  )
}

export default Home;