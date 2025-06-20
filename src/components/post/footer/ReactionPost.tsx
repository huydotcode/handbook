'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
    post: IPost;
    loves: string[];
    setLoves: React.Dispatch<React.SetStateAction<string[]>>;
}

const ReactionPost: React.FC<Props> = ({ post, loves, setLoves }) => {
    const { data: session } = useSession();

    const { socketEmitor } = useSocket();
    const { invalidatePost } = useQueryInvalidation();

    const isReacted = React.useMemo(
        () => loves.find((r) => r === session?.user.id),
        [loves, session?.user.id]
    );

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session?.user) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này!');
                return;
            }

            try {
                if (isReacted) {
                    setLoves((prev) =>
                        prev.filter((r) => r !== session?.user.id)
                    );
                } else {
                    setLoves((prev) => {
                        return [...prev, session?.user.id];
                    });
                }

                await PostService.sendReaction(post._id);

                if (!isReacted) {
                    socketEmitor.likePost({
                        postId: post._id,
                        authorId: post.author._id,
                    });
                }

                await invalidatePost(post._id);
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
