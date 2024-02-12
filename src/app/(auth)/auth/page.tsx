import { DarkmodeButton } from '@/components/ui';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import Form from '../_components/Form';

interface Props {}

const page: React.FC<Props> = async () => {
    const session = await getAuthSession();

    if (session) redirect('/');

    return (
        <div className="flex h-screen items-center justify-center px-8 py-12 lg:px-8 sm:px-6">
            <DarkmodeButton className="fixed right-4 top-4" />
            <Form />
        </div>
    );
};
export default page;
