import { Avatar, Button } from '@/components/ui';
import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import React from 'react';
import { PhotosSection } from '../../_components';

interface Props {
    params: {
        userId: string;
    };
}

const FriendsPage: React.FC<Props> = async ({ params }) => {
    const friends = (await getFriendsByUserId({
        userId: params.userId,
    })) as IFriend[];

    const photos = await getProfilePicturesAction({
        userId: params.userId,
    });

    return (
        <>
            <section className="relative my-3 w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                <h5 className="text-xl font-bold">Bạn bè</h5>
                <article>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                        {friends.map((friend) => {
                            return (
                                <Button
                                    href={`/profile/${friend._id}`}
                                    className="justify-start border"
                                    key={friend._id}
                                >
                                    <Avatar
                                        className="mr-2"
                                        width={42}
                                        height={42}
                                        imgSrc={friend.avatar}
                                        userUrl={friend._id}
                                    />

                                    <span>{friend.name}</span>
                                </Button>
                            );
                        })}
                    </ul>

                    {friends.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                            Không có bạn bè
                        </p>
                    )}
                </article>
            </section>

            <PhotosSection photos={photos} />
        </>
    );
};
export default FriendsPage;
