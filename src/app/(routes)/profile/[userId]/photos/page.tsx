import ProfileService from '@/lib/services/profile.service';
import UserService from '@/lib/services/user.service';
import React from 'react';
import { FriendsSection, PhotosSection } from '../../_components';

interface Props {
    params: Promise<{ userId: string }>;
}

const PhotosPage: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const photos = await ProfileService.getProfilePicturesAction(userId);

    const friends = await UserService.getFriendsByUserId({
        userId: userId,
    });

    return (
        <>
            <PhotosSection photos={photos} />
            <FriendsSection className="w-full" friends={friends} />
        </>
    );
};
export default PhotosPage;
