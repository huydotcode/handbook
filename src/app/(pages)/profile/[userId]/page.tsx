import { NewsFeedPost } from '@/components';
import InfomationSection from '@/components/pages/Profile/InfomationSection';
import {
    fetchProfileByUserId,
    fetchSomeFriendUser,
    fetchUserData,
} from '@/lib/actions/user.action';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FC } from 'react';

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

interface Friend {
    id: string;
    image: string;
    name: string;
}

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
    const { user, profile } = await fetchProfileByUserId(params.userId);
    // const friends = (await fetchSomeFriendUser(params.userId)) as Friend[];
    const friends = [] as Friend[];

    if (!user || !profile) notFound();

    return (
        <>
            <div className="max-w-[80%] min-h-[100vh-56px] pb-[200px] mx-auto lg:max-w-full">
                <div className="w-full">
                    <header className="w-full">
                        <div
                            className="relative w-[1000px] max-w-[100vw] min-h-[300px] h-[40vh] rounded-b-xl overflow-hidden bg-center bg-cover bg-no-repeat"
                            style={{
                                backgroundImage: `url("${profile.coverPhoto}`,
                            }}
                        />

                        <div className="flex items-center justify-between lg:px-2">
                            <div className="flex items-center">
                                {/* Avatar */}
                                <div className="relative w-[164px] h-[164px] top-[-30px] rounded-full border-8 mr-4 object-cover overflow-hidden dark:border-neutral-500 md:w-[120px] md:h-[120px]">
                                    <Image
                                        className="rounded-full"
                                        src={user?.image || ''}
                                        alt={user?.name || ''}
                                        fill
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    <h5 className="text-2xl font-black md:text-lg">
                                        {user?.name}
                                    </h5>
                                    <span className="text-sm text-secondary">
                                        {user?.friends?.length} bạn bè
                                    </span>

                                    <br />
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex justify-between md:flex-col">
                        <InfomationSection
                            profile={JSON.parse(JSON.stringify(profile))}
                            friends={friends}
                        />

                        <div className="w-[60%] md:w-full">
                            <NewsFeedPost userId={params.userId} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
