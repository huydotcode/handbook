import { InfinityPostComponent } from '@/components/post';
import ProfileService from '@/lib/services/profile.service';
import mongoose from 'mongoose';
import { FC } from 'react';
import { InfomationSection } from '../_components';

interface ProfilePageProps {
    params: Promise<{ userId: string }>;
}

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
    const { userId } = await params;
    const profile = await ProfileService.getByUserId(userId);
    if (!profile) {
        return (
            <div className="text-center text-red-500">
                Trang cá nhân không tồn tại
            </div>
        );
    }

    const props = mongoose.isValidObjectId(userId)
        ? {
              userId: userId,
          }
        : { username: userId };

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
