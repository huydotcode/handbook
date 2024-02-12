import { fetchFriends } from '@/lib/actions/user.action';
import { getAuthSession } from '@/lib/auth';
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

    const friends = await fetchFriends({
        userId: session?.user.id || '',
    });

    return (
        <>
            <aside
                className={cn(
                    'fixed right-0 top-[72px] flex h-[calc(100vh-72px)] w-[20%] justify-end lg:w-[10%] md:hidden',
                    className
                )}
            >
                <div className="relative h-full w-full">
                    <FriendList data={friends} show={show} />
                </div>
            </aside>
        </>
    );
};
export default FriendSection;
