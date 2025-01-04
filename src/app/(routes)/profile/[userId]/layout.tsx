import { getProfileByUserId } from '@/lib/actions/profile.action';
import { Header } from '../_components';

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
        title: `${profile.user.name} - Profile`,
    };
}

const getProfile = async (userId: string) => {
    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/profile?userid=${userId}`
    );
    const profile = await res.json();
    return profile;
};

const ProfileLayout = async ({ params, children }: Props) => {
    const { userId } = await params;
    const profile = await getProfile(userId);
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
