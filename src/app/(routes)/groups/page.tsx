import { FriendSection } from '@/components/layout';
import { CreateGroup, Sidebar } from './_components';
import { IndexLayout } from '@/layouts';
import React from 'react';

interface Props {}

const GroupsPage: React.FC<Props> = ({}) => {
    return (
        <IndexLayout
            Left={<Sidebar />}
            Center={
                <div className="mx-auto w-[500px] max-w-[100vw]">
                    <div>
                        <h5 className="text-xl font-bold">Nhóm của bạn</h5>
                    </div>

                    <CreateGroup />
                </div>
            }
            Right={<FriendSection />}
        />
    );
};
export default GroupsPage;
