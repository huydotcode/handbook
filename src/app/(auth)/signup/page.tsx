import SignupForm from '@/components/pages/Auth/SignupForm';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const Page: FC = async () => {
    const session = await getAuthSession();

    if (session) {
        redirect('/');
    }

    return (
        <>
            <div className="flex h-screen items-center justify-center py-12 px-8 sm:px-6 lg:px-8 ">
                <SignupForm />
            </div>
        </>
    );
};

export default Page;
