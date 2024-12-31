import { getProfileByUserId } from '@/lib/actions/profile.action';
import { Header } from '../_components';
import { getAuthSession } from '@/lib/auth';
import { Loading } from '@/components/ui';

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
    const profile = (await getProfileByUserId({
        query: params.userId,
    })) as IProfile;

    return {
        title: `${profile.user.name} - Profile`,
    };
}

const ProfileLayout = async ({ params, children }: Props) => {
    const session = await getAuthSession();

    if (!session) {
        return <Loading fullScreen={true} />;
    }

    return (
        <div className={'mx-auto w-container max-w-screen'}>
            <div className="w-full pb-96">
                <div className="h-full w-full">
                    <Header session={session} />
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
