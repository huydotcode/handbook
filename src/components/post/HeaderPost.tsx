import { usePost } from '@/context';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import ActionPost from './ActionPost';

const HeaderPost = () => {
    const { data: session } = useSession();
    const { post } = usePost();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Avatar
                    imgSrc={post.author.avatar}
                    userUrl={post.author._id}
                    alt={post.author.name}
                    width={40}
                    height={40}
                />

                <div className="ml-2 flex flex-col items-center ">
                    <Link
                        href={`/profile/${post.author._id}`}
                        className="text-base hover:underline dark:text-dark-primary-1"
                    >
                        {post.author.name}
                    </Link>

                    <TimeAgoConverted
                        className="w-full text-xs text-secondary-1"
                        time={post.createdAt}
                    />
                </div>
            </div>

            {session?.user && session.user.id === post.author._id && (
                <ActionPost post={post} />
            )}
        </div>
    );
};
export default HeaderPost;
