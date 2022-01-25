import { Container } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

 const Layout = (props) => {
    return (
        /* Container allow us to have spacing at left and right */
        <>
        <Head>
            <title>Blog on Chain</title>
            <link rel="icon" href="./favicon-32x32.png" />
        </Head>
        <Container >
            <Header/>
            {props.children}
            <Footer/>
        </Container>
        </>
    );
 };

 export default Layout;