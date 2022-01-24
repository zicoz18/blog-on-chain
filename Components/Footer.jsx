import { Button, Icon } from 'semantic-ui-react';
import Router from "next/router";

const Footer = () => {


    return (
        <div className='h-24 flex justify-center align-center text-white' >
            <div className='w-36 text-center my-auto' >
                <a 
                    href="https://github.com/zicoz18"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon 
                        name="github"
                        size="big"
                        className='text-ptpWeirdBlue'
                    />
                </a>
            </div>
            <div className='w-36 text-center my-auto'>
                <a 
                    href="https://www.linkedin.com/in/ziya-i%C3%A7%C3%B6z-893391175/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon 
                        name="linkedin"
                        size="big"
                        className='text-ptpWeirdBlue'
                    />
                </a>

            </div>
            <div className='w-36 text-center my-auto'>
                <a 
                    href="https://twitter.com/ziya_icoz"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Icon 
                        name="twitter"
                        size="big"
                        className='text-ptpWeirdBlue'
                    />
                </a>

            </div>
        </div>
    );
}

export default Footer;