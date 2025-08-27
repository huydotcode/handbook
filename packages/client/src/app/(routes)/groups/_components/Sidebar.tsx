'use client';
import SidebarCollapse from '@/components/layout/SidebarCollapse';
import { Items } from '@/components/shared';
import { Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import queryKey from '@/lib/queryKey';
import GroupService from '@/lib/services/group.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

interface Props {}

const PAGE_SIZE = 10;

export const useGroups = (userId: string | undefined) =>
    useInfiniteQuery({
        queryKey: queryKey.user.groups(userId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];

            const groups = await GroupService.getByUserId({
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
        <>
            <SidebarCollapse>
                <h1 className="text-2xl font-bold">Nhóm</h1>

                <Button
                    className="my-2 w-full"
                    variant={'primary'}
                    href="/groups/create"
                    size={'sm'}
                >
                    Tạo nhóm mới
                </Button>

                <div>
                    <h5 className="font-semibold">Nhóm của bạn</h5>

                    {isLoading && <Loading text={'Đang tải nhóm của bạn'} />}

                    {groups &&
                        groups.length > 0 &&
                        groups.map((group) => (
                            <Items.Group data={group} key={group._id} />
                        ))}
                </div>
            </SidebarCollapse>
        </>
    );
};
export default Sidebar;
