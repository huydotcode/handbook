import ProfileService from '@/lib/services/profile.service';
import { notFound } from 'next/navigation';
import { Header } from '../_components';

interface Props {
    params: Promise<{ userId: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props) {
    const { userId } = await params;
    const profile = await ProfileService.getByUserId(userId);
    if (!profile) {
        return {
            title: 'Trang cá nhân không tồn tại',
        };
    }

    return {
        title: `${profile.user.name} | Trang cá nhân`,
    };
}

const ProfileLayout = async ({ params, children }: Props) => {
    const { userId } = await params;
    const profile = await ProfileService.getByUserId(userId);
    if (!profile) notFound();

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
