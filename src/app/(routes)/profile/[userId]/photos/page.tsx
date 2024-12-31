import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import React from 'react';
import { FriendsSection, PhotosSection } from '../../_components';

interface Props {
    params: {
        userId: string;
    };
}

const PhotosPage: React.FC<Props> = async ({ params }) => {
    const photos = (await getProfilePicturesAction({
        userId: params.userId,
    })) as string[];

    const friends = (await getFriendsByUserId({
        userId: params.userId,
    })) as IFriend[];

    return (
        <>
            <PhotosSection photos={photos} />
            <FriendsSection className="w-full" friends={friends} />
        </>
    );
};
export default PhotosPage;
