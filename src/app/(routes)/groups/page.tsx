import React from 'react';
import { FriendSection } from '@/components/layout';
import { IndexLayout } from '@/layouts';
import { CreateGroup } from './_components';

interface Props {}

const GroupsPage: React.FC<Props> = async ({}) => {
    return (
        <IndexLayout
            Center={
                <>
                    <div>
                        <h5 className="text-xl font-bold">Nhóm của bạn</h5>
                    </div>

                    <CreateGroup />
                </>
            }
            Right={<FriendSection />}
        />
    );
};
export default GroupsPage;
