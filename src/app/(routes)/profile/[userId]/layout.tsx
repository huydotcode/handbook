import { FriendSection } from '@/components/layout';
import { fetchProfileByUserId } from '@/lib/actions/user.action';
import { notFound } from 'next/navigation';
import { Header } from '../_components';

interface Props {
    params: {
        userId: string;
    };
    children: React.ReactNode;
}

export default async function ProfileLayout({ params, children }: Props) {
    const { user, profile } = (await fetchProfileByUserId(params.userId)) as {
        user: IUser;
        profile: IProfile;
    };

    if (!user || !profile) notFound();

    return (
        <>
            <div className="min-h-[100vh-56px] w-full">
                <div className="w-full">
                    <Header profile={profile} user={user} />
                    <main>{children}</main>
                </div>
            </div>

            <FriendSection show={false} />
        </>
    );
}
