import React from 'react';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignupForm } from '../_components';

const Page: React.FC = async () => {
    const session = await getAuthSession();

    if (session) {
        redirect('/');
    }

    return (
        <>
            <div className="flex h-screen items-center justify-center px-8 py-12 lg:px-8 sm:px-6 ">
                <SignupForm />
            </div>
        </>
    );
};

export default Page;
