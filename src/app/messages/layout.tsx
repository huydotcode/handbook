import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const MessageLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (!session?.user) redirect('/');

    return (
        <>
            <Navbar />
            <div className="mx-auto my-14 flex h-[calc(100vh-112px)] max-w-[1150px] justify-between overflow-hidden rounded-xl bg-transparent p-2">
                {children}
            </div>
        </>
    );
};
export default MessageLayout;
