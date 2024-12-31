import { FixedSidebar } from '@/components/layout';
import React from 'react';
import FriendList from './FriendList';

interface Props {}

const FriendSection: React.FC<Props> = async () => {
    return (
        <FixedSidebar direction={'right'} hideOnMobile>
            <div className="relative h-full w-full">
                <FriendList />
            </div>
        </FixedSidebar>
    );
};
export default FriendSection;
