import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { blogContractMethodsState } from '../../../atoms/blogContractMethodsAtom';
import Blog from "../../../web3Utils/blog";
import { useRouter } from 'next/router'
// import { useFirstRender } from '../../../hooks/useFirstRender';

const BlogDetail = (props) => {
  const [blogSummary, setBlogSummary] = useState();
  const [blogContractMethods, setBlogContractMethods] = useRecoilState(blogContractMethodsState);
  // const router = useRouter();
  // console.log("props", props);
  // const firstRender = useFirstRender();

  // useEffect(() => {
  //   if (firstRender) {
  //     loadBlogDetails();
  //   }
  // }, [firstRender]);
  

  // useEffect(async () => {
  //   if (!firstRender) {
  //     console.log("blogContractMethods changed");
  //   }
  //   // const summary = await blogContractMethods.getSummary().call();
  //   // setBlogSummary(summary);
  //   // console.log("Summary: ", blogSummary);
  // }, [firstRender, blogContractMethods]);

  // const loadBlogDetails = async () => {
  //   console.log("router: ", router.pathname);
  //   const address = router.query.address;
  //   console.log("address: ", address);
  //   console.log("methods: ", Blog(props.address).methods);
  //   setBlogContractMethods(Blog(props.address).methods);
  // }


  return (
    <div>
      {/* <h3>{blogSummary[0]}</h3> */}
      this is the blog {props.address}
      <h1>
        {props.name}
      </h1>
      <h1>
        {props.owner}
      </h1>
      <h1>
        {props.articleCount}
      </h1>

    </div>
    );
}

// BlogDetail.getInitialProps = async (context) => {
//   const address = context.query.blogAddress;
//   return { 
//       address,
//    };
// }

BlogDetail.getInitialProps = async (context) => {
  const address = context.query.address;
  const blogContract = await Blog(address);
  const summaryObject = await blogContract.methods.getSummary().call();
  // Load articles

 // Returning this object add them to the props
  return { 
      address: context.query.address,
      name: summaryObject[0], 
      owner: summaryObject[1], 
      articleCount: summaryObject[2]
   };
}

export default BlogDetail;
