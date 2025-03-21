import { getProfileByUserId } from '@/lib/actions/profile.action';
import React from 'react';
import { InfomationSection } from '../../_components';
interface Props {
    params: Promise<{ userId: string }>;
}

const AboutPage: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const profile = await getProfileByUserId({
        query: userId,
    });

    return <InfomationSection className="w-full" profile={profile} />;
};
export default AboutPage;
