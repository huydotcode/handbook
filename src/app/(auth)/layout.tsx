import React from 'react';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DarkmodeButton } from '@/components/ui';

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (session) redirect('/');

    return (
        <div className="flex min-h-screen items-center justify-center px-8 py-12 lg:px-8 sm:px-6">
            <DarkmodeButton className="fixed right-4 top-4" />

            {children}
        </div>
    );
};

export default AuthLayout;
