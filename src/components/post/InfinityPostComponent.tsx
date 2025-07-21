'use client';
import { Button } from '@/components/ui/Button';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { Post, SkeletonPost } from '.';
import { Icons, Modal } from '../ui';
import Image from '../ui/image';
import CreatePostV2 from './CreatePostV2';

export type PostType =
    | 'new-feed'
    | 'profile'
    | 'group'
    | 'new-feed-group'
    | 'new-feed-friend'
    | 'manage-group-posts'
    | 'manage-group-posts-pending'
    | 'post-by-member'
    | 'search-posts'
    | 'saved';

export type PostParams = {
    userId?: string;
    groupId?: string;
    username?: string;
    type?: PostType;
};

export type InfinityPostData = {
    pages: IPost[][];
    pageParams: number[];
};

export const PostTypes = {
    NEW_FEED: 'new-feed' as PostType,
    PROFILE: 'profile' as PostType,
    GROUP: 'group' as PostType,
    NEW_FEED_GROUP: 'new-feed-group' as PostType,
    NEW_FEED_FRIEND: 'new-feed-friend' as PostType,
    MANAGE_GROUP_POSTS: 'manage-group-posts' as PostType,
    MANAGE_GROUP_POSTS_PENDING: 'manage-group-posts-pending' as PostType,
    POST_BY_MEMBER: 'post-by-member' as PostType,
    SEARCH_POSTS: 'search-posts' as PostType,
};

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: PostType;
    title?: string;
    showCreatePost?: boolean;
    enabled?: boolean;
    search?: string;
}

const PAGE_SIZE = 3;
const REFETCH_INTERVAL = 1000 * 60 * 5; // 5 minutes

const ENDPOINTS: Record<PostType, string> = {
    'new-feed': '/posts/new-feed',
    'new-feed-group': '/posts/new-feed-group',
    'new-feed-friend': '/posts/new-feed-friend',
    profile: '/posts/profile',
    group: '/posts/group',
    'manage-group-posts': '/posts/group/manage',
    'post-by-member': '/posts/group/member',
    'manage-group-posts-pending': '/posts/group/manage/pending',
    saved: '/posts/saved',
    'search-posts': '/search/posts',
};

