import React from 'react';
import ChatWithGemini from '@/components/ChatWithGemini';
import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import FullLayout from '@/components/layout/FullLayout';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (!session) return null;

    return <FullLayout>{children}</FullLayout>;
};

export default HomeLayout;
