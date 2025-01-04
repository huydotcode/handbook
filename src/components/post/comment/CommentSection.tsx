'use client';
import { Avatar, Button, Icons, Loading } from '@/components/ui';
import { getCommentsByPostId, sendComment } from '@/lib/actions/comment.action';
import { getCommentsKey } from '@/lib/queryKey';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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

const PAGE_SIZE = 3;

export const useComments = (postId: string | undefined) =>
    useInfiniteQuery({
        queryKey: getCommentsKey(postId),
        queryFn: async ({ pageParam = 1 }) => {
            if (!postId) return [];

            const comments = await getCommentsByPostId({
                page: pageParam,
                pageSize: PAGE_SIZE,
                postId,
            });

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
        enabled: !!postId,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
    });

const CommentSection: React.FC<Props> = ({ postId }) => {
    const { data: session } = useSession();
    const query = useComments(postId);

    const queryClient = useQueryClient();
    const {
        handleSubmit,
        register,
        reset,
        setFocus,
        formState: { isLoading },
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
                postId,
                replyTo: null,
            });

            queryClient.invalidateQueries({
                queryKey: getCommentsKey(postId),
            });
        } catch (error: any) {
            toast.error('Không thể gửi bình luận!', {
                position: 'bottom-left',
            });
        }
    };

    if (!session) return null;

    return (
        <>
            {/* Form viết bình luận */}
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

            {query.isLoading && <Loading text={'Đang tải bình luận'} />}

            {query.data?.pages.length === 0 ||
                (query.data?.pages[0] && query.data?.pages[0].length === 0 && (
                    <div className="text-center text-xs text-secondary-1">
                        Chưa có bình luận nào
                    </div>
                ))}

            {query.data?.pages.map((page, i) => (
                <div key={i}>
                    {page.map((comment: IComment) => (
                        <Comment key={comment._id} data={comment} />
                    ))}
                </div>
            ))}
            {query.hasNextPage && (
                <Button
                    className="my-2 justify-start p-0 text-xs text-secondary-1"
                    variant={'text'}
                    onClick={() => query.fetchNextPage()}
                >
                    Xem thêm bình luận
                </Button>
            )}
        </>
    );
};
export default CommentSection;
