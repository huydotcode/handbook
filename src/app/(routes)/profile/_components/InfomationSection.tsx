import { getProfilePicturesAction } from '@/lib/actions/profile.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import { cn } from '@/lib/utils';
import React from 'react';
import { AboutSection, FriendsSection, PhotosSection } from '.';

interface Props {
    className?: string;
    profile: IProfile;
}

const InfomationSection: React.FC<Props> = async ({ className, profile }) => {
    const friends = await getFriendsByUserId({
        userId: profile.user._id,
    });

    const photos = await getProfilePicturesAction({
        userId: profile.user._id,
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
