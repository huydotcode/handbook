'use client';
import { Avatar, Button, Icons } from '@/components/ui';
import CommentService from '@/lib/services/comment.service';
import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const comments = await CommentService.getCommentsByPostId({
                    page,
                    pageSize: PAGE_SIZE,
                    postId,
                });

                if (comments.length === 0) {
                    setHasNextPage(false);
                    return;
                }

                if (comments.length < PAGE_SIZE) {
                    setHasNextPage(false);
                } else {
                    setHasNextPage(true);
                }

                setComments((prev) => {
                    return [...prev, ...comments];
                });
            } catch (error) {
            } finally {
                setLoading(false);
            }
        })();
    }, [postId, page]);

    // Gửi bình luận
    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        if (!session?.user.id || isSubmitting) return;

        try {
            const newComment = await CommentService.sendComment({
                content: data.text,
                postId,
                replyTo: null,
            });

            setComments((prev) => {
                return [newComment, ...prev];
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

            {loading && (
                <div className="text-center text-xs text-secondary-1">
                    Đang tải bình luận
                </div>
            )}

            {/* Không có bình luận nào */}
            {comments.length === 0 && (
                <div className="text-center text-xs text-secondary-1">
                    Không có bình luận nào
                </div>
            )}

            {/* Comments */}
            <div className="mt-3 grid gap-2">
                {comments.map((cmt) => {
                    return <Comment data={cmt} key={cmt._id} />;
                })}
            </div>

            {/* Tải thêm */}

            {hasNextPage && (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};
export default CommentSection;
