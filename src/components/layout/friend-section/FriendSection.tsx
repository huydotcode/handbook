import React from 'react';
import { fetchFriends } from '@/lib/actions/user.action';
import { getAuthSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import FriendList from './FriendList';

interface Props {
    className?: string;
    show?: boolean;
}

const FriendSection: React.FC<Props> = async ({ className, show }) => {
    const session = await getAuthSession();

    if (!session) return null;

    const friends = await fetchFriends({
        userId: session?.user.id || '',
    });

    return (
        <div className={cn('relative h-full w-full', className)}>
            <FriendList data={friends} show={show} />
        </div>
    );
};
export default FriendSection;
