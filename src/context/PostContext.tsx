'use client';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const PostContext = React.createContext<IPostContext | null>(null);

interface Props {
    post: Post;
    children: React.ReactNode;
}

function PostProvider({ post, children }: Props) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [countComments, setCountComments] = useState<number>(
        post.commentCount
    );
    const user = post.creator as User;
    const [isDelete, setIsDelete] = useState<boolean>(false);

    const sendComment = async ({
        valueInput,
        replyTo = null,
        setIsSending,
        setValueInput,
    }: {
        valueInput: string;
        replyTo: string | null;
        setIsSending: any;
        setValueInput: any;
    }) => {
        setIsSending(true);

        try {
            if (valueInput.replaceAll('<p><br></p>', '').trim().length === 0) {
                toast.error('Vui lòng nhập trước khi gửi!');
                return;
            }

            const res = await fetch(`/api/posts/${post._id}/comments/new`, {
                method: 'POST',
                body: JSON.stringify({
                    content: valueInput.replace(/\n/g, '<br/>'),
                    userId: session?.user.id,
                    replyTo: replyTo,
                }),
            });
            const cmt = await res.json();

            setCountComments((prev) => prev + 1);

            return cmt;
        } catch (error: any) {
            toast.error(error);
        } finally {
            setIsSending(false);
            setValueInput('');
        }
    };

    // Xóa comment
    const deleteComment = async (id: string) => {
        if (!id) {
            toast.error('Không tìm thấy bình luận!');
        }

        try {
            setComments((prev) => prev.filter((cmt) => cmt._id !== id));

            await fetch(`/api/posts/${post._id}/comments/${id}`, {
                method: 'DELETE',
            });

            setCountComments((prev) => prev - 1);
        } catch (error: any) {
            throw new Error(error);
        }
    };

    const values = {
        post,
        user,
        comments,
        setComments,
        countComments,
        setCountComments,
        sendComment,
        deleteComment,
        setIsDelete,
    };

    return (
        <PostContext.Provider value={values}>
            {isDelete ? <></> : children}
        </PostContext.Provider>
    );
}

export default PostProvider;
