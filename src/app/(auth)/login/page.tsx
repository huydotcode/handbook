import LoginForm from '@/components/pages/Auth/LoginForm';
import { getAuthSession } from '@/lib/auth';
import { FC } from 'react';

import { redirect } from 'next/navigation';

const Page: FC = async () => {
    const session = await getAuthSession();

    if (session) {
        redirect('/');
    }

    return (
        <>
            <div className="flex h-screen items-center justify-center px-8 py-12 lg:px-8 sm:px-6 ">
                <LoginForm />
            </div>
        </>
    );
};

export default Page;
