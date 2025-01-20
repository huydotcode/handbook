import FullLayout from '@/components/layout/FullLayout';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    return <FullLayout>{children}</FullLayout>;
};

export default HomeLayout;
