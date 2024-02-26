import { FriendSection } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';
import { IndexLayout } from '@/layouts';
import { getAuthSession } from '@/lib/auth';
import React from 'react';
import { Sidebar } from './_components';
import GroupService from '@/lib/services/group.service';

interface Props {}

const GroupsPage: React.FC<Props> = async ({}) => {
    const session = await getAuthSession();
    const groups =
        (await GroupService.getGroups({
            userId: session?.user.id || '',
        })) || [];

    return (
        <IndexLayout
            Left={<Sidebar groups={groups} />}
            Center={
                <>
                    <h5 className="text-xl font-bold">Hoạt động gần đây</h5>
                    <InfinityPostComponent className="mt-4" type="group" />
                </>
            }
            Right={<FriendSection />}
        />
    );
};
export default GroupsPage;
