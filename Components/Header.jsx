import { Menu, Icon } from 'semantic-ui-react';
import Router from "next/router";
import {Link} from 'next/link';

const Header = () => {
    return (
        <Menu >
            <Menu.Item onClick={() => Router.push("/")} >
                Blog On Chain
            </Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item>
                    Blogs
                </Menu.Item>
                <Menu.Item onClick={() => Router.push("/blogs/new")} >
                        <Icon name="add circle" />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

 export default Header;