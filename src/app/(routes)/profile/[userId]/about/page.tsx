import { ProfileService } from '@/lib/services';
import React from 'react';
import { InfomationSection } from '../../_components';

interface Props {
    params: {
        userId: string;
    };
}

const AboutPage: React.FC<Props> = async ({ params: { userId } }) => {
    const profile = await ProfileService.getProfileByUserId({
        query: userId,
    });

    return <InfomationSection className="w-full" profile={profile} />;
};
export default AboutPage;
