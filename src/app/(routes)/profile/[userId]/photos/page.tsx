import FriendsSection from '@/app/(pages)/profile/_components/FriendsSection';
import PhotosSection from '@/app/(pages)/profile/_components/PhotosSection';
import {
    fetchPhotos,
    getProfilePicturesAction,
} from '@/lib/actions/profile.action';
import { fetchFriends } from '@/lib/actions/user.action';
import Image from 'next/image';
import React from 'react';

interface Props {
    params: {
        userId: string;
    };
}

const PhotosPage: React.FC<Props> = async ({ params }) => {
    // const photos = (await fetchPhotos({
    //     userId: params.userId,
    // })) as CloudinaryImage[];

    const photos = (await getProfilePicturesAction({
        userId: params.userId,
    })) as string[];

    const friends = (await fetchFriends({
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
