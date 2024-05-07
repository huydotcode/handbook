import { getAuthSession } from '@/lib/auth';
import { GroupService } from '@/lib/services';
import React from 'react';
import { Sidebar } from './_components';
import { redirect } from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

export function generateMetadata() {
    return {
        title: 'Nhóm của bạn | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();
    if (!session) redirect('/');

    return <>{children}</>;
};

export default GroupLayout;
