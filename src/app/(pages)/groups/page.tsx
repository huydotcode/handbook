import { FriendSection } from '@/components/layout';
import CreateGroup from '@/components/pages/Groups/CreateGroup';
import Sidebar from '@/components/pages/Groups/Sidebar';
import { IndexLayout } from '@/layouts';
import React from 'react';

interface Props {}

const GroupsPage: React.FC<Props> = ({}) => {
    return (
        <IndexLayout
            Left={<Sidebar />}
            Center={
                <div className="mx-auto w-[500px] max-w-[100vw]">
                    <CreateGroup />
                </div>
            }
            Right={<FriendSection />}
        />
    );
};
export default GroupsPage;
