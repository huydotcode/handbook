'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FaRegComment } from 'react-icons/fa';
import Avatar from '../Avatar';
import Comment from './Comment';
import ReactionPost from './ReactionPost';

import usePostContext from '@/hooks/usePostContext';
import { fetchCommentPostId, sendComment } from '@/lib/actions/post.action';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BsFillSendFill } from 'react-icons/bs';
import { InputComment } from '.';
import Button from '../ui/Button';
import CommentSection from './CommentSection';

type FormData = {
    text: string;
};

const FooterPost = () => {
    const { data: session } = useSession();
    const { setComments, post, countComments, setCountAllParentComments } =
        usePostContext();

    const {
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = useForm<FormData>();

    const formRef = useRef<HTMLFormElement>(null);

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
                setCountAllParentComments((prev) => prev + 1);
            }
        } catch (error: any) {
            throw new Error(error);
        } finally {
            formRef.current?.reset();
        }
    };

    const submitSendComment = handleSubmit(onSubmitComment);

    return (
        <>
            <div className="mt-2">
                <div className="relative flex border-b-2 dark:border-gray-700 py-2 w-full">
                    <ReactionPost session={session} post={post} />

                    <FaRegComment className="ml-2 text-2xl" />
                    <span className="ml-1 text-md">{countComments}</span>
                </div>

                {/* Input comment */}
                <>
                    {session?.user ? (
                        <div className="flex items-center mt-2 mb-2">
                            <Avatar session={session} />

                            <div className="flex-1 ml-2">
                                <form
                                    className="flex w-full"
                                    onSubmit={submitSendComment}
                                    ref={formRef}
                                >
                                    <InputComment
                                        register={register}
                                        placeholder="Viết bình luận..."
                                        formRef={formRef}
                                    />

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
                </>

                {/* Comments */}
                <CommentSection />
            </div>
        </>
    );
};

export default FooterPost;
