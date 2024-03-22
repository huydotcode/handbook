'use client';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Button, Icons } from '@/components/ui';
import CommentService from '@/lib/services/comment.service';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Comment from './Comment';
import InputComment from './InputComment';
import { usePost } from '@/context';

interface Props {
    parentId: string;
    postId: string;
    authorId: string;
    setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 5;

const ReplyComment: React.FC<Props> = ({
    parentId,
    postId,
    setIsDeleted,
    authorId,
}) => {
    const { data: session } = useSession();
    const { setCountAllComments } = usePost();

    // Bình luận trả lời
    const [showReplyComments, setShowReplyComments] = useState<boolean>(false);
    const [replyComments, setReplyComments] = useState<IComment[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isHasLoadMore, setIsHasLoadMore] = useState<boolean>(true);

    // Form trả lời
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const { register, handleSubmit, formState, reset } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    const sendReplyComment: SubmitHandler<FormData> = async (data) => {
        try {
            const newReplyComment = await CommentService.sendComment({
                content: data.text,
                replyTo: parentId,
                postId,
            });

            if (newReplyComment) {
                setReplyComments((prev) => [newReplyComment, ...prev]);
                setCountAllComments((prev) => prev + 1);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gửi bình luận');
        } finally {
            reset();
        }
    };

    const handleShowReplyForm = () => {
        setShowReplyForm((prev) => !prev);
    };

    const handleDeleteComment = async () => {
        try {
            await CommentService.deleteComment({ commentId: parentId });

            setCountAllComments((prev) => {
                if (prev > 0) return prev - 1;
                return prev;
            });
            setIsDeleted(true);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa bình luận');
        }
    };

    useEffect(() => {
        (async () => {
            const replyComments = (await CommentService.getReplyComments({
                commentId: parentId,
                page,
                pageSize: PAGE_SIZE,
            })) as IComment[];

            if (replyComments.length === 0) setIsHasLoadMore(false);

            if (replyComments) {
                setReplyComments((prev) => [...prev, ...replyComments]);
            }

            if (replyComments.length < PAGE_SIZE) setIsHasLoadMore(false);
        })();
    }, [page, parentId]);

    return (
        <>
            <div className="mt-2 flex h-4 items-center">
                {/* Trả lời */}
                <Button
                    className="mr-2"
                    variant={'text'}
                    size={'small'}
                    onClick={handleShowReplyForm}
                >
                    Trả lời
                </Button>

                {/* Xóa bình luận */}
                {session?.user.id === authorId && (
                    <Button
                        variant={'text'}
                        size={'small'}
                        onClick={handleDeleteComment}
                    >
                        Xóa
                    </Button>
                )}
            </div>

            {/* Form trả lời */}
            {session?.user && showReplyForm && (
                <div className="relative mt-2 flex">
                    <Avatar session={session} />

                    <div className="ml-2 flex w-full flex-col">
                        <form
                            ref={formRef}
                            className="flex w-full overflow-hidden rounded-xl bg-primary-1 dark:bg-dark-secondary-2"
                            onSubmit={handleSubmit(sendReplyComment)}
                        >
                            <InputComment
                                formRef={formRef}
                                register={register}
                                placeholder="Viết bình luận..."
                            />

                            <Button
                                className="right-0 z-10 w-10 rounded-r-xl border-l-2 bg-transparent px-3 hover:cursor-pointer hover:bg-hover-1 dark:hover:bg-dark-hover-2"
                                variant={'custom'}
                                type="submit"
                            >
                                {formState.isSubmitting ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Send />
                                )}
                            </Button>
                        </form>

                        <Button
                            className="w-8 rounded-t-md"
                            variant={'text'}
                            size={'small'}
                            onClick={handleShowReplyForm}
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            )}

            {/* Các bình luận trả lời */}
            {replyComments.length > 0 && !showReplyComments && (
                <Button
                    className="w-fit"
                    variant={'text'}
                    size={'small'}
                    onClick={() => setShowReplyComments((prev) => !prev)}
                >
                    Xem {replyComments.length} bình luận
                </Button>
            )}

            {showReplyComments && (
                <div className="border-l pl-3">
                    {replyComments.map((cmt) => {
                        return <Comment key={cmt._id} data={cmt} />;
                    })}

                    {isHasLoadMore && (
                        <Button
                            variant={'text'}
                            size={'small'}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Xem thêm bình luận
                        </Button>
                    )}
                </div>
            )}
        </>
    );
};
export default ReplyComment;
