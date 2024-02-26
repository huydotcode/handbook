import React from 'react';
import { Avatar, Button } from '@/components/ui';
import { ProfileService, UserService } from '@/lib/services';
import { PhotosSection } from '../../_components';

interface Props {
    params: {
        userId: string;
    };
}

const FriendsPage: React.FC<Props> = async ({ params }) => {
    const friends = (await UserService.getFriends({
        userId: params.userId,
    })) as IFriend[];

    const photos = await ProfileService.getProfilePicturesAction({
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
                                        imgSrc={friend.image}
                                        userUrl={friend._id}
                                    />

                                    <span>{friend.name}</span>
                                </Button>
                            );
                        })}
                    </ul>
                </article>
            </section>

            <PhotosSection photos={photos} />
        </>
    );
};
export default FriendsPage;
