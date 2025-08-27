'use client';
import Avatar from '@/app/(routes)/profile/_components/Avatar';
import CoverPhoto from '@/app/(routes)/profile/_components/CoverPhoto';
import FollowAction from '@/app/(routes)/profile/_components/FollowAction';
import { MessageAction, TabItem } from '@/components/shared';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navProfile } from '@/constants/navLink';
import { useSession } from 'next-auth/react';
import React from 'react';
import AddFriendAction from './AddFriendAction';

interface Props {
    profile: IProfile;
}

const Header: React.FC<Props> = ({ profile }) => {
    const { data: session } = useSession();
    const user = profile.user;
    const isOwner = session && session.user.id == user._id.toString();

    return (
        <header className="w-full rounded-b-xl bg-white pb-2 dark:bg-dark-secondary-1">
            <CoverPhoto profile={profile} />

            <div className="flex items-center justify-between border-b px-2">
                <div className="flex items-center">
                    <Avatar user={profile.user} />
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

                {!isOwner && (
                    <>
                        <div className="flex h-12 items-center gap-2 md:hidden">
                            <MessageAction messageTo={user._id} />
                            <FollowAction userId={user._id} />
                            <AddFriendAction userId={user._id} />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="hidden p-2 text-2xl md:flex"
                                    size="lg"
                                    variant="text"
                                >
                                    <Icons.Menu />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className={'hidden md:block'}
                                align={'start'}
                            >
                                <DropdownMenuItem>
                                    <MessageAction
                                        className="justify-start"
                                        messageTo={user._id}
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <FollowAction
                                        className="justify-start"
                                        userId={user._id}
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <AddFriendAction
                                        className="justify-start"
                                        userId={user._id}
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
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
