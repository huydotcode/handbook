import React from 'react';
import { AboutSection, PhotosSection, FriendsSection } from '.';
import { fetchFriends } from '@/lib/actions/user.action';
import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { cn } from '@/lib/utils';

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
            className={cn(
                'w-[36%] grid-flow-row grid-cols-1 md:grid md:w-full',
                className
            )}
        >
            <AboutSection profile={profile} />
            <PhotosSection photos={photos} />
            <FriendsSection friends={friends} />
        </div>
    );
};
export default InfomationSection;
