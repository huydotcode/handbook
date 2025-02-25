import { Avatar } from '@/components/ui';
import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import React from 'react';
import { PhotosSection } from '../../_components';
import { Button } from '@/components/ui/Button';

interface Props {
    params: Promise<{ userId: string }>;
}

const FriendsPage: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const friends = (await getFriendsByUserId({
        userId: userId,
    })) as IFriend[];

    const images = await getProfilePicturesAction({
        userId: userId,
    });

    return (
        <>
            <section className="relative my-3 w-full rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                <h5 className="text-xl font-bold">Bạn bè</h5>
                <article>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {friends.map((friend) => {
                            return (
                                <Button
                                    className="h-14 justify-start border"
                                    key={friend._id}
                                    href={`/profile/${friend._id}`}
                                    variant={'ghost'}
                                >
                                    <Avatar
                                        className="mr-2"
                                        width={42}
                                        height={42}
                                        imgSrc={friend.avatar}
                                        userUrl={friend._id}
                                        onlyImage={true}
                                    />

                                    <span className={'text-sm'}>
                                        {friend.name}
                                    </span>
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

            <PhotosSection photos={images} />
        </>
    );
};
export default FriendsPage;
