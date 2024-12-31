import { InfinityPostComponent } from '@/components/post';
import { getProfileByUserId } from '@/lib/actions/profile.action';
import mongoose from 'mongoose';
import { FC } from 'react';
import { InfomationSection } from '../_components';

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
    const profile = await getProfileByUserId({
        query: params.userId,
    });

    const props = mongoose.isValidObjectId(params.userId)
        ? {
              userId: params.userId,
          }
        : { username: params.userId };

    return (
        <div className="flex justify-between md:flex-col">
            <InfomationSection profile={profile} />

            <div className="w-[60%] md:w-full">
                <InfinityPostComponent {...props} type="profile" />
            </div>
        </div>
    );
};

export default ProfilePage;
