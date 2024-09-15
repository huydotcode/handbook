import React from 'react';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (session) {
        redirect('/');
    }

    return <>{children}</>;
};

export default AuthLayout;
