import { Navbar } from '@/components/layout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const MessageLayout: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};
export default MessageLayout;
