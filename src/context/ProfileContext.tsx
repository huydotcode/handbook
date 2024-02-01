'use client';
import { fetchFriends, fetchProfileByUserId } from '@/lib/actions/user.action';
import mongoose from 'mongoose';
import { notFound } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface ProfileContext {
    user: IUser;
    profile: IProfile;
    friends: IFriend[];
}

const ProfileContext = createContext<ProfileContext>({
    user: {} as IUser,
    profile: {} as IProfile,
    friends: [],
});

export const useProfile = () => {
    return useContext(ProfileContext);
};

interface Props {
    userParams: string;
    children: React.ReactNode;
}

const ProfileProvider: React.FC<Props> = ({ userParams, children }) => {
    const [user, setUser] = useState<IUser>();
    const [profile, setProfile] = useState<IProfile>();
    const [friends, setFriends] = useState<IFriend[]>([]);

    useEffect(() => {
        (async () => {
            const { user, profile } = (await fetchProfileByUserId(
                userParams
            )) as {
                user: IUser;
                profile: IProfile;
            };
            const friends = (await fetchFriends({
                userId: userParams,
            })) as IFriend[];

            const props = mongoose.isValidObjectId(userParams)
                ? {
                      userId: userParams,
                  }
                : { username: userParams };

            setUser(user);
            setProfile(profile);
            setFriends(friends);
        })();
    }, [userParams]);

    if (!user || !profile) return children;

    return (
        <ProfileContext.Provider
            value={{
                user,
                profile,
                friends,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;
