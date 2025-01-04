import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import React from 'react';
import { FriendsSection, PhotosSection } from '../../_components';

interface Props {
    params: Promise<{ userId: string }>;
}

const PhotosPage: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const photos = await getProfilePicturesAction({
        userId: userId,
    });

    const friends = (await getFriendsByUserId({
        userId: userId,
    })) as IFriend[];

    return (
        <>
            <PhotosSection photos={photos} />
            <FriendsSection className="w-full" friends={friends} />
        </>
    );
};
export default PhotosPage;
