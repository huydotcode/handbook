import { FriendSection } from '@/components/layout';
import { IndexLayout } from '@/layouts';
import { getGroups } from '@/lib/actions/group.action';
import React from 'react';
import { CreateGroup, GroupList, Sidebar } from './_components';

interface Props {}

const GroupsPage: React.FC<Props> = async ({}) => {
    const groups = await getGroups();
    return (
        <IndexLayout
            Left={<Sidebar />}
            Center={
                <div className="mx-auto w-[500px] max-w-[100vw]">
                    <div>
                        <h5 className="text-xl font-bold">Nhóm của bạn</h5>
                    </div>

                    <CreateGroup />
                    <GroupList data={groups.data || []} />
                </div>
            }
            Right={<FriendSection />}
        />
    );
};
export default GroupsPage;
