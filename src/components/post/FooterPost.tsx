'use client';
import { useEffect, useMemo, useState } from 'react';

import { FaRegComment } from 'react-icons/fa';
import Avatar from '../Avatar';
import Comment from './Comment';
import ReactionPost from './ReactionPost';

import usePostContext from '@/hooks/usePostContext';
import { fetchCommentPostId, sendComment } from '@/lib/actions/post.action';
import { TextareaAutosize } from '@mui/material';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BsFillSendFill } from 'react-icons/bs';
import Button from '../ui/Button';

type FormData = {
    text: string;
};

const FooterPost = () => {
    const { data: session } = useSession();
    const { comments, setComments, post, countComments } = usePostContext();

    const {
        handleSubmit,
        register,
        reset,
        formState: { isSubmitting },
    } = useForm<FormData>();

    const [page, setPage] = useState<number>(1);
    const pageSize = 5;

    const commentsToRender = useMemo(() => {
        return comments.filter(
            (cmt) => cmt.delete == false && cmt.parentCommentId == null
        );
    }, [comments]);

    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        if (!session?.user.id || isSubmitting) return;

        try {
            const newComment = await sendComment({
                content: data.text,
                replyTo: null,
                postId: post._id,
                userId: session.user.id,
            });

            if (newComment) {
                setComments((prev) => [newComment, ...prev]);
            }
        } catch (error: any) {
            throw new Error(error);
        } finally {
            reset();
        }
    };

    useEffect(() => {
        (async () => {
            const comments = await fetchCommentPostId({
                page: page,
                pageSize: pageSize,
                postId: post._id,
            });

            setComments(comments);
        })();
    }, [page, pageSize, post._id, setComments]);

    return (
        <>
            <div className="mt-2">
                <div className="relative flex border-b-2 dark:border-gray-700 py-2 w-full">
                    <ReactionPost session={session} post={post} />

                    <FaRegComment className="ml-2 text-2xl" />
                    <span className="ml-1 text-md">{comments.length}</span>
                </div>

                {session?.user ? (
                    <div className="flex items-center mt-2 mb-2">
                        <Avatar session={session} />

                        <div className="flex-1 ml-2">
                            {/* <InputComment
                                isSending={isSending}
                                valueInput={valueInput}
                                sendComment={handleSendComment}
                                setValueInput={setValueInput}
                            /> */}
                            <form
                                className="flex"
                                onSubmit={handleSubmit(onSubmitComment)}
                            >
                                <TextareaAutosize
                                    className="h-10 bg-secondary flex-1 p-2 rounded-l-xl cursor-text text-sm text-start pt-[9px] overflow-y-scroll w-[calc(100%-40px)] resize-none outline-none dark:bg-dark-500 dark:placeholder:text-gray-400"
                                    placeholder="Viết bình luận..."
                                    spellCheck={false}
                                    {...register('text', {
                                        required: true,
                                    })}
                                ></TextareaAutosize>

                                <Button
                                    className="bg-secondary w-10 right-0 rounded-r-xl hover:bg-light-100 hover:cursor-pointer px-3 z-10 border-l-2 dark:bg-dark-500 dark:hover:bg-neutral-500"
                                    variant={'custom'}
                                    size={'none'}
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <AiOutlineLoading className="animate-spin" />
                                    ) : (
                                        <BsFillSendFill />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <Button
                        className="justify-start my-2 text-sm text-secondary"
                        variant={'text'}
                        size={'tiny'}
                        href="/login"
                    >
                        Bạn cần đăng nhập để viết bình luận
                    </Button>
                )}

                {/* Comments */}
                <div>
                    {countComments === 0 && (
                        <div className="text-center text-xs text-secondary">
                            Không có bình luận nào
                        </div>
                    )}

                    <>
                        <div className="mt-3">
                            {commentsToRender.map((cmt) => (
                                <Comment data={cmt} key={cmt._id} />
                            ))}
                        </div>

                        {countComments > comments.length && (
                            <Button
                                variant={'text'}
                                size={'tiny'}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Xem thêm bình luận
                            </Button>
                        )}
                    </>
                </div>
            </div>
        </>
    );
};

export default FooterPost;
