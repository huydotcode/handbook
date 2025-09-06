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
import { usePostContext } from '../Post';
import { InfinityPostData } from '../InfinityPostComponent';

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

    const { postParams } = usePostContext();

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

            await queryClient.setQueryData<InfinityPostData>(
                queryKey.posts.newFeed({
                    groupId: postParams.groupId,
                    type: postParams.type,
                    userId: postParams.userId,
                    username: postParams.username,
                }),
                (oldData) => {
                    if (!oldData) return;

                    const updatedPages = oldData.pages.map((page) =>
                        page.map((oldPost) => {
                            if (oldPost._id !== post._id) return oldPost;
                            return {
                                ...oldPost,
                                userHasSaved: !isSaved,
                            };
                        })
                    );
                    return {
                        ...oldData,
                        pages: updatedPages,
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
            className={cn('w-full justify-start rounded-sm shadow-none', {
                'text-yellow-300 hover:text-yellow-200': isSaved && !isPending,
            })}
            variant={'ghost'}
            onClick={() => mutate()}
        >
            <Icons.Bookmark className="mr-2" />{' '}
            {isPending && isSaved
                ? 'Đang hủy lưu...'
                : isPending && !isSaved
                  ? 'Đang lưu...'
                  : isSaved
                    ? 'Đã lưu'
                    : 'Lưu'}
        </Button>
    );
};

export default SavePost;
