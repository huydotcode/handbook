'use client';
import { Avatar, Icons, Loading } from '@/components/ui';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteComment, sendComment } from '@/lib/actions/comment.action';
import logger from '@/utils/logger';
import toast from 'react-hot-toast';
import InputComment from '@/components/post/comment/InputComment';
import { Comment } from '@/components/post';
import {
    getCommentsKey,
    getPostKey,
    getReplyCommentsKey,
} from '@/lib/queryKey';

interface Props {
    data: IComment;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 5;

export const useReplyComments = (commentId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getReplyCommentsKey(commentId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!commentId) return [];

            const res = await fetch(
                `/api/comments/reply?commentId=${commentId}&page=${pageParam}&pageSize=${PAGE_SIZE}`
            );
            const comments = await res.json();

            return comments;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, allPages) => {
            return firstPage.length === PAGE_SIZE ? 1 : undefined;
        },
        select: (data) => data.pages.flatMap((page) => page),
        enabled: !!commentId,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
    });

const CommentItem: React.FC<Props> = ({ data: comment }) => {
    const { data: session } = useSession();
    const {
        data: replyComments,
        hasNextPage,
        fetchNextPage,
        isLoading: isLoadingReplyComments,
    } = useReplyComments(comment._id);
    const queryClient = useQueryClient();

    // Bình luận trả lời
    const [showReplyComments, setShowReplyComments] = useState<boolean>(false);

    // Form trả lời
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const { register, handleSubmit, formState, reset } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    const sendReplyComment: SubmitHandler<FormData> = async (data) => {
        if (formState.isSubmitting || formState.isLoading) return;

        try {
            await sendComment({
                content: data.text,
                replyTo: comment._id,
                postId: comment.post._id,
            });

            await queryClient.invalidateQueries({
                queryKey: getReplyCommentsKey(comment._id),
            });

            await queryClient.invalidateQueries({
                queryKey: getPostKey(comment.post._id),
            });

            setShowReplyComments(true);
        } catch (error) {
            logger({
                message: 'Error send reply comments' + error,
                type: 'error',
            });
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
            await deleteComment({ commentId: comment._id });

            if (comment.replyComment) {
                await queryClient.invalidateQueries({
                    queryKey: getReplyCommentsKey(comment.replyComment._id),
                });
            }

            await queryClient.invalidateQueries({
                queryKey: getPostKey(comment.post._id),
            });

            await queryClient.invalidateQueries({
                queryKey: getCommentsKey(comment.post._id),
            });
        } catch (error) {
            logger({
                message: 'Error delete comment' + error,
                type: 'error',
            });
            toast.error('Có lỗi xảy ra khi xóa bình luận');
        }
    };

    return (
        <div key={comment._id} className="mt-2">
            <div className="flex justify-between">
                <Avatar
                    imgSrc={comment.author.avatar}
                    userUrl={comment.author._id}
                    alt={comment.author.name}
                />

                <div className="ml-2 flex max-w-[calc(100%-32px)] flex-1 flex-col">
                    <div className="relative w-fit break-all rounded-xl bg-primary-1 px-4 py-1 text-sm dark:bg-dark-secondary-2">
                        <Link
                            href={`/profile/${comment.author._id}`}
                            className="mb-1 p-0 text-xs font-bold hover:underline dark:text-dark-primary-1"
                        >
                            {comment.author.name}
                        </Link>

                        <div
                            dangerouslySetInnerHTML={{
                                __html: comment.text,
                            }}
                        />
                    </div>

                    <div className="mt-2 flex h-4 items-center">
                        <Button
                            className="mr-2"
                            variant={'text'}
                            size={'xs'}
                            onClick={handleShowReplyForm}
                        >
                            Trả lời
                        </Button>

                        {session?.user.id === comment.author._id && (
                            <Button
                                variant={'text'}
                                size={'xs'}
                                onClick={handleDeleteComment}
                            >
                                Xóa
                            </Button>
                        )}
                    </div>

                    {/* Form trả lời */}

                    {isLoadingReplyComments || !replyComments ? (
                        <Loading text={'Đang tải bình luận'} />
                    ) : (
                        <>
                            {replyComments.length > 0 && !showReplyComments && (
                                <Button
                                    className="w-fit"
                                    variant={'text'}
                                    size={'xs'}
                                    onClick={() =>
                                        setShowReplyComments((prev) => !prev)
                                    }
                                >
                                    Xem {replyComments.length} bình luận
                                </Button>
                            )}

                            {showReplyComments && (
                                <div className="border-l pl-3">
                                    {replyComments.reverse().map((cmt) => {
                                        return (
                                            <Comment key={cmt._id} data={cmt} />
                                        );
                                    })}

                                    {hasNextPage && (
                                        <Button
                                            variant={'text'}
                                            size={'sm'}
                                            onClick={() => fetchNextPage()}
                                        >
                                            Xem thêm bình luận
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

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
                                    size={'xs'}
                                    onClick={handleShowReplyForm}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default CommentItem;
