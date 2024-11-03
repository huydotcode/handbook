import { ProfileService } from '@/lib/services';
import { notFound } from 'next/navigation';
import { Header } from '../_components';
import { Container } from '@/components/layout';

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
        title: profile.user.name,
    };
}

const ProfileLayout = async ({ params, children }: Props) => {
    const profile = (await ProfileService.getProfileByUserId({
        query: params.userId,
    })) as IProfile;
    if (!profile) notFound();

    return (
        <Container>
            <div className="w-full pb-96">
                <div className="h-full w-full">
                    <Header profile={profile} user={profile.user} />
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </Container>
    );
};

export default ProfileLayout;
