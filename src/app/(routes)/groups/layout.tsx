import { IndexLayout } from '@/layouts';
import React from 'react';
import { Sidebar } from './_components';
import { GroupService } from '@/lib/services';
import { getAuthSession } from '@/lib/auth';

interface Props {
    children: React.ReactNode;
}

const GroupLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (!session) return null;

    const groups = await GroupService.getGroups({
        userId: session?.user.id,
    });

    return (
        <IndexLayout
            Left={<Sidebar groups={groups} />}
            Center={<>{children}</>}
        />
    );
};

export default GroupLayout;
