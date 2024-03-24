import { ProfileService } from '@/lib/services';
import { notFound } from 'next/navigation';
import { Header } from '../_components';

interface Props {
    params: {
        userId: string;
    };
    children: React.ReactNode;
}

export async function generateMetadata({
    params,
}: {
    params: {
        userId: string;
    };
}) {
    const profile = (await ProfileService.getProfileByUserId({
        query: params.userId,
    })) as IProfile;

    return {
        title: 'Trang cá nhân - ' + profile.user.name,
    };
}

const ProfileLayout = async ({ params, children }: Props) => {
    const profile = (await ProfileService.getProfileByUserId({
        query: params.userId,
    })) as IProfile;

    if (!profile) notFound();

    return (
        <div className="relative">
            <div className="w-full pb-96">
                <div className="h-full w-full">
                    <Header profile={profile} user={profile.user} />
                    <main className="mt-4">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
