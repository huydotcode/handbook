'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ActionPost, FooterPost, PostContent } from '.';
import { Avatar } from '../ui';

interface Props {
    data: IPost;
}

const Post: React.FC<Props> = ({ data: post }) => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const showInPrivate =
        post.option === 'private' &&
        pathname !== `/profile/${post.author._id}` &&
        session?.user?.id !== post.author._id;

    if (showInPrivate) return null;

    return (
        <div className="relative mb-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1">
            {/* <HeaderPost /> */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {post.group ? (
                        <div className="relative">
                            <Avatar
                                imgSrc={post.group.avatar}
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
                        <div className="flex items-center">
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

                        <div className="-mt-1">
                            {post.group && (
                                <Link
                                    href={`/profile/${post.author._id}`}
                                    className="mr-2 text-xs text-secondary-1 hover:underline dark:text-dark-primary-1"
                                >
                                    {post.author.name}
                                </Link>
                            )}

                            {/*<TimeAgoConverted*/}
                            {/*    className="w-full text-xs text-secondary-1"*/}
                            {/*    time={post.createdAt}*/}
                            {/*/>*/}
                        </div>
                    </div>

                    {/* Group */}
                </div>

                {session?.user && session.user.id === post.author._id && (
                    <ActionPost post={post} />
                )}
            </div>

            <PostContent post={post} />
            <FooterPost post={post} />
        </div>
    );
};

export default Post;
