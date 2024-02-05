import Avatar from '@/components/Avatar';
import PhotosSection from '@/app/(pages)/profile/_components/PhotosSection';
import {
    fetchPhotos,
    getProfilePicturesAction,
} from '@/lib/actions/profile.action';
import { fetchFriends } from '@/lib/actions/user.action';
import React from 'react';

interface Props {
    params: {
        userId: string;
    };
}

const FriendsPage: React.FC<Props> = async ({ params }) => {
    const friends = (await fetchFriends({
        userId: params.userId,
    })) as IFriend[];

    const photos = await getProfilePicturesAction({
        userId: params.userId,
    });

    return (
        <>
            <section className="relative my-3 w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-200">
                <h5 className="text-xl font-bold">Bạn bè</h5>
                <article>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                        {friends.map((friend) => {
                            return (
                                <div
                                    className="flex cursor-pointer items-center rounded-xl border p-2 hover:bg-dark-500"
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
                                </div>
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
