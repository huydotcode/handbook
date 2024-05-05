import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

export async function generateMetadata() {
    return {
        title: 'Messenger | Handbook',
    };
}

const MessageLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (!session?.user) redirect('/');

    return (
        <div>
            <Navbar />
            <div className="relative left-1/2 flex h-[calc(100vh-56px)] min-w-[80%] max-w-[1150px] -translate-x-1/2 justify-between rounded-xl bg-transparent p-2 md:min-w-full">
                {children}
            </div>
        </div>
    );
};
export default MessageLayout;
