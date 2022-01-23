import { Container } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';

 const Layout = (props) => {
    return (
        /* Container allow us to have spacing at left and right */
        <Container >
            <Header/>
            {props.children}
            <Footer/>
        </Container>
    );
 };

 export default Layout;