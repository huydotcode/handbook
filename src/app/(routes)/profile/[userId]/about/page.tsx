import React from 'react';
import { InfomationSection } from '../../_components';
import { ProfileService } from '@/lib/services';

interface Props {
    params: {
        userId: string;
    };
}

const AboutPage: React.FC<Props> = async ({ params: { userId } }) => {
    const { profile } = (await ProfileService.getProfileByUserId({
        userId,
    })) as {
        profile: IProfile;
    };

    return (
        <>
            <InfomationSection
                className="w-full"
                profile={JSON.parse(JSON.stringify(profile))}
            />
        </>
    );
};
export default AboutPage;
