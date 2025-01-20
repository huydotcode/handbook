'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { sendReaction } from '@/lib/actions/post.action';
import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Icons from '../ui/Icons';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { getPostKey } from '@/lib/queryKey';

interface Props {
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const [loves, setLoves] = useState<string[]>(post.loves.map((l) => l._id));
    const queryClient = useQueryClient();

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

                await sendReaction({
                    postId: post._id,
                });

                queryClient.invalidateQueries({
                    queryKey: getPostKey(post._id),
                });
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

    const convertNumberToChar = (number: number) => {
        if (number >= 1000000000) {
            return `${(number / 1000000000).toFixed(1)}b`;
        }

        // Nếu lớn hơn 1 triệu
        if (number >= 1000000) {
            return `${(number / 1000000).toFixed(1)}m`;
        }

        // Nếu lớn hơn 1000
        if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}k`;
        }

        return number;
    };

    return (
        <Button
            className="like-container mr-2 flex flex-1 items-center"
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
                className={cn('ml-1 mr-2 min-w-[10px] text-sm', {
                    'text-red-500': isReacted,
                })}
            >
                Yêu thích
            </span>
        </Button>
    );
};
export default ReactionPost;
