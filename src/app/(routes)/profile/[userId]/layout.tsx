import { ProfileService } from '@/lib/services';
import { notFound } from 'next/navigation';
import { Header } from '../_components';

interface Props {
    params: {
        userId: string;
    };
    children: React.ReactNode;
}

const ProfileLayout = async ({ params, children }: Props) => {
    const profile = (await ProfileService.getProfileByUserId({
        query: params.userId,
    })) as IProfile;

    if (!profile) notFound();

    return (
        <div className="relative">
            <div className="min-h-[100vh-56px] w-full">
                <div className="w-full">
                    <Header profile={profile} user={profile.user} />
                    <main className="mt-4">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
