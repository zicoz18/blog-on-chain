import {  Icon } from 'semantic-ui-react';
import Router from "next/router";

const Footer = () => {


    return (
        <div className='h-24 flex justify-center align-center text-white' >
            <div className='w-36 text-center my-auto' >
                <Icon 
                    name="github"
                    size="big"
                    className='text-ptpWeirdBlue'
                />
            </div>
            <div className='w-36 text-center my-auto'>
                <Icon 
                    name="linkedin"
                    size="big"
                    className='text-ptpWeirdBlue'
                />
            </div>
            <div className='w-36 text-center my-auto'>
                <Icon 
                    name="twitter"
                    size="big"
                    className='text-ptpWeirdBlue'
                />
            </div>
        </div>
    );
}

export default Footer;