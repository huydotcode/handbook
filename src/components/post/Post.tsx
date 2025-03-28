'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ActionPost, FooterPost } from '.';
import { Avatar } from '../ui';
import { timeConvert3 } from '@/utils/timeConvert';
import { Button } from '@/components/ui/Button';
import { getPostByPostId, updateStatusPost } from '@/lib/actions/post.action';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNewFeedPostsKey, getPostKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import PhotoGrid from '@/components/post/PhotoGrid';
import SkeletonPost from '@/components/post/SkeletonPost';
import { Icons } from '@/components/ui';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    data: IPost;
    isManage?: boolean;
    isSaved?: boolean;
}

const Post: React.FC<Props> = React.memo(
    ({ data, isManage = false, isSaved = false }) => {
        const pathname = usePathname();
        const { data: session } = useSession();
        const { data: post } = useQuery<IPost>({
            queryKey: getPostKey(data._id),
            queryFn: async () => {
                const post = await getPostByPostId({ postId: data._id });
                return post;
            },
            refetchInterval: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchIntervalInBackground: false,
        });
        const queryClient = useQueryClient();
        const [contentLength, setContentLength] = useState<number>(100);

        const content = post?.text
            .slice(0, contentLength)
            .replace(/\n/g, '<br/>');
        const showInPrivate =
            post &&
            post.option === 'private' &&
            pathname == `/profile/${post.author._id}` &&
            session?.user?.id == post.author._id;

        const handleAcceptPost = async (accept: boolean) => {
            if (!post) return;

            try {
                await updateStatusPost({
                    postId: post._id,
                    status: accept ? 'active' : 'rejected',
                    path: pathname,
                });

                await queryClient.invalidateQueries({
                    queryKey: getNewFeedPostsKey(
                        'manage-group-posts',
                        undefined,
                        post.group?._id,
                        undefined
                    ),
                });

                await queryClient.invalidateQueries({
                    queryKey: getPostKey(post._id),
                });

                if (accept) {
                    await queryClient.invalidateQueries({
                        queryKey: getNewFeedPostsKey(
                            'manage-group-posts',
                            undefined,
                            post.group?._id,
                            undefined
                        ),
                    });
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        };

        if (!post) return <SkeletonPost />;

        if (post.option == 'private' && !showInPrivate) return null;

        return (
            <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {post.group ? (
                            <div className="relative">
                                <Avatar
                                    imgSrc={post.group.avatar.url}
                                    href={`groups/${post.group._id}`}
                                    alt={post.group.name}
                                    width={40}
                                    height={40}
                                    rounded="md"
                                />

                                <Avatar
                                    className="absolute -bottom-1 -right-1 rounded-xl border border-white"
                                    imgSrc={post.author.avatar}
                                    userUrl={post.author._id}
                                    alt={post.author.name}
                                    width={22}
                                    height={22}
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

                        <div className="ml-2 flex flex-col items-start">
                            <div className="flex items-center justify-between">
                                <Link
                                    href={
                                        post.group
                                            ? `/groups/${post.group._id}`
                                            : `/profile/${post.author._id}`
                                    }
                                    className="text-base hover:underline dark:text-dark-primary-1"
                                >
                                    {post.group
                                        ? post.group.name
                                        : post.author.name}
                                </Link>

                                {!post.group && post.author.isVerified && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className={'ml-1'}>
                                                    <Icons.Verified />
                                                </span>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                <div className={'text-xs'}>
                                                    Tài khoản đã được xác thực
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>

                            <div
                                className={cn('', {
                                    'mt-1 flex items-center':
                                        post.type === 'group',
                                })}
                            >
                                {post.group && (
                                    <Link
                                        href={`/profile/${post.author._id}`}
                                        className="mr-2 whitespace-nowrap text-xs text-secondary-1 hover:underline dark:text-dark-primary-1"
                                    >
                                        {post.author.name}
                                    </Link>
                                )}

                                {post.group && post.author.isVerified && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className={'mr-2'}>
                                                    <Icons.Verified />
                                                </span>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                <div className={'text-xs'}>
                                                    Tài khoản đã được xác thực
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                <p className="w-full text-xs text-secondary-1">
                                    {timeConvert3(post.createdAt.toString())}
                                </p>
                            </div>
                        </div>
                    </div>

                    {session?.user && session.user.id === post.author._id && (
                        <ActionPost post={post} />
                    )}
                </div>

                {/* Content */}
                <main className="mb-2 mt-4 ">
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                            __html: content || '',
                        }}
                    />

                    {post?.text.length > 100 && (
                        <Button
                            className="mt-1 h-fit p-0 text-xs text-secondary-1 hover:underline"
                            variant={'custom'}
                            onClick={() => {
                                const newLength =
                                    contentLength === 100
                                        ? post.text.length
                                        : 100;
                                setContentLength(newLength);
                            }}
                        >
                            {post?.text.length > 100 &&
                                contentLength != post.text.length &&
                                'Xem thêm'}
                            {contentLength === post.text.length && 'Ẩn bớt'}
                        </Button>
                    )}

                    {post.images.length > 0 && (
                        <PhotoGrid images={post.images} />
                    )}
                </main>

                {/* Footer */}
                {!isManage && <FooterPost post={post} isSaved={isSaved} />}
                {isManage && (
                    <div className={'flex w-full justify-center gap-4'}>
                        <Button
                            className="mt-2"
                            variant="primary"
                            size={'md'}
                            onClick={() => handleAcceptPost(true)}
                        >
                            Duyệt bài
                        </Button>

                        <Button
                            className="mt-2"
                            variant="secondary"
                            size={'md'}
                            onClick={() => handleAcceptPost(false)}
                        >
                            Từ chối
                        </Button>
                    </div>
                )}
            </div>
        );
    }
);

Post.displayName = 'Post';

export default Post;
