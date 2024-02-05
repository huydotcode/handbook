'use client';
import { sendReaction } from '@/lib/actions/post.action';
import { useMutation } from '@tanstack/react-query';
import { Session } from 'next-auth';
import React from 'react';

import toast from 'react-hot-toast';
import Icons from '../ui/Icons';

interface Props {
    session: Session | null;
    post: IPost;
}

const ReactionPost: React.FC<Props> = ({ session, post }) => {
    const [loves, setLoves] = React.useState<string[]>(post.loves);

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
                    userId: session?.user.id,
                });
            } catch (error: any) {
                console.log('Error: ', error);
                throw new Error(error);
            }
        },
        onError: () => {
            toast.error('Đã có lỗi xảy ra!');
        },
    });

    return (
        <>
            <div className="con-like">
                <input
                    className="like"
                    type="checkbox"
                    title="like"
                    checked={isReacted ? true : false}
                    onChange={() => mutation.mutate()}
                />
                <div className="checkmark">
                    <Icons.Heart className="text-red-500" />
                </div>
            </div>

            <span className="text-md ml-1 mr-2">{loves.length}</span>
        </>
    );
};
export default ReactionPost;
