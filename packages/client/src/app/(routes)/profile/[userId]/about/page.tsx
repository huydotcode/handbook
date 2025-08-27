import ProfileService from '@/lib/services/profile.service';
import React from 'react';
import { InfomationSection } from '../../_components';
interface Props {
    params: Promise<{ userId: string }>;
}

const AboutPage: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const profile = await ProfileService.getByUserId(userId);

    if (!profile) {
        return <></>;
    }

    return <InfomationSection className="w-full" profile={profile} />;
};
export default AboutPage;
