'use client';
import VerifiedUser from '@/components/VerifiedUser';
import postAudience from '@/constants/postAudience.constant';
import { timeConvert3 } from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { ActionPost } from '.';
import { Avatar } from '../ui';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

interface Props {
    post: IPost;
}

const PostHeader = ({ post }: Props) => {
    const isGroupPost = useMemo(() => post?.type === 'group', [post]);

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

            <ActionPost post={post} />
        </div>
    );
};

export default PostHeader;
