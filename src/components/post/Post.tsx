'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ActionPost, FooterPost, PostContent } from '.';
import { Avatar } from '../ui';
import { timeConvert } from '@/utils/timeConvert';
import { Button } from '@/components/ui/Button';
import { updateStatusPost } from '@/lib/actions/post.action';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getNewFeedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';

interface Props {
    data: IPost;
    isManage?: boolean;
}

const Post: React.FC<Props> = ({ data: post, isManage = false }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const showInPrivate =
        post.option === 'private' &&
        pathname !== `/profile/${post.author._id}` &&
        session?.user?.id !== post.author._id;

    const handleAcceptPost = async (accept: boolean) => {
        try {
            await updateStatusPost({
                postId: post._id,
                status: accept ? 'active' : 'rejected',
                path: pathname,
            });

            await queryClient.invalidateQueries({
                queryKey: getNewFeedPostsKey(
                    'group',
                    undefined,
                    post.group?._id,
                    undefined,
                    true
                ),
            });

            if (accept) {
                await queryClient.invalidateQueries({
                    queryKey: getNewFeedPostsKey(
                        'group',
                        undefined,
                        post.group?._id,
                        undefined,
                        false
                    ),
                });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    if (showInPrivate) return null;

    return (
        <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
            {/* <HeaderPost /> */}
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

                            {/* Avatar user */}
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
                            {post.group ? (
                                <Link
                                    href={`/groups/${post.group._id}`}
                                    className="text-base hover:underline dark:text-dark-primary-1"
                                >
                                    {post.group.name}
                                </Link>
                            ) : (
                                <Link
                                    href={`/profile/${post.author._id}`}
                                    className="text-base hover:underline dark:text-dark-primary-1"
                                >
                                    {post.author.name}
                                </Link>
                            )}
                        </div>

                        <div
                            className={cn('', {
                                'mt-1 flex items-center': post.type === 'group',
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

                            <p className="w-full text-xs text-secondary-1">
                                {timeConvert(post.createdAt.toString())}
                            </p>
                        </div>
                    </div>

                    {/* Group */}
                </div>

                {session?.user && session.user.id === post.author._id && (
                    <ActionPost post={post} />
                )}
            </div>

            <PostContent post={post} />
            {!isManage && <FooterPost post={post} />}

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
};

export default Post;
