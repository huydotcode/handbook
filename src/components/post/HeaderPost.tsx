import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import Avatar from '../Avatar';
import ActionPost from './ActionPost';
import TimeAgoConverted from '@/utils/timeConvert';
import usePostContext from '@/hooks/usePostContext';
import { useSession } from 'next-auth/react';

const HeaderPost = () => {
    const { data: session } = useSession();
    const { post, user } = usePostContext();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Avatar
                    imgSrc={user.image}
                    userUrl={user._id}
                    alt={user.name}
                    width={40}
                    height={40}
                />

                <div className="ml-2 flex flex-col items-center ">
                    <Link
                        href={`/profile/${user?._id}`}
                        className="text-base hover:underline dark:text-primary"
                    >
                        {user?.name}
                    </Link>

                    <TimeAgoConverted
                        className="w-full text-xs"
                        time={post.createdAt}
                    />
                </div>
            </div>

            {session?.user && session.user.id === user._id && (
                <ActionPost post={post} />
            )}
        </div>
    );
};
export default HeaderPost;
