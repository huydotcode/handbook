'use client';
import { FixedSidebar } from '@/components/layout';
import React from 'react';
import FriendList from './FriendList';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface Props {
    session: Session;
}

const FriendSection: React.FC<Props> = ({ session }) => {
    return (
        <FixedSidebar direction={'right'} hideOnMobile>
            <div className="relative h-full w-full">
                <FriendList session={session} />
            </div>
        </FixedSidebar>
    );
};
export default FriendSection;
