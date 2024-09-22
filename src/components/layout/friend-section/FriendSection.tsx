import { getAuthSession } from '@/lib/auth';
import { ConversationService, UserService } from '@/lib/services';
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
        userId: session.user.id,
    });

    const conversations = await ConversationService.getConversationsByUserId({
        userId: session?.user.id || '',
    });

    return (
        <div
            className={cn(
                'fixed right-0 top-[56px] h-[calc(100vh-56px)] w-[200px] lg:w-fit md:hidden',
                className
            )}
        >
            <div className="relative h-full w-full">
                <FriendList friends={friends} conversations={conversations} />
            </div>
        </div>
    );
};
export default FriendSection;
