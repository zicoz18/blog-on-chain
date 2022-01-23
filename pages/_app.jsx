import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import Layout from '../Components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }) {
  return(
    <div className="pt-4" >
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </RecoilRoot>
    </div>
  ) 
}

export default MyApp