export const usePosts = ({
    userId,
    groupId,
    username,
    type = 'new-feed',
    search = '',
    enabled = true,
}: Pick<
    Props,
    'userId' | 'groupId' | 'username' | 'type' | 'enabled' | 'search'
>) => {
    const { data: session } = useSession();

    const isFeedType = useMemo(
        () => ['new-feed', 'new-feed-friend', 'new-feed-group'].includes(type),
        [type]
    );

    const getEndpoint = useCallback(
        (type: PostType) => {
            const baseEndpoint = ENDPOINTS[type];
            if (type === 'profile') return `${baseEndpoint}/${userId}`;
            if (
                type === 'group' ||
                type === 'manage-group-posts' ||
                type === 'manage-group-posts-pending'
            )
                return `${baseEndpoint}/${groupId}`;
            return baseEndpoint;
        },
        [userId, groupId]
    );

    const fetchPosts = useCallback(
        async (pageParam: number) => {
            if (!session?.user.id) return [];

            const endpoint = getEndpoint(type);
            const params = {
                page: pageParam,
                page_size: PAGE_SIZE,
                ...(isFeedType && { user_id: session.user.id }),
                ...(type === 'post-by-member' && {
                    user_id: userId,
                    group_id: groupId,
                }),
                ...(type === 'search-posts' && { q: search }),
            };

            const { data } = await axiosInstance.get<IPost[]>(endpoint, {
                params,
            });
            return data;
        },
        [
            session?.user.id,
            getEndpoint,
            type,
            isFeedType,
            userId,
            groupId,
            search,
        ]
    );

    return useInfiniteQuery({
        queryKey: queryKey.posts.newFeed({
            groupId,
            type,
            userId,
            username,
        }),
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        select: (data) => data.pages.flat(),
        initialPageParam: 1,
        refetchInterval: REFETCH_INTERVAL,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: !!session && !!session.user.id && enabled,
    });
};

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'new-feed',
    title,
    showCreatePost = true,
}) => {
    const { data: session } = useSession();
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = usePosts({ userId, groupId, username, type });
    const params = {
        userId,
        groupId,
        username,
        type,
    };

    const { ref: bottomRef, inView } = useInView({ threshold: 0 });
    const currentUser = session?.user;

    const isManage = type === 'manage-group-posts-pending';
    const isCurrentUser = useMemo(
        () => currentUser?.id === userId || currentUser?.username === username,
        [currentUser?.id, currentUser?.username, userId, username]
    );

    const [showModalCreatePost, setShowModalCreatePost] = useState(false);

    const handleClose = useCallback(() => setShowModalCreatePost(false), []);
    const handleShow = useCallback(() => setShowModalCreatePost(true), []);

    const shouldShowCreatePost = useMemo(
        () =>
            showCreatePost &&
            !isManage &&
            ((type === 'new-feed' && currentUser) ||
                (type === 'profile' && isCurrentUser) ||
                (type === 'group' && currentUser && groupId)),
        [showCreatePost, isManage, type, currentUser, isCurrentUser, groupId]
    );

    const handleFetchNextPage = useCallback(async () => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            try {
                await fetchNextPage();
            } catch (error) {
                toast.error('Có lỗi xảy ra khi tải bài viết');
            }
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        handleFetchNextPage();
    }, [handleFetchNextPage]);

    const renderLoader = useCallback(() => {
        if (isLoading || isFetchingNextPage) {
            return (
                <div>
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                </div>
            );
        }

        if (isFetching) {
            return (
                <div className="flex justify-center py-10">
                    <Icons.Loading className="text-4xl" />
                </div>
            );
        }

        return null;
    }, [isLoading, isFetching, isFetchingNextPage]);

    const renderCreatePost = useCallback(() => {
        if (!shouldShowCreatePost && !showModalCreatePost) return null;

        const user = session?.user;
        const isGroupPost = type === 'group' && groupId;

        return (
            <>
                <div className="mb-4 rounded-xl bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out dark:bg-dark-secondary-1">
                    <div className="flex items-center">
                        <Link
                            href={`/profile/${user?.id}`}
                            className="h-10 w-10"
                        >
                            {user && (
                                <Image
                                    src={user.image || ''}
                                    alt={user.name || ''}
                                    width={40}
                                    height={40}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            )}
                        </Link>
                        <div
                            className="ml-3 flex h-10 flex-1 cursor-text items-center rounded-xl bg-primary-1 px-3 dark:bg-dark-secondary-2"
                            onClick={handleShow}
                        >
                            <h5 className="text-secondary-1">
                                {type === 'group'
                                    ? 'Đăng bài lên nhóm này...'
                                    : 'Bạn đang nghĩ gì?'}
                            </h5>
                        </div>
                    </div>
                </div>

                <Modal
                    handleClose={handleClose}
                    show={showModalCreatePost}
                    title="Đăng bài viết"
                >
                    <CreatePostV2
                        onSubmitSuccess={handleClose}
                        {...(isGroupPost && { groupId, type: 'group' })}
                    />
                </Modal>
            </>
        );
    }, [
        shouldShowCreatePost,
        showModalCreatePost,
        session?.user,
        handleShow,
        type,
        groupId,
        handleClose,
    ]);

    return (
        <div className={cn(className, 'relative w-full')}>
            {/* Header section */}
            {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

            {/* Refresh button for management view */}
            {isManage && (
                <div className={'flex justify-center'}>
                    <Button
                        onClick={() => refetch()}
                        className="mb-2"
                        variant="secondary"
                        size={'sm'}
                    >
                        Tải mới
                    </Button>
                </div>
            )}

            {/* Post creation form */}
            {renderCreatePost()}

            {/* Posts list */}
            {data?.map((post) => {
                return (
                    <Post
                        data={post}
                        key={post._id}
                        isManage={isManage}
                        params={params}
                    />
                );
            })}

            {/* Infinite scroll trigger */}
            <div
                className={'absolute bottom-0 w-full bg-transparent p-2'}
                ref={bottomRef}
                aria-hidden="true"
            />

            {/* Loading states */}
            {renderLoader()}
        </div>
    );
};

export default React.memo(InfinityPostComponent);
