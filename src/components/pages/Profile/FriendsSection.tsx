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
                'relative my-3 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200 ' +
                className
            }
        >
            <h5 className="text-xl font-bold">Bạn bè</h5>
            <div>
                <div className="grid grid-cols-5 gap-2 mt-2">
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
                                    className="flex flex-col items-center justify-center hover:bg-light-100 p-2"
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
