'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { usePreventMultiClick } from '@/hooks/usePreventMultiClick';
import queryKey from '@/lib/queryKey';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
    post: IPost;
}

const SavePost: React.FC<Props> = ({ post }) => {
    const { handleClick, canClick } = usePreventMultiClick({
        message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau 5s!',
        maxCount: 1,
    });
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const pathName = usePathname();
    const isSaved = post.userHasSaved;

    const { mutate, isPending } = useMutation({
        mutationFn: handleSave,
        mutationKey: ['savePost', post._id],
    });

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

            await queryClient.setQueryData(
                queryKey.posts.id(post._id),
                (oldPost: IPost | undefined) => {
                    if (!oldPost) return;

                    return {
                        ...oldPost,
                        userHasSaved: !isSaved,
                    };
                }
            );
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
            <Icons.Bookmark />
            <span className="text-sm">
                {isPending && isSaved
                    ? 'Đang hủy lưu...'
                    : isPending && !isSaved
                      ? 'Đang lưu...'
                      : isSaved
                        ? 'Đã lưu'
                        : 'Lưu'}
            </span>
        </Button>
    );
};

export default SavePost;
