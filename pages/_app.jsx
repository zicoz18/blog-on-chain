import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import Layout from '../Components/Layout';

function MyApp({ Component, pageProps }) {
  return(
    <div className="pt-4" >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  ) 
}

export default MyApp
