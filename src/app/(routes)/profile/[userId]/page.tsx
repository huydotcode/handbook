import mongoose from 'mongoose';
import { FC } from 'react';
import { fetchProfileByUserId } from '@/lib/actions/user.action';
import { InfomationSection } from '../_components';
import { InfinityPostComponent } from '@/components/post';

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
    const { profile } = (await fetchProfileByUserId(params.userId)) as {
        profile: IProfile;
    };

    const props = mongoose.isValidObjectId(params.userId)
        ? {
              userId: params.userId,
          }
        : { username: params.userId };

    return (
        <div className="flex justify-between md:flex-col">
            <InfomationSection profile={JSON.parse(JSON.stringify(profile))} />

            <div className="w-[60%] md:w-full">
                <InfinityPostComponent className="w-full" {...props} />
            </div>
        </div>
    );
};

export default ProfilePage;
