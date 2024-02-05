import usePostContext from '@/hooks/usePostContext';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Avatar from '../Avatar';
import ActionPost from './ActionPost';

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
