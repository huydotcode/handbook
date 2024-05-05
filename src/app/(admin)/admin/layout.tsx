import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (session?.user.role != 'admin') redirect('/');

    return (
        <div>
            <Navbar />

            <main className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
