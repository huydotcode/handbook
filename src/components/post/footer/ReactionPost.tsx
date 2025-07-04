'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import queryKey from '@/lib/queryKey';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { socketEmitor } = useSocket();
    const { invalidatePost } = useQueryInvalidation();

    const isReacted = post.userHasLoved;

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session?.user) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này!');
                return;
            }

            try {
                await queryClient.setQueryData<IPost>(
                    queryKey.posts.id(post._id),
                    (oldPost) => {
                        if (!oldPost) return oldPost;

                        const updatedPost = {
                            ...oldPost,
                            lovesCount: isReacted
                                ? oldPost.lovesCount - 1
                                : oldPost.lovesCount + 1,
                            userHasLoved: !isReacted,
                        };

                        console.log('SET DATA POST', updatedPost);

                        return updatedPost;
                    }
                );

                await PostService.sendReaction(post._id);

                if (!isReacted) {
                    socketEmitor.likePost({
                        postId: post._id,
                        authorId: post.author._id,
                    });
                }

                // await invalidatePost(post._id);
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
