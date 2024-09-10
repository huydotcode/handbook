'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import { useSubmitCommentMutation } from '@/lib/mutations';
import CommentService from '@/lib/services/comment.service';
import logger from '@/utils/logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Comment from './CommentItem';
import InputComment from './InputComment';

interface Props {
    postId: string;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 5;

const CommentSection: React.FC<Props> = ({ postId }) => {
    const { data: session } = useSession();

    const {
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    const {
        data: comments,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const comments = await CommentService.getCommentsByPostId({
                    page: pageParam,
                    pageSize: PAGE_SIZE,
                    postId,
                });

                return comments;
            } catch (error: any) {
                toast.error('Không thể tải bình luận');
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;

            return pages.length + 1;
        },
    });

    const mutation = useSubmitCommentMutation({
        postId,
    });

    // Gửi bình luận
    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        if (!session?.user.id || isSubmitting) return;

        try {
            mutation.mutate({
                content: data.text,
                replyTo: null,
                postId: postId,
            });
        } catch (error: any) {
            logger({
                message: 'Error send comment' + error,
                type: 'error',
            });
        } finally {
            formRef.current?.reset();
        }
    };

    return (
        <>
            {/* Form viết bình luận */}
            {session?.user ? (
                <div className="mb-2 mt-2 flex items-center">
                    <Avatar session={session} />

                    <div className="ml-2 flex-1">
                        <form
                            className="flex w-full overflow-hidden rounded-xl bg-primary-1 dark:bg-dark-secondary-2"
                            onSubmit={handleSubmit(onSubmitComment)}
                            ref={formRef}
                        >
                            <InputComment
                                register={register}
                                placeholder="Viết bình luận..."
                                formRef={formRef}
                            />

                            <Button
                                className="right-0 w-10 rounded-r-xl border-l-2 px-3 hover:cursor-pointer hover:bg-hover-1 dark:hover:bg-dark-hover-2"
                                variant={'custom'}
                                type="submit"
                            >
                                {isSubmitting ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Send className="text-xl" />
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            ) : (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                    href="/login"
                >
                    Bạn cần đăng nhập để viết bình luận
                </Button>
            )}

            {/* Không có bình luận nào */}
            {!comments && (
                <div className="text-center text-xs text-secondary-1">
                    Không có bình luận nào
                </div>
            )}

            {/* Comments */}
            <div className="mt-3 grid gap-2">
                {comments &&
                    comments.pages.map((page) => {
                        return page.map((cmt: IComment) => (
                            <Comment data={cmt} key={cmt._id} />
                        ));
                    })}
            </div>

            {/* Tải thêm */}
            {hasNextPage && (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                    onClick={() => fetchNextPage()}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};
export default CommentSection;
