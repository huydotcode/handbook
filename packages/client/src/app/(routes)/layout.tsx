import { Navbar } from '@/components/layout';
import ChatWithGemini from '@/components/layout/ChatWithGemini';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (!session) redirect('/auth/login');

    return (
        <div className="w-screen">
            <Navbar />

            <main className={'bg-primary-1 dark:bg-dark-primary-1'}>
                {children}
            </main>

            <ChatWithGemini />
        </div>
    );
};

export default HomeLayout;
