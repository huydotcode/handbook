import { navProfile } from '@/constants/navLink';
import { getAuthSession } from '@/lib/auth';
import Image from 'next/image';
import React from 'react';
import AddFriendAction from './AddFriendAction';
import { TabItem } from '@/components/shared';
import { Button } from '@/components/ui';
import Icons from '../../../../components/ui/Icons';
import FollowAction from '@/app/(routes)/profile/_components/FollowAction';

interface Props {
    profile: IProfile;
    user: IUser;
}

const Header: React.FC<Props> = async ({ profile, user }) => {
    const session = await getAuthSession();
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
                        <span className="text-sm">
                            {user?.friends?.length} bạn bè
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        className="h-12 min-w-[48px]"
                        variant="primary"
                        size="medium"
                    >
                        <Icons.Message />
                        <p className="ml-2 md:hidden">Nhắn tin</p>
                    </Button>

                    {notCurrentUser && <FollowAction userId={user._id} />}
                    {notCurrentUser && <AddFriendAction userId={user._id} />}
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
