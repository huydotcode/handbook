'use client';
import { Items } from '@/components/shared';
import { Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { fetchUsers } from '@/lib/actions/admin/user.action';
import queryKey from '@/lib/queryKey';
import { FormatDate } from '@/utils/formatDate';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
    const {
        data: users,
        isLoading,
        isFetching,
    } = useQuery<IUser[]>({
        queryKey: queryKey.admin.users.index,
        queryFn: async () => {
            const users = await fetchUsers({
                limit: 100, // You can adjust the limit as needed
            });

            return users;
        },
        initialData: [],
    });

    const router = useRouter();

    return (
        <div className="mt-4">
            <h1 className="mb-4 text-2xl font-bold">Quản lý người dùng</h1>

            {isLoading ||
                (isFetching && (
                    <div className="flex h-64 items-center justify-center">
                        <Loading fullScreen />
                    </div>
                ))}

            {!isLoading && !isFetching && users && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Lần truy cập gần nhất</TableHead>
                            <TableHead>Quyền</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user._id}
                                onClick={() => {
                                    toast.error(
                                        'Chức năng này chưa được triển khai'
                                    );
                                }}
                            >
                                <TableCell>{user._id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {FormatDate.formatISODateToDate(
                                        user.createdAt
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.lastAccessed
                                        ? FormatDate.formatISODateToDateTime(
                                              user.lastAccessed
                                          )
                                        : 'Chưa truy cập'}
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default AdminUsersPage;
