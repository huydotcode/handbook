'use client';
import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    session: Session;
    postId: string;
    comments: Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    replyTo?: string;
}

export default function useCommentPost(props: Props) {
    const { session, postId, replyTo, comments, setComments } = props;
    const [valueInput, setValueInput] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Gửi comment
    const sendComment = async () => {
        if (isSending) return;
        setIsSending(true);

        try {
            if (valueInput.replaceAll('<p><br></p>', '').trim().length === 0) {
                toast.error('Vui lòng nhập trước khi gửi!');
                return;
            }

            const res = await fetch(`/api/posts/${postId}/comments/new`, {
                method: 'POST',
                body: JSON.stringify({
                    content: valueInput.replace(/\n/g, '<br/>'),
                    userId: session?.user.id,
                    replyTo: replyTo || null,
                }),
            });

            if (res.ok) {
                const newComment = await res.json();

                setComments((prev) => {
                    return [newComment, ...prev];
                });
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            setIsSending(false);
            setValueInput('');
        }
    };

    // Xóa comment
    const deleteComment = async (id: string) => {
        try {
            setComments((prev) => {
                const newComments = prev?.filter((cmt) => {
                    return cmt._id !== id || cmt.parent_id !== id;
                });

                return newComments;
            });

            const res = await fetch(`/api/posts/${postId}/comments/${id}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    replyTo: replyTo,
                }),
            });
        } catch (error: any) {
            throw new Error(error);
        }
    };

    return {
        valueInput,
        setValueInput,
        sendComment,
        deleteComment,
        loading,
        isSending,
    };
}
