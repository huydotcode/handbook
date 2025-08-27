import { Navbar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { Sidebar } from '../_components';
import { UserRole } from '@/enums/UserRole';

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (session?.user.role != UserRole.ADMIN) notFound();

    return (
        <div>
            <Navbar />

            <main className="relative top-[56px] ml-[300px] min-h-[calc(100vh-56px)] w-[calc(100vw-340px)] xl:ml-[80px] xl:w-[calc(100vw-80px)]">
                <Sidebar />
                <div className="mx-4 mt-4 w-full">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
