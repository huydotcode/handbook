import { FriendSection } from '@/components/layout';
import Action from '@/components/pages/Profile/Action';
import NavProfileItem from '@/components/pages/Profile/NavProfileItem';
import { navProfile } from '@/constants/navLink';
import ProfileProvider from '@/context/ProfileContext';
import { fetchFriends, fetchProfileByUserId } from '@/lib/actions/user.action';
import { getAuthSession } from '@/lib/auth';
import mongoose from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    const session = await getAuthSession();

    if (!user || !profile) notFound();

    const notCurrentUser = session && session.user.id !== user._id.toString();

    return (
        <>
            <div className="w-full min-h-[100vh-56px]">
                <div className="w-full">
                    <header className="w-full bg-white rounded-b-xl pb-2">
                        <div
                            className="relative w-full min-h-[300px] h-[40vh] rounded-b-xl overflow-hidden bg-center bg-cover bg-no-repeat"
                            style={{
                                backgroundImage: `url("${profile.coverPhoto}`,
                            }}
                        />

                        <div className="flex items-center justify-between lg:px-2 border-b">
                            <div className="flex items-center">
                                <div className="relative w-[164px] h-[164px] top-[-30px] rounded-full border-8 mr-4 object-cover overflow-hidden dark:border-neutral-500 md:w-[120px] md:h-[120px]">
                                    <Image
                                        className="rounded-full"
                                        src={user?.image || ''}
                                        alt={user?.name || ''}
                                        fill
                                    />
                                </div>
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
                            {notCurrentUser && (
                                <Action
                                    userId={JSON.parse(
                                        JSON.stringify(user._id)
                                    )}
                                />
                            )}
                        </div>

                        <div className="flex items-center w-[600px] max-w-[100vw] pt-2 px-2">
                            {navProfile.map((item, index) => (
                                <NavProfileItem
                                    key={index}
                                    name={item.name}
                                    path={item.path}
                                    userId={JSON.parse(
                                        JSON.stringify(user._id)
                                    )}
                                />
                            ))}
                        </div>
                    </header>

                    <main>{children}</main>
                </div>
            </div>

            <FriendSection show={false} />
        </>
    );
}
