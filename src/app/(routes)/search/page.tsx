'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSearchKey } from '@/lib/queryKey';
import axiosInstance from '@/lib/axios';
import { Avatar, Loading } from '@/components/ui';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useFriends } from '@/context/SocialContext';
import AddFriendAction from '@/app/(routes)/profile/_components/AddFriendAction';
import { Post } from '@/components/post';

interface SearchData {
    users: IUser[];
    posts: IPost[];
    groups: IGroup[];
}

const SearchPage = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useQuery<SearchData>({
        queryKey: getSearchKey(q, type),
        queryFn: async () => {
            if (q == '') return;

            const res = await axiosInstance.get(
                `/search${type !== '' ? `/${type}` : ''}?q=${q}&page=${page}`
            );
            const data = res.data;

            return data;
        },
        enabled: !!q,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const { data: friends } = useFriends(session?.user.id);

    return (
        <div
            className={
                '= mx-auto mt-[64px] min-h-[calc(100vh-72px)] w-[800px] max-w-screen'
            }
        >
            <h1 className={'text-md'}>Kết quả tìm kiếm: {q}</h1>

            {isLoading && <Loading className={'mt-12'} overlay={false} />}

            <div className="mt-4 flex flex-col gap-2">
                {data?.users.map((user) => {
                    const isFriend = !!(
                        friends &&
                        friends.find((friend) => friend._id === user._id)
                    );

                    return (
                        <UserSearchItem
                            key={user._id}
                            data={user}
                            isFriend={isFriend}
                        />
                    );
                })}

                {data?.posts?.map((post) => (
                    <Post key={post._id} data={post} />
                ))}

                {data?.groups?.map((group) => (
                    <GroupSearchItem key={group._id} data={group} />
                ))}
            </div>
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
        <div
            className={
                'flex items-center rounded-xl bg-secondary-1 p-2 shadow-xl'
            }
        >
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar}
                width={48}
                height={48}
            />

            <div className={'flex flex-1 items-center justify-between'}>
                <div className={'ml-2 flex flex-col gap-2'}>
                    <Button variant={'text'} href={`/profile/${data._id}`}>
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
        <div
            className={
                'flex items-center rounded-xl bg-secondary-1 p-2 shadow-xl'
            }
        >
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar.url}
                width={48}
                height={48}
            />

            <div className={'flex flex-1 items-center justify-between'}>
                <div className={'ml-2 flex flex-col gap-2'}>
                    <Button variant={'text'} href={`/group/${data._id}`}>
                        {data.name}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
