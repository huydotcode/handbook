'use client';
import { Items } from '@/components/shared';
import { Icons, Loading } from '@/components/ui';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-menu';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getGroupsByUserId } from '@/lib/actions/group.action';
import { useSession } from 'next-auth/react';

interface Props {}

const PAGE_SIZE = 10;

export const useGroups = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: ['groups', userId],
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const groups = await getGroupsByUserId({
                userId,
                page: pageParam,
                pageSize: PAGE_SIZE,
            });
            return groups;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined;
        },
        select: (data) => data.pages.flatMap((page) => page) as IGroup[],
        initialPageParam: 1,
    });

const Sidebar: React.FC<Props> = () => {
    const { data: session } = useSession();
    const { data: groups, isLoading } = useGroups(session?.user.id);

    return (
        <aside className="no-scrollbar fixed left-0 top-[56px] z-10 h-full w-[360px] max-w-[360px] overflow-scroll border-r-2 bg-white p-2 dark:border-none dark:bg-dark-secondary-1 lg:max-w-[80px]">
            <div className="px-4 py-2 lg:px-1">
                <h1 className="text-2xl font-bold lg:hidden">Nhóm</h1>

                <Button
                    className="my-2 w-full lg:hidden"
                    variant={'primary'}
                    href="/groups/create"
                    size={'sm'}
                >
                    Tạo nhóm mới
                </Button>

                <Button
                    className="my-2 hidden w-full lg:flex"
                    variant={'primary'}
                    href="/groups/create"
                    size={'sm'}
                >
                    <Icons.Plus className="text-xl" />
                </Button>

                <div>
                    <h5 className="font-semibold lg:hidden">Nhóm của bạn</h5>

                    {isLoading && <Loading text={'Đang tải nhóm của bạn'} />}

                    {groups &&
                        groups.length > 0 &&
                        groups.map((group) => (
                            <Items.Group data={group} key={group._id} />
                        ))}
                </div>
            </div>
        </aside>
    );
};
export default Sidebar;
