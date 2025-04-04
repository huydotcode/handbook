'use client';
import { useSavedPosts } from '@/components/post/FooterPost';
import { Button } from '@/components/ui/Button';
import axiosInstance from '@/lib/axios';
import { getNewFeedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { CreatePost, Post, SkeletonPost } from '.';
import { Icons } from '../ui';

export type PostType =
    | 'new-feed'
    | 'profile'
    | 'group'
    | 'new-feed-group'
    | 'new-feed-friend'
    | 'manage-group-posts';

interface Props {
    className?: string;
    userId?: string;
    username?: string;
    groupId?: string;
    type?: PostType;
    title?: string;
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
};

const usePosts = ({
    userId,
    groupId,
    username,
    type = 'new-feed',
}: Pick<Props, 'userId' | 'groupId' | 'username' | 'type'>) => {
    const { data: session } = useSession();

    const isFeedType = useMemo(
        () => ['new-feed', 'new-feed-friend', 'new-feed-group'].includes(type),
        [type]
    );

    const getEndpoint = useCallback(
        (type: PostType) => {
            const baseEndpoint = ENDPOINTS[type];
            if (type === 'profile') return `${baseEndpoint}/${userId}`;
            if (type === 'group' || type === 'manage-group-posts')
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
            };

            const { data } = await axiosInstance.get<IPost[]>(endpoint, {
                params,
            });
            return data;
        },
        [session?.user.id, type, isFeedType, getEndpoint]
    );

    return useInfiniteQuery({
        queryKey: getNewFeedPostsKey(type, userId, groupId, username),
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
        enabled: !!session,
    });
};

const InfinityPostComponent: React.FC<Props> = ({
    className,
    userId,
    groupId,
    username,
    type = 'new-feed',
    title,
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
    const { data: savedPosts } = useSavedPosts(session?.user.id);

    const { ref: bottomRef, inView } = useInView({ threshold: 0 });
    const currentUser = session?.user;

    const isManage = type === 'manage-group-posts';
    const isCurrentUser = useMemo(
        () => currentUser?.id === userId || currentUser?.username === username,
        [currentUser?.id, currentUser?.username, userId, username]
    );

    const shouldShowCreatePost = useMemo(
        () =>
            !isManage &&
            ((type === 'new-feed' && currentUser) ||
                (type === 'profile' && isCurrentUser) ||
                (type === 'group' && currentUser && groupId)),
        [isManage, type, currentUser, isCurrentUser, groupId]
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
        if (!shouldShowCreatePost) return null;

        return type === 'group' ? (
            <CreatePost groupId={groupId!} type="group" />
        ) : (
            <CreatePost />
        );
    }, [shouldShowCreatePost, type, groupId]);

    return (
        <div className={cn(className, 'relative w-full')}>
            {/* Header section */}
            {title && <h5 className="mb-2 text-xl font-bold">{title}</h5>}

            {/* Refresh button for management view */}
            {isManage && (
                <Button
                    onClick={() => refetch()}
                    className="mb-2"
                    variant="primary"
                    size={'sm'}
                >
                    Tải mới
                </Button>
            )}

            {/* Post creation form */}
            {renderCreatePost()}

            {/* Posts list */}
            {data?.map((post) => {
                const isSaved = savedPosts?.posts?.some(
                    (p) => p._id === post._id
                );

                return (
                    <Post
                        data={post}
                        key={post._id}
                        isManage={isManage}
                        isSaved={!!isSaved}
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
