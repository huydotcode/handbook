import { getAuthSession } from '@/lib/auth';
import { UserService } from '@/lib/services';
import { cn } from '@/lib/utils';
import React from 'react';
import FriendList from './FriendList';

interface Props {
    className?: string;
    show?: boolean;
}

const FriendSection: React.FC<Props> = async ({ className, show }) => {
    const session = await getAuthSession();

    if (!session) return null;

    const friends = await UserService.getFriends({
        userId: session?.user.id || '',
    });

    return (
        <div className={cn('relative h-full', className)}>
            <FriendList data={friends} show={show} />
        </div>
    );
};
export default FriendSection;
