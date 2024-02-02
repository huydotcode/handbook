import { FriendSection } from '@/components/layout';
import Action from '@/components/pages/Profile/Action';
import Header from '@/components/pages/Profile/Header';
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

    return (
        <>
            <div className="min-h-[100vh-56px] w-full">
                <div className="w-full">
                    <Header profile={profile} user={user} />
                    <main>{children}</main>
                </div>
            </div>

            <FriendSection show={false} />
        </>
    );
}
