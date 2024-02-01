import Avatar from '@/components/Avatar';
import React from 'react';

interface Props {
    className?: string;
    friends: IFriend[];
}

const FriendsSection: React.FC<Props> = ({ className, friends }) => {
    return (
        <section
            className={
                'relative my-3 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-200 ' +
                className
            }
        >
            <h5 className="text-xl font-bold">Bạn bè</h5>
            <div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                    {friends.slice(0, 5).map((friend: IFriend) => {
                        const name = friend.name
                            .split(' ')
                            .filter((s) => s != '')[
                            friend.name.split(' ').filter((s) => s != '')
                                .length - 1
                        ];

                        return (
                            <>
                                <div
                                    className="flex flex-col items-center justify-center p-2 hover:bg-light-100"
                                    key={friend._id}
                                >
                                    <Avatar
                                        width={42}
                                        height={42}
                                        imgSrc={friend.image}
                                        userUrl={friend._id}
                                    />

                                    <span>{name}</span>
                                </div>
                            </>
                        );
                    })}
                </div>
                {friends.length === 0 && (
                    <p className="text-sm text-secondary">Không có bạn bè</p>
                )}
            </div>
        </section>
    );
};
export default FriendsSection;
