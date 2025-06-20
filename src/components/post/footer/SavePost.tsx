'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { API_ROUTES } from '@/config/api';
import { usePreventMultiClick } from '@/hooks/usePreventMultiClick';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

interface Props {
    post: IPost;
}

export const useSavedPosts = (userId: string | undefined) =>
    useQuery<ISavedPost>({
        queryKey: queryKey.posts.saved(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await axiosInstance.get(API_ROUTES.SAVED_POSTS.INDEX, {
                params: { user_id: userId },
            });

            return res.data;
        },
        enabled: !!userId,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

const SavePost: React.FC<Props> = ({ post }) => {
    const { countClick, handleClick, canClick } = usePreventMultiClick({
        message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau 5s!',
        maxCount: 1,
    });
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const { invalidateSavedPosts, invalidatePost } = useQueryInvalidation();

    const pathName = usePathname();
    const { data: savedPosts, isLoading } = useSavedPosts(session?.user.id);
    const isSaved = savedPosts?.posts.find((p) => p._id === post._id);
    const isSavedPage = useMemo(() => {
        return pathName.includes('/saved');
    }, [pathName]);

    const { mutate, isPending } = useMutation({
        mutationFn: handleSave,
        mutationKey: ['savePost', post._id],
        onSuccess: async () => {
            if (!session?.user.id) return;
            await invalidateSavedPosts(session?.user.id);
            await invalidatePost(post._id);
        },
    });
    const isLoadingSavePost = isLoading || isPending;

    async function handleSave() {
        handleClick();

        if (!canClick) return;
        if (!session?.user) return;

        try {
            if (isSaved) {
                await PostService.unsavePost({
                    postId: post._id,
                    path: pathName,
                });
            } else {
                await PostService.savePost({
                    postId: post._id,
                    path: pathName,
                });
            }
        } catch (error) {
            toast.error('Không thể lưu bài viết!', {
                position: 'bottom-left',
            });
        }
    }

    return (
        <Button
            onClick={() => mutate()}
            className={cn('flex flex-1 items-center gap-2 p-1', {
                'text-yellow-300 hover:text-yellow-200': isSaved && !isPending,
            })}
            disabled={isPending}
            variant={'ghost'}
        >
            {isLoadingSavePost ? <Icons.Loading /> : <Icons.Bookmark />}
            <span className="sm:hidden">
                {isLoadingSavePost && isSaved
                    ? 'Đang hủy'
                    : isLoadingSavePost && !isSaved
                      ? 'Đang lưu'
                      : 'Lưu'}
            </span>
        </Button>
    );
};

export default SavePost;
