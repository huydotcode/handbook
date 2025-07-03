'use client';
import PhotoGrid from '@/components/post/PhotoGrid';
import ReviewPost from '@/components/post/ReviewPost';
import SkeletonPost from '@/components/post/SkeletonPost';
import { Button } from '@/components/ui/Button';
import VerifiedUser from '@/components/VerifiedUser';
import { API_ROUTES } from '@/config/api';
import postAudience from '@/constants/postAudience.constant';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { timeConvert3 } from '@/utils/timeConvert';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { ActionPost, FooterPost } from '.';
import { Avatar } from '../ui';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import VideoPlayer from '../ui/VideoPlayer';

interface Props {
    data: IPost;
    isManage?: boolean;
}

const Post: React.FC<Props> = React.memo(({ data, isManage = false }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { data: post } = useQuery<IPost>({
        queryKey: queryKey.posts.id(data._id),
        queryFn: async () => {
            const post = await axiosInstance.get<IPost>(
                API_ROUTES.POSTS.ID(data._id)
            );
            return post.data;
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchIntervalInBackground: false,
    });
    const showInPrivate =
        post &&
        post.option === 'private' &&
        pathname == `/profile/${post.author._id}` &&
        session?.user?.id == post.author._id;

    if (!post) return <SkeletonPost />;
    if (post.option == 'private' && !showInPrivate) return null;

    return (
        <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
            <PostHeader post={post} />
            <PostContent post={post} />
            {!isManage && <FooterPost post={post} />}
            {isManage && <ReviewPost post={post} />}
        </div>
    );
});

const PostHeader = ({ post }: { post: IPost }) => {
    const { data: session } = useSession();
    const isGroupPost = useMemo(() => post?.type === 'group', [post]);
    const path = usePathname();
    const isManageGroupPostActive =
        path === `/groups/${post.group?._id}/manage/posts`;
    const IconType = postAudience.find(
        (item) => item.value === post.option
    )?.icon;

    return (
        <div className="flex w-full items-start justify-between">
            {/* Left section: Avatar + Info */}
            <div className="flex items-start">
                {/* Avatar */}
                {isGroupPost && post.group ? (
                    <div className="relative">
                        <Avatar
                            imgSrc={post.group.avatar.url}
                            href={`/groups/${post.group._id}`}
                            alt={post.group.name}
                            width={40}
                            height={40}
                            rounded="md"
                        />
                        <Avatar
                            className="absolute -bottom-1 -right-1 rounded-full border-2 border-white"
                            imgSrc={post.author.avatar}
                            userUrl={post.author._id}
                            alt={post.author.name}
                            width={20}
                            height={20}
                        />
                    </div>
                ) : (
                    <Avatar
                        imgSrc={post.author.avatar}
                        userUrl={post.author._id}
                        alt={post.author.name}
                        width={40}
                        height={40}
                    />
                )}

                {/* Info */}
                <div className="ml-3 flex flex-col">
                    {/* Name or Group Name */}
                    <div className="flex items-center gap-1">
                        <Link
                            href={
                                post.group
                                    ? `/groups/${post.group._id}`
                                    : `/profile/${post.author._id}`
                            }
                            className="text-sm font-semibold hover:underline dark:text-dark-primary-1"
                        >
                            {post.group ? post.group.name : post.author.name}
                        </Link>

                        {!post.group && post.author.isVerified && (
                            <VerifiedUser className="text-blue-500" />
                        )}
                    </div>

                    {/* Author name (if in group) */}
                    {post.group && (
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/profile/${post.author._id}`}
                                className="text-xs text-secondary-1 hover:underline dark:text-dark-primary-1"
                            >
                                {post.author.name}
                            </Link>
                            {post.author.isVerified && (
                                <VerifiedUser className="text-blue-500" />
                            )}
                        </div>
                    )}

                    {/* Time + Privacy */}
                    <div className="flex items-center gap-1 text-xs text-secondary-1">
                        <span>{timeConvert3(post.createdAt.toString())}</span>

                        {IconType && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IconType className="ml-1" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span className="text-xs">
                                            {
                                                postAudience.find(
                                                    (item) =>
                                                        item.value ===
                                                        post.option
                                                )?.label
                                            }
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </div>

            {/* Right section: Action buttons */}
            {!isManageGroupPostActive &&
                session?.user &&
                session.user.id === post.author._id && (
                    <ActionPost post={post} />
                )}

            {isManageGroupPostActive && (
                <ActionPost post={post} isManage={isManageGroupPostActive} />
            )}
        </div>
    );
};

const PostContent = ({ post }: { post: IPost }) => {
    const [contentLength, setContentLength] = useState(post.text.length);

    const content = post.text.slice(0, contentLength).replace(/\n/g, '<br/>');
    const images = post.media.filter((m) => m.resourceType === 'image');
    const videos = post.media.filter((m) => m.resourceType === 'video');

    return (
        <div className="post-content my-2">
            <div
                className="post-content text-sm"
                dangerouslySetInnerHTML={{
                    __html: content || '',
                }}
            />
            {post.text.length > 100 && (
                <Button
                    className="mt-1 h-fit p-0 text-xs text-secondary-1 hover:underline"
                    variant={'custom'}
                    onClick={() => {
                        const newLength =
                            contentLength === 100 ? post.text.length : 100;
                        setContentLength(newLength);
                    }}
                >
                    {post?.text.length > 100 &&
                        contentLength != post.text.length &&
                        'Xem thêm'}
                    {contentLength === post.text.length && 'Ẩn bớt'}
                </Button>
            )}

            {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-secondary-1">Tags:</span>

                    {post.tags.map((tag) => (
                        <span key={tag} className="text-sm text-primary-2">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {images.length > 0 && <PhotoGrid images={images} />}

            {videos.length > 0 && (
                <div className="mt-3">
                    {videos.map((video) => (
                        <VideoPlayer src={video.url} key={video._id} />
                    ))}
                </div>
            )}
        </div>
    );
};

Post.displayName = 'Post';

export default Post;
