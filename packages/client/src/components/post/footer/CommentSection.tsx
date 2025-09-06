'use client';
import Comment from '@/components/post/comment/CommentItem';
import SkeletonComment from '@/components/post/comment/SkeletonComment';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { API_ROUTES } from '@/config/api';
import axiosInstance from '@/lib/axios';
import queryKey from '@/lib/queryKey';
import CommentService from '@/lib/services/comment.service';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form, FormControl } from '../../ui/Form';
import { Textarea } from '../../ui/textarea';

interface Props {
    post: IPost;
    setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 3;

const CommentSection: React.FC<Props> = ({ post, setCommentCount }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const {
        data: comments,
        isLoading: isLoadingComments,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: queryKey.posts.comments(post._id),
        queryFn: async ({ pageParam = 1 }) => {
            if (!post._id) return [];

            const res = await axiosInstance.get(API_ROUTES.COMMENTS.INDEX, {
                params: {
                    post_id: post._id,
                    page: pageParam,
                    page_size: PAGE_SIZE,
                },
            });
            const comments = res.data;

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
        enabled: !!post._id,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        initialData: {
            pages: [],
            pageParams: [],
        },
    });

    const form = useForm<FormData>({
        defaultValues: {
            text: '',
        },
    });
    const {
        handleSubmit,
        reset,
        setFocus,
        formState: { isLoading },
        setValue,
    } = form;
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: FormData) => {
            await onSubmitComment(data);
        },
    });
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Gửi bình luận
    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        const { text } = data;
        if (!text || text.trim().length === 0) return;

        setCommentCount((prev) => prev + 1);

        reset();
        setFocus('text');
        setValue('text', '');

        try {
            const newComment = await CommentService.create({
                content: text,
                replyTo: null,
                postId: post._id,
            });

            await queryClient.setQueryData(
                queryKey.posts.id(post._id),
                (oldData: IPost | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        commentsCount: oldData.commentsCount + 1,
                    };
                }
            );

            await queryClient.setQueryData(
                queryKey.posts.comments(post._id),
                (oldData: { pages: IComment[][]; pageParams: number[] }) => {
                    if (!oldData) return oldData;
                    return {
                        pages: [[newComment], ...oldData.pages],
                        pageParams: [1, ...oldData.pageParams],
                    };
                }
            );
        } catch (error: any) {
            console.log('Error onSubmitComment: ', error);
            toast.error('Không thể gửi bình luận!', {
                position: 'bottom-left',
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Nếu Shift + Enter thì xuống dòng
        if (e.key === 'Enter' && e.shiftKey) return;

        if (e.key === 'Enter') {
            e.preventDefault();

            formRef.current?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    if (!session || !comments || isLoadingComments)
        return (
            <div className={'flex flex-col gap-4'}>
                <SkeletonComment />
                <SkeletonComment />
                <SkeletonComment />
            </div>
        );

    return (
        <>
            <div className="mb-2 mt-2 flex items-center">
                {session && <Avatar session={session} />}

                <div className="ml-2 flex-1">
                    <Form {...form}>
                        <form
                            className="flex h-fit w-full overflow-hidden rounded-xl border bg-primary-1 dark:border-none dark:bg-dark-secondary-2"
                            onSubmit={handleSubmit((data) => {
                                mutate(data);
                            })}
                            ref={formRef}
                        >
                            <Controller
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            ref={inputRef}
                                            className="cursor-text rounded-l-xl rounded-r-none bg-transparent outline-none dark:border-none"
                                            placeholder="Viết bình luận..."
                                            spellCheck={false}
                                            autoComplete="off"
                                            onKeyDown={handleKeyDown}
                                        />
                                    </FormControl>
                                )}
                            />

                            <Button
                                className="right-0 w-10 rounded-l-none rounded-r-xl px-3 hover:cursor-pointer hover:bg-hover-1 dark:border-none dark:hover:bg-dark-hover-2"
                                variant={'custom'}
                                type="submit"
                            >
                                {isLoading ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Send />
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            {isPending && <SkeletonComment />}

            {!isLoadingComments && !isPending && comments.length === 0 && (
                <div className="text-center text-xs text-secondary-1">
                    Không có bình luận
                </div>
            )}

            {!isLoadingComments &&
                comments &&
                comments.map((cmt) => (
                    <Comment
                        data={cmt}
                        key={cmt._id}
                        setCommentCount={setCommentCount}
                    />
                ))}

            {!isLoadingComments && hasNextPage && (
                <Button
                    className="text-secondary-1"
                    variant={'text'}
                    size={'xs'}
                    onClick={() => fetchNextPage()}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};

export default CommentSection;
