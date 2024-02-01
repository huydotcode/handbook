import React from 'react';

import AboutSection from './AboutSection';
import FriendsSection from './FriendsSection';
import PhotosSection from './PhotosSection';
import { fetchFriends } from '@/lib/actions/user.action';
import { getProfilePicturesAction } from '@/lib/actions/profile.action';

interface Props {
    className?: string;
    profile: IProfile;
}

const InfomationSection: React.FC<Props> = async ({ className, profile }) => {
    const friends = await fetchFriends({
        userId: profile.userId,
    });

    const photos = await getProfilePicturesAction({
        userId: profile.userId,
    });

    return (
        <div
            className={
                'w-[36%] grid-flow-row grid-cols-1 md:grid md:w-full ' +
                className
            }
        >
            <AboutSection profile={profile} />
            <PhotosSection photos={photos} />
            <FriendsSection friends={friends} />
        </div>
    );
};
export default InfomationSection;
