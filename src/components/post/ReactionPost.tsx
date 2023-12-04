'use client';
import { sendReaction } from '@/lib/actions/post.action';
import { useMutation } from '@tanstack/react-query';
import { Session } from 'next-auth';
import React from 'react';

import toast from 'react-hot-toast';

interface Props {
    session: Session | null;
    post: Post;
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="outline"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="filled"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="100"
                        width="100"
                        className="celebrate"
                    >
                        <polygon
                            className="poly"
                            points="10,10 20,20"
                        ></polygon>
                        <polygon
                            className="poly"
                            points="10,50 20,50"
                        ></polygon>
                        <polygon
                            className="poly"
                            points="20,80 30,70"
                        ></polygon>
                        <polygon
                            className="poly"
                            points="90,10 80,20"
                        ></polygon>
                        <polygon
                            className="poly"
                            points="90,50 80,50"
                        ></polygon>
                        <polygon
                            className="poly"
                            points="80,80 70,70"
                        ></polygon>
                    </svg>
                </div>
            </div>

            <span className="ml-1 mr-2 text-md">{loves.length}</span>
        </>
    );
};
export default ReactionPost;
