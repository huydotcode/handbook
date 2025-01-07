import { Button } from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    className?: string;
    friends: IFriend[];
}

const FriendsSection: React.FC<Props> = ({ className, friends }) => {
    return (
        <section
            className={cn(
                'relative my-3 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1',
                className
            )}
        >
            <h5 className="text-xl font-bold">Bạn bè</h5>

            <div className="mt-2 grid grid-cols-3 gap-2">
                {friends.slice(0, 5).map((friend: IFriend) => {
                    const name = friend.name.split(' ').filter((s) => s != '')[
                        friend.name.split(' ').filter((s) => s != '').length - 1
                    ];

                    return (
                        <Button
                            href={`/profile/${friend._id}`}
                            className="h-20 flex-col"
                            key={friend._id}
                        >
                            <Avatar
                                width={42}
                                height={42}
                                imgSrc={friend.avatar}
                                userUrl={friend._id}
                                onlyImage={true}
                            />

                            <span>{name}</span>
                        </Button>
                    );
                })}
            </div>
            {friends.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">Không có bạn bè</p>
            )}
        </section>
    );
};
export default FriendsSection;
