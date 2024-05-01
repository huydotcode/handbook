'use client';
import { useMutation } from '@tanstack/react-query';
import { Session } from 'next-auth';
import React from 'react';

import PostService from '@/lib/services/post.service';
import toast from 'react-hot-toast';
import Icons from '../ui/Icons';
import logger from '@/utils/logger';

interface Props {
    session: Session | null;
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ session, post }) => {
    const [loves, setLoves] = React.useState<string[]>(
        post.loves.map((l) => l._id)
    );

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

                await PostService.sendReaction({
                    postId: post._id,
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
        <div className="like-container mr-2 flex items-center">
            <div className="con-like">
                <input
                    className="like"
                    type="checkbox"
                    title="like"
                    checked={isReacted ? true : false}
                    onChange={() => mutation.mutate()}
                />
                <div className="checkmark">
                    <Icons.Heart />
                </div>
            </div>

            <span className="ml-1 mr-2 min-w-[10px] text-sm">
                {convertNumberToChar(loves.length)}
            </span>
        </div>
    );
};
export default ReactionPost;
