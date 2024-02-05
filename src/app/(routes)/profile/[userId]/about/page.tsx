import InfomationSection from '@/app/(pages)/profile/_components/InfomationSection';
import { fetchProfileByUserId } from '@/lib/actions/user.action';
import React from 'react';

interface Props {
    params: {
        userId: string;
    };
}

const AboutPage: React.FC<Props> = async ({ params: { userId } }) => {
    const { profile } = (await fetchProfileByUserId(userId)) as {
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
