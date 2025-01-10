'use client';
import { ReactionPost } from '@/components/post';
import { Avatar, Icons, Loading } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useRef } from 'react';
import { sendComment } from '@/lib/actions/comment.action';
import { getCommentsKey, getPostKey } from '@/lib/queryKey';
import toast from 'react-hot-toast';
import InputComment from '@/components/post/comment/InputComment';
import { Button } from '@/components/ui/Button';
import Comment from '@/components/post/comment/CommentItem';

interface Props {
    post: IPost;
}

type FormData = {
    text: string;
};

const PAGE_SIZE = 3;

export const useComments = (postId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getCommentsKey(postId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!postId) return [];

            const res = await fetch(
                `/api/comments?postId=${postId}&page=${pageParam}&pageSize=${PAGE_SIZE}`
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
        enabled: !!postId,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
    });

const FooterPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const {
        data: comments,
        isLoading: isLoadingComments,
        hasNextPage,
        fetchNextPage,
    } = useComments(post._id);

    const {
        handleSubmit,
        register,
        reset,
        setFocus,
        formState: { isLoading, isSubmitting },
    } = useForm<FormData>();
    const formRef = useRef<HTMLFormElement>(null);

    // Gửi bình luận
    const onSubmitComment: SubmitHandler<FormData> = async (data) => {
        reset();
        setFocus('text');
        const { text } = data;

        try {
            await sendComment({
                content: text,
                postId: post._id,
                replyTo: null,
            });

            await queryClient.invalidateQueries({
                queryKey: getPostKey(post._id),
            });

            await queryClient.invalidateQueries({
                queryKey: getCommentsKey(post._id),
            });
        } catch (error: any) {
            toast.error('Không thể gửi bình luận!', {
                position: 'bottom-left',
            });
        }
    };

    if (!session || !comments) return <Loading text={'Đang tải bình luận'} />;

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full border-b-2 py-2 ">
                    <ReactionPost post={post} />

                    <Icons.Comment className="text-xl " />
                    <span className="text-md ml-1">{post.comments_count}</span>
                </div>

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
                                {isLoading ? (
                                    <Icons.Loading className="animate-spin" />
                                ) : (
                                    <Icons.Send className="text-xl" />
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                {isSubmitting && <Loading text={'Đang gửi bình luận'} />}

                {isLoadingComments && <Loading text={'Đang tải bình luận'} />}

                {comments.length === 0 && (
                    <div className="text-center text-xs text-secondary-1">
                        Chưa có bình luận nào
                    </div>
                )}

                {comments &&
                    comments.map((cmt) => <Comment data={cmt} key={cmt._id} />)}

                {hasNextPage && (
                    <Button
                        className="text-secondary-1"
                        variant={'text'}
                        size={'xs'}
                        onClick={() => fetchNextPage()}
                    >
                        Xem thêm bình luận
                    </Button>
                )}
            </div>
        </>
    );
};

export default FooterPost;
