'use client';
import FollowAction from '@/app/(routes)/profile/_components/FollowAction';
import { MessageAction, TabItem } from '@/components/shared';
import { navProfile } from '@/constants/navLink';
import Image from 'next/image';
import React from 'react';
import AddFriendAction from './AddFriendAction';
import { useSession } from 'next-auth/react';
import { useProfile } from '@/context/SocialContext';
import { Session } from 'next-auth';

interface Props {
    profile: IProfile;
}

const Header: React.FC<Props> = ({ profile }) => {
    const { data: session } = useSession();
    const user = profile.user;
    const notCurrentUser = session && session.user.id !== user._id.toString();

    return (
        <header className="w-full rounded-b-xl bg-white pb-2 dark:bg-dark-secondary-1">
            <div
                className="relative h-[40vh] min-h-[300px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${profile.coverPhoto || '/assets/img/cover-page.jpg'}`,
                }}
            />

            <div className="flex items-center justify-between border-b px-2">
                <div className="flex items-center">
                    <div className="relative top-[-30px] mr-4 h-[164px] w-[164px] overflow-hidden rounded-full border-8 object-cover dark:border-dark-secondary-2 md:h-[120px] md:w-[120px]">
                        <Image
                            className="rounded-full"
                            src={user?.avatar || ''}
                            alt={user?.name || ''}
                            fill
                        />
                    </div>
                    <div>
                        <h5 className="text-2xl font-black md:text-lg">
                            {user?.name}
                        </h5>
                        <div className="flex flex-col">
                            {user?.friends?.length > 0 && (
                                <span className="text-sm">
                                    {user?.friends?.length} bạn bè
                                </span>
                            )}
                            {user?.followersCount > 0 && (
                                <span className="text-sm">
                                    {user?.followersCount} người theo dõi
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex h-12 items-center gap-2">
                    {notCurrentUser && (
                        <>
                            <MessageAction
                                className="h-full"
                                messageTo={user._id}
                            />
                            <FollowAction userId={user._id} />
                            <AddFriendAction userId={user._id} />
                        </>
                    )}
                </div>
            </div>

            <div className="flex w-[600px] max-w-screen items-center px-2 pt-2">
                {navProfile.map((item, index) => (
                    <TabItem
                        key={index}
                        name={item.name}
                        path={item.path}
                        id={JSON.parse(JSON.stringify(user._id))}
                        page="profile"
                    />
                ))}
            </div>
        </header>
    );
};
export default Header;
