import { getAuthSession } from '@/lib/auth';
import { GroupService } from '@/lib/services';
import React from 'react';
import { Sidebar } from './_components';

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

    if (!session) return null;

    const groups = await GroupService.getGroups({
        userId: session?.user.id,
    });

    return (
        <>
            <Sidebar groups={groups} />
            <div className="ml-[300px] pl-4 lg:ml-[200px] md:ml-[72px]">
                {children}
            </div>
        </>
    );
};

export default GroupLayout;
