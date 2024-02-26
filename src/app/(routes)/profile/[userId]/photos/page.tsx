import React from 'react';
import { ProfileService, UserService } from '@/lib/services';
import { FriendsSection, PhotosSection } from '../../_components';

interface Props {
    params: {
        userId: string;
    };
}

const PhotosPage: React.FC<Props> = async ({ params }) => {
    const photos = (await ProfileService.getProfilePicturesAction({
        userId: params.userId,
    })) as string[];

    const friends = (await UserService.getFriends({
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
