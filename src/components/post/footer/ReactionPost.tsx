'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import queryKey from '@/lib/queryKey';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';
import { InfinityPostData } from '../InfinityPostComponent';
import { usePostContext } from '../Post';

interface Props {
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { socketEmitor } = useSocket();
    const { postParams } = usePostContext();

    const isReacted = post.userHasLoved;

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session?.user) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này!');
                return;
            }

            try {
                await queryClient.setQueryData<InfinityPostData>(
                    queryKey.posts.newFeed({
                        groupId: postParams.groupId,
                        type: postParams.type,
                        userId: postParams.userId,
                        username: postParams.username,
                    }),
                    (oldData) => {
                        if (!oldData) return oldData;
                        const updatedPages = oldData.pages.map((page) =>
                            page.map((oldPost) => {
                                if (oldPost._id !== post._id) return oldPost;
                                return {
                                    ...oldPost,
                                    lovesCount: isReacted
                                        ? oldPost.lovesCount - 1
                                        : oldPost.lovesCount + 1,
                                    userHasLoved: !isReacted,
                                };
                            })
                        );
                        return {
                            ...oldData,
                            pages: updatedPages,
                        };
                    }
                );

                await PostService.sendReaction(post._id);

                // Kiểm tra nếu người dùng không phải là tác giả bài viết và tương tác bài viết
                if (!isReacted && session.user.id !== post.author._id) {
                    socketEmitor.likePost({
                        postId: post._id,
                        authorId: post.author._id,
                    });
                }
            } catch (error: any) {
                logger({
                    message: 'Error reaction post' + error,
                    type: 'error',
                });
            }
        },
        onError: () => {
            toast.error('Không thể thực hiện chức năng này!');
        },
    });

    return (
        <Button
            className="like-container mr-2 flex flex-1 items-center md:p-1"
            variant={'ghost'}
            onClick={() => mutation.mutate()}
        >
            <div className="con-like">
                <input
                    className="like"
                    type="checkbox"
                    title="like"
                    checked={isReacted ? true : false}
                    onChange={() => {}}
                />
                <div className="checkmark flex">
                    <Icons.Heart />
                </div>
            </div>

            <span
                className={cn('ml-1 mr-2 min-w-[10px] text-sm sm:hidden', {
                    'text-red-500': isReacted,
                })}
            >
                Yêu thích
            </span>
        </Button>
    );
};

export default ReactionPost;
