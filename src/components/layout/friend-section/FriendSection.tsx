'use client';
import { FixedSidebar } from '@/components/layout';
import React from 'react';
import FriendList from './FriendList';
import { useSession } from 'next-auth/react';

interface Props {}

const FriendSection: React.FC<Props> = () => {
    const { data: session } = useSession();
    return (
        <FixedSidebar direction={'right'} hideOnMobile>
            <div className="relative h-full w-full">
                {session && <FriendList session={session} />}
            </div>
        </FixedSidebar>
    );
};
export default FriendSection;
