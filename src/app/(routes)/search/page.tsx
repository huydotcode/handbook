'use client';

import { useSearchParams } from 'next/navigation';
import {
    InfiniteData,
    useInfiniteQuery,
    useQuery,
} from '@tanstack/react-query';
import { getSearchKey } from '@/lib/queryKey';
import axiosInstance from '@/lib/axios';
import { Avatar, Loading } from '@/components/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useFriends } from '@/context/SocialContext';
import AddFriendAction from '@/app/(routes)/profile/_components/AddFriendAction';
import { Post } from '@/components/post';
import { API_ROUTES } from '@/config/api';

interface SearchData {
    users: IUser[];
    posts: IPost[];
    groups: IGroup[];
}

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE = 300; // ms

const SearchPage = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const [page, setPage] = useState<number>(1);

    const searchEndpoint = useMemo(() => {
        if (!q) return '';
        return API_ROUTES.MESSAGES.SEARCH_QUERY({
            type,
            q,
            page,
            pageSize: PAGE_SIZE,
        });
    }, [q, type, page]);

    const { data, isLoading } = useQuery<SearchData>({
        queryKey: getSearchKey(q, type),
        queryFn: async () => {
            if (!searchEndpoint) return { users: [], posts: [], groups: [] };

            const { data } = await axiosInstance.get(searchEndpoint);

            return data;
        },
        enabled: !!q,
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

    const renderSearchResults = useCallback(() => {
        if (isLoading) {
            return <Loading className={'mt-12'} overlay={false} />;
        }

        if (
            !data ||
            (!data.users.length && !data.posts.length && !data.groups.length)
        ) {
            return (
                <div className="mt-4 text-center text-gray-500">
                    Không tìm thấy kết quả nào
                </div>
            );
        }

        return (
            <div className="mt-4 flex flex-col gap-2">
                {data.users.map((user) => (
                    <UserSearchItem
                        key={user._id}
                        data={user}
                        isFriend={userFriendStatus[user._id] || false}
                    />
                ))}

                {data.posts?.map((post) => <Post key={post._id} data={post} />)}

                {data.groups?.map((group) => (
                    <GroupSearchItem key={group._id} data={group} />
                ))}
            </div>
        );
    }, [data, isLoading, userFriendStatus]);

    return (
        <div className="mx-auto mt-[64px] min-h-[calc(100vh-72px)] w-[800px] max-w-screen">
            <h1 className="text-md">
                Kết quả tìm kiếm:{' '}
                {q ? `"${q}"` : 'Vui lòng nhập từ khóa tìm kiếm'}
            </h1>
            {renderSearchResults()}
        </div>
    );
};

const UserSearchItem = ({
    data,
    isFriend,
}: {
    data: IUser;
    isFriend: boolean;
}) => {
    return (
        <div className="flex items-center rounded-xl bg-secondary-1 p-2 shadow-xl">
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar}
                width={48}
                height={48}
            />

            <div className="flex flex-1 items-center justify-between">
                <div className="ml-2 flex flex-col gap-2">
                    <Button variant="text" href={`/profile/${data._id}`}>
                        {data.name}
                    </Button>
                </div>

                <div>{!isFriend && <AddFriendAction userId={data._id} />}</div>
            </div>
        </div>
    );
};

const GroupSearchItem = ({ data }: { data: IGroup }) => {
    return (
        <div className="flex items-center rounded-xl bg-secondary-1 p-2 shadow-xl">
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar.url}
                width={48}
                height={48}
            />

            <div className="flex flex-1 items-center justify-between">
                <div className="ml-2 flex flex-col gap-2">
                    <Button variant="text" href={`/group/${data._id}`}>
                        {data.name}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
