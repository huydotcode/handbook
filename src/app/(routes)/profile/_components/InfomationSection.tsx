import { ProfileService, UserService } from '@/lib/services';
import { cn } from '@/lib/utils';
import React from 'react';
import { AboutSection, FriendsSection, PhotosSection } from '.';

interface Props {
    className?: string;
    profile: IProfile;
}

const InfomationSection: React.FC<Props> = async ({ className, profile }) => {
    const friends = await UserService.getFriends({
        userId: profile.userId,
    });

    const photos = await ProfileService.getProfilePicturesAction({
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
