'use client';
import { ReactionPost } from '@/components/post';
import { Avatar, Icons, Loading, Modal } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { KeyboardEventHandler, useRef, useState } from 'react';
import { sendComment } from '@/lib/actions/comment.action';
import { getCommentsKey, getPostKey } from '@/lib/queryKey';
import toast from 'react-hot-toast';
import InputComment from '@/components/post/comment/InputComment';
import { Button } from '@/components/ui/Button';
import Comment from '@/components/post/comment/CommentItem';
import SkeletonComment from '@/components/post/comment/SkeletonComment';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useFriends } from '@/context/SocialContext';
import { sendMessage } from '@/lib/actions/message.action';
import { getConversationWithTwoUsers } from '@/lib/actions/conversation.action';
import { useSocket } from '@/context';

interface Props {
    post: IPost;
}

type FormData = {
    text: string;
};

const BASE_URL = 'https://handbookk.vercel.app';

const ShareModal: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const { data: friends } = useFriends(session?.user.id);
    const [sended, setSended] = useState<string[]>([]);
    const { socket, socketEmitor } = useSocket();

    const handleShare = async (friendId: string) => {
        if (!session?.user) return;

        console.log({
            url: `${BASE_URL}/posts/${post._id}`,
        });

        try {
            const data = await getConversationWithTwoUsers({
                otherUserId: friendId,
                userId: session?.user.id,
            });
            const conversation = data.conversation;

            if (conversation) {
                setSended([...sended, friendId]);

                const newMsg = await sendMessage({
                    roomId: conversation._id,
                    text: `${BASE_URL}/posts/${post._id}`,
                });

                socketEmitor.sendMessage({
                    roomId: conversation._id,
                    message: newMsg,
                });
            }

            toast.success('Đã chia sẻ bài viết!', { position: 'bottom-left' });
        } catch (error) {
            toast.error('Không thể chia sẻ bài viết!');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex-1" variant={'ghost'}>
                    <Icons.Share className="text-xl" />
                    <span className="ml-1 mr-2 min-w-[10px] text-sm">
                        Chia sẻ
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-2">
                            <Icons.Share className="text-xl" />
                            <span>Chia sẻ bài của {post.author.name}</span>
                        </div>
                        <DialogClose />
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    {friends &&
                        friends.map((friend) => {
                            const isSend = sended.includes(friend._id);

                            return (
                                <div
                                    className="flex items-center justify-between"
                                    key={friend._id}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            alt={friend.name}
                                            userUrl={friend._id}
                                            imgSrc={friend.avatar}
                                            className="h-8 w-8"
                                        />
                                        <span>{friend.name}</span>
                                    </div>

                                    {isSend ? (
                                        <Button
                                            disabled={sended.includes(
                                                friend._id
                                            )}
                                            className="flex items-center gap-1"
                                        >
                                            {sended.includes(friend._id) ? (
                                                <Icons.Send className="text-green-500" />
                                            ) : (
                                                <Icons.Send />
                                            )}
                                            <span>Đã gửi</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleShare(friend._id)
                                            }
                                        >
                                            <Icons.Send />
                                            <span>Gửi</span>
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </DialogContent>
        </Dialog>
    );
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
    const inputRef = useRef<HTMLTextAreaElement>(null);

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

    const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    if (!session || !comments)
        return (
            <div className={'flex flex-col gap-4'}>
                <SkeletonComment />
                <SkeletonComment />
                <SkeletonComment />
            </div>
        );

    return (
        <>
            <div className="mt-2">
                <div className="relative flex w-full justify-end gap-2 border-b-2 py-2">
                    <div className="flex items-center">
                        <Icons.Heart2 className="text-xl text-red-400" />
                        <span className="text-md ml-1">
                            {post.comments_count}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <Icons.Comment className="text-xl" />
                        <span className="text-md ml-1">
                            {post.comments_count}
                        </span>
                    </div>
                </div>

                <div className="mt-1 flex items-center justify-between">
                    <ReactionPost post={post} />

                    <Button
                        className="flex-1"
                        variant={'ghost'}
                        onClick={() => formRef.current?.focus()}
                    >
                        <Icons.Comment className="text-xl" />
                        <span className="ml-1 mr-2 min-w-[10px] text-sm">
                            Bình luận
                        </span>
                    </Button>

                    <ShareModal post={post} />
                </div>

                <div className="mb-2 mt-2 flex items-center">
                    <Avatar session={session} />

                    <div className="ml-2 flex-1">
                        <form
                            className="flex h-fit w-full overflow-hidden rounded-xl border bg-primary-1 dark:bg-dark-secondary-2"
                            onSubmit={handleSubmit(onSubmitComment)}
                            ref={formRef}
                        >
                            <InputComment
                                register={register}
                                placeholder="Viết bình luận..."
                                // formRef={formRef}
                                inputRef={inputRef}
                            />

                            <Button
                                className="right-0 w-10 rounded-l-none rounded-r-xl px-3 hover:cursor-pointer hover:bg-hover-1 dark:hover:bg-dark-hover-2"
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
                    </div>
                </div>

                {isSubmitting || (isLoadingComments && <SkeletonComment />)}

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
