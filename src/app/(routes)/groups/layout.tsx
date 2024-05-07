import { getAuthSession } from '@/lib/auth';
import { GroupService } from '@/lib/services';
import React from 'react';
import { Sidebar } from './_components';

interface Props {
    children: React.ReactNode;
    params: {
        groupId: string;
    };
}

export function generateMetadata() {
    return {
        title: 'Nhóm của bạn | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({
    children,
    params: { groupId },
}) => {
    const session = await getAuthSession();
    if (!session) return null;

    console.log('groupId', groupId);

    const groups = await GroupService.getGroups({
        userId: session?.user.id,
    });

    return (
        <div>
            <Sidebar groups={groups} />

            <div className="ml-[300px] pl-4 lg:ml-[200px] md:ml-[72px]">
                {children}
            </div>
        </div>
    );
};

export default GroupLayout;
