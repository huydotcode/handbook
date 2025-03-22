import { getProfileByUserId } from '@/lib/actions/profile.action';
import { Header } from '../_components';
import { useSession } from 'next-auth/react';

interface Props {
    params: Promise<{ userId: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props) {
    const { userId } = await params;
    const profile = (await getProfileByUserId({
        query: userId,
    })) as IProfile;

    return {
        title: `${profile.user.name} | Trang cá nhân`,
    };
}

const ProfileLayout = async ({ params, children }: Props) => {
    const { userId } = await params;
    const profile = await getProfileByUserId({ query: userId });
    if (!profile) throw new Error("Profile doesn't exist");

    return (
        <div className={'mx-auto w-container max-w-screen'}>
            <div className="w-full pb-96">
                <div className="h-full w-full">
                    <Header profile={profile} />
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
