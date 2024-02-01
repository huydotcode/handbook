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
            <div className="min-h-[100vh-56px] w-full">
                <div className="w-full">
                    <header className="w-full rounded-b-xl bg-white pb-2">
                        <div
                            className="relative h-[40vh] min-h-[300px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url("${profile.coverPhoto}`,
                            }}
                        />

                        <div className="flex items-center justify-between border-b lg:px-2">
                            <div className="flex items-center">
                                <div className="relative top-[-30px] mr-4 h-[164px] w-[164px] overflow-hidden rounded-full border-8 object-cover dark:border-neutral-500 md:h-[120px] md:w-[120px]">
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

                        <div className="flex w-[600px] max-w-[100vw] items-center px-2 pt-2">
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
