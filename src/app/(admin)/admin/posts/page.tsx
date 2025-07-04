'use client';
import { Icons, Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchAllPosts } from '@/lib/actions/admin/post.action';
import queryKey from '@/lib/queryKey';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AdminPostsPage = () => {
    const {
        data: posts,
        isLoading,
        isFetching,
    } = useQuery<IPost[]>({
        queryKey: queryKey.admin.posts.index,
        queryFn: async () => {
            const posts = await fetchAllPosts();

            return posts;
        },
        initialData: [],
    });

    return (
        <div className="mt-4">
            <h1 className="mb-4 text-2xl font-bold">Quản lý bài viết</h1>

            {(isLoading || isFetching) && (
                <div className="flex h-64 items-center justify-center">
                    <Loading fullScreen />
                </div>
            )}

            {!isLoading && !isFetching && posts && posts.length === 0 && (
                <div className="flex h-64 items-center justify-center">
                    <h1>Không có bài viết nào được tìm thấy</h1>
                </div>
            )}

            {!isLoading && !isFetching && posts && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã bài viết</TableHead>
                            <TableHead>Tuỳ chọn</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Nhóm</TableHead>

                            <TableHead>Nội dung</TableHead>
                            <TableHead>Tương tác</TableHead>
                            <TableHead>Ngày đăng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post._id}>
                                <TableCell>{post._id}</TableCell>
                                <TableCell>{post.option}</TableCell>
                                <TableCell>{post.author.name}</TableCell>
                                <TableCell>
                                    {post.group ? post.group.name : 'Không có'}
                                </TableCell>
                                <TableCell>{post.text}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-sm">
                                            <Icons.Heart2 /> {post.lovesCount}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm">
                                            <Icons.Share /> {post.sharesCount}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm">
                                            <Icons.Comment />
                                            {post.commentsCount}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })}
                                </TableCell>
                                <TableCell>
                                    {post.status === 'active'
                                        ? 'Đã duyệt'
                                        : post.status === 'pending'
                                          ? 'Đang chờ duyệt'
                                          : 'Đã từ chối'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        variant={'outline'}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        href={`/posts/${post._id}`}
                                                    >
                                                        <Icons.Detail />
                                                    </Button>
                                                </TooltipTrigger>

                                                <TooltipContent>
                                                    Xem chi tiết
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default AdminPostsPage;
