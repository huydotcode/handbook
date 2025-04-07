import FullLayout from '@/components/layout/FullLayout';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { WelcomeBackDialog } from '@/components/ui/dialog';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (!session) redirect('/auth/login');

    return (
        <FullLayout>
            <WelcomeBackDialog />
            {children}
        </FullLayout>
    );
};

export default HomeLayout;
