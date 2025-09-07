'use client';
import { Post } from '@/components/post';
import { PostTypes, usePosts } from '@/components/post/InfinityPostComponent';
import { Loading } from '@/components/ui';
import { API_ROUTES } from '@/config/api';
import { useFriends } from '@/context/SocialContext';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SearchGroupItem from './SearchGroupItem';
import SearchUserItem from './SearchUserItem';

interface SearchData {
    users: IUser[];
    posts: IPost[];
    groups: IGroup[];
}

const PAGE_SIZE = 10;

const Search = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const [page, setPage] = useState<number>(1);
    const { ref: bottomRef, inView } = useInView({
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    });

    const { data, isLoading } = useQuery<SearchData>({
        queryKey: queryKey.search({ q, type }),
        queryFn: async () => {
            if (!q || !session?.user.id)
                return { users: [], posts: [], groups: [] };

            switch (type) {
                case 'users':
                    return axiosInstance
                        .get<SearchData>(API_ROUTES.SEARCH.USERS, {
                            params: { q, page, page_size: PAGE_SIZE },
                        })
                        .then((res) => res.data);
                case 'groups':
                    return axiosInstance
                        .get<SearchData>(API_ROUTES.SEARCH.GROUPS, {
                            params: { q, page, page_size: PAGE_SIZE },
                        })
                        .then((res) => res.data);
                default:
                    return axiosInstance
                        .get<SearchData>(API_ROUTES.SEARCH.INDEX, {
                            params: { q, page, page_size: PAGE_SIZE },
                        })
                        .then((res) => res.data);
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
        enabled: !!session?.user.id && !!q,
    });

    const { data: posts } = usePosts({
        type: PostTypes.SEARCH_POSTS,
        enabled: type === 'posts',
        search: q,
    });
    const { data: friends } = useFriends(session?.user.id);

    const userFriendStatus = useMemo(() => {
        if (!data?.users || !friends) return {};
        return data.users.reduce(
            (acc, user) => {
                acc[user._id] = friends.some(
                    (friend) => friend._id === user._id
                );
                return acc;
            },
            {} as Record<string, boolean>
        );
    }, [data?.users, friends]);

    useEffect(() => {
        if (inView) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView]);

    return (
        <div>
            <h1 className="text-md">
                Kết quả tìm kiếm:{' '}
                {q ? `"${q}"` : 'Vui lòng nhập từ khóa tìm kiếm'}
            </h1>

            {isLoading && (
                <div className="mt-4 flex justify-center">
                    <Loading className="text-2xl" />
                </div>
            )}

            {!isLoading &&
                type === 'all' &&
                data?.users?.length === 0 &&
                data?.posts?.length === 0 &&
                data?.groups?.length === 0 && (
                    <p className="dark:text-dark-gray-500 mt-4 text-center text-sm text-gray-500">
                        Không tìm thấy kết quả phù hợp
                    </p>
                )}

            {!isLoading && type === 'users' && data?.users?.length === 0 && (
                <p className="dark:text-dark-gray-500 mt-4 text-center text-sm text-gray-500">
                    Không tìm thấy người dùng phù hợp
                </p>
            )}

            {!isLoading && type === 'groups' && data?.groups?.length === 0 && (
                <p className="dark:text-dark-gray-500 mt-4 text-center text-sm text-gray-500">
                    Không tìm thấy nhóm phù hợp
                </p>
            )}

            {!isLoading &&
                type === 'posts' &&
                (!posts || posts.length === 0) && (
                    <p className="dark:text-dark-gray-500 mt-4 text-center text-sm text-gray-500">
                        Không tìm thấy bài viết phù hợp
                    </p>
                )}

            {!isLoading && (
                <>
                    <div className="mt-4 space-y-4">
                        {(type === 'all' || type === 'users') &&
                            data?.users &&
                            data?.users?.length > 0 &&
                            data.users.map((user) => (
                                <SearchUserItem
                                    key={user._id}
                                    data={user}
                                    isFriend={
                                        userFriendStatus[user._id] || false
                                    }
                                />
                            ))}

                        {(type === 'all' || type === 'groups') &&
                            data?.groups &&
                            data.groups?.length > 0 &&
                            data.groups.map((group) => (
                                <SearchGroupItem key={group._id} data={group} />
                            ))}

                        {(type === 'all' || type === 'posts') &&
                            posts &&
                            posts.length > 0 &&
                            posts.map((post) => (
                                <Post
                                    key={post._id}
                                    data={post}
                                    isManage={false}
                                    params={{
                                        type: PostTypes.SEARCH_POSTS,
                                    }}
                                />
                            ))}
                    </div>
                </>
            )}

            <div ref={bottomRef} />
        </div>
    );
};

export default Search;
