'use client';
import Comment from '@/components/post/comment/CommentItem';
import SkeletonComment from '@/components/post/comment/SkeletonComment';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useFriends } from '@/context/SocialContext';
import { usePreventMultiClick } from '@/hooks/usePreventMultiClick';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { sendComment } from '@/lib/actions/comment.action';
import { getConversationWithTwoUsers } from '@/lib/actions/conversation.action';
import { sendMessage } from '@/lib/actions/message.action';
import { savePost, sendReaction, unsavePost } from '@/lib/actions/post.action';
import axiosInstance from '@/lib/axios';
import { getCommentsKey, getSavedPostsKey } from '@/lib/queryKey';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Form, FormControl } from '../ui/Form';
import { Textarea } from '../ui/textarea';

interface Props {
    post: IPost;
}

type FormData = {
    text: string;
};

const BASE_URL = 'https://handbookk.vercel.app';
const PAGE_SIZE = 3;

const ShareModal: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const { data: friends } = useFriends(session?.user.id);
    const [sended, setSended] = useState<string[]>([]);
    const { socketEmitor } = useSocket();

    const handleShare = async (friendId: string) => {
        if (!session?.user) return;

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
                <Button className="flex-1 md:p-1" variant={'ghost'}>
                    <Icons.Share className="text-xl" />
                    <span className="ml-1 mr-2 min-w-[10px] text-sm sm:hidden">
                        Chia sẻ
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <span>Chia sẻ bài của {post.author.name}</span>
                    </DialogTitle>

                    <DialogClose />
                </DialogHeader>

                <div className="flex max-h-[400px] flex-col gap-2 overflow-y-scroll">
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

export const useSavedPosts = (userId: string | undefined) =>
    useQuery<ISavedPost>({
        queryKey: getSavedPostsKey(userId),
        queryFn: async () => {
            if (!userId) return [];

            const res = await axiosInstance.get(`/saved-posts`, {
                params: { user_id: userId },
            });

            return res.data;
        },
        enabled: !!userId,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

const SavePost: React.FC<Props> = ({ post }) => {
    const { countClick, handleClick, canClick } = usePreventMultiClick({
        message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau 5s!',
        maxCount: 1,
    });
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const { invalidateSavedPosts, invalidatePost } = useQueryInvalidation();

    const pathName = usePathname();
    const { data: savedPosts, isLoading } = useSavedPosts(session?.user.id);
    const isSaved = savedPosts?.posts.find((p) => p._id === post._id);
    const isSavedPage = useMemo(() => {
        return pathName.includes('/saved');
    }, [pathName]);

    const { mutate, isPending } = useMutation({
        mutationFn: handleSave,
        mutationKey: ['savePost', post._id],
        onSuccess: async () => {
            if (!session?.user.id) return;
            await invalidateSavedPosts(session?.user.id);
            await invalidatePost(post._id);
        },
    });
    const isLoadingSavePost = isLoading || isPending;

    async function handleSave() {
        handleClick();

        if (!canClick) return;
        if (!session?.user) return;

        try {
            if (isSaved) {
                await unsavePost({ postId: post._id, path: pathName });
            } else {
                await savePost({ postId: post._id, path: pathName });
            }
        } catch (error) {
            toast.error('Không thể lưu bài viết!', {
                position: 'bottom-left',
            });
        }
    }

    return (
        <Button
            onClick={() => mutate()}
            className={cn('flex flex-1 items-center gap-2 p-1', {
                'text-yellow-300 hover:text-yellow-200': isSaved && !isPending,
            })}
            disabled={isPending}
            variant={'ghost'}
        >
            {isLoadingSavePost ? <Icons.Loading /> : <Icons.Bookmark />}
            <span className="sm:hidden">
                {isLoadingSavePost && isSaved
                    ? 'Đang hủy'
                    : isLoadingSavePost && !isSaved
                      ? 'Đang lưu'
                      : 'Lưu'}
            </span>
        </Button>
    );
};

interface ReactionPostProps {
    post: IPost;
}

const ReactionPost: React.FC<ReactionPostProps> = ({ post }) => {
    const { data: session } = useSession();
    const [loves, setLoves] = useState<string[]>(post.loves.map((l) => l._id));
    const { socketEmitor } = useSocket();
    const { invalidatePost } = useQueryInvalidation();

    const isReacted = React.useMemo(
        () => loves.find((r) => r === session?.user.id),
        [loves, session?.user.id]
    );

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session?.user) {
                toast.error('Bạn cần đăng nhập để thực hiện chức năng này!');
                return;
            }

            try {
                if (isReacted) {
                    setLoves((prev) =>
                        prev.filter((r) => r !== session?.user.id)
                    );
                } else {
                    setLoves((prev) => {
                        return [...prev, session?.user.id];
                    });
                }

                await sendReaction({
                    postId: post._id,
                });

                if (!isReacted) {
                    socketEmitor.likePost({
                        postId: post._id,
                        authorId: post.author._id,
                    });
                }

                await invalidatePost(post._id);
            } catch (error: any) {
                logger({
                    message: 'Error reaction post' + error,
                    type: 'error',
                });
            }
        },
        onError: () => {
            toast.error('Không thể thực hiện chức năng này!');
        },
    });

    return (
        <Button
            className="like-container mr-2 flex flex-1 items-center md:p-1"
            variant={'ghost'}
            onClick={() => mutation.mutate()}
        >
            <div className="con-like">
                <input
                    className="like"
                    type="checkbox"
                    title="like"
                    checked={isReacted ? true : false}
                    onChange={() => {}}
                />
                <div className="checkmark flex">
                    <Icons.Heart />
                </div>
            </div>

            <span
                className={cn('ml-1 mr-2 min-w-[10px] text-sm sm:hidden', {
                    'text-red-500': isReacted,
                })}
            >
                Yêu thích
            </span>
        </Button>
    );
};

const FooterPost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();

    const { invalidatePost, invalidateComments } = useQueryInvalidation();
    const {
        data: comments,
        isLoading: isLoadingComments,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: getCommentsKey(post._id),
        queryFn: async ({ pageParam = 1 }) => {
            if (!post._id) return [];

            const res = await axiosInstance.get(`/comments`, {
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

    const form = useForm<FormData>();
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

        reset();
        setFocus('text');
        setValue('text', '');

        try {
            await sendComment({
                content: text,
                postId: post._id,
                replyTo: null,
            });

            await invalidatePost(post._id);
            await invalidateComments(post._id);
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
            <div className="mt-2">
                <div className="relative flex w-full justify-end gap-2 py-2">
                    <div className="flex items-center">
                        <Icons.Heart2 className="text-xl text-red-400" />
                        <span className="text-md ml-1">
                            {post.loves.length}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <Icons.Comment className="text-xl" />
                        <span className="text-md ml-1">
                            {post.comments_count}
                        </span>
                    </div>
                </div>

                <div className="mt-1 grid grid-cols-3 border-y py-1 dark:border-dark-secondary-2">
                    <ReactionPost post={post} />

                    <ShareModal post={post} />

                    <SavePost post={post} />
                </div>

                <div className="mb-2 mt-2 flex items-center">
                    <Avatar session={session} />

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

                {!isLoadingComments && comments.length === 0 && (
                    <div className="text-center text-xs text-secondary-1">
                        Chưa có bình luận nào
                    </div>
                )}

                {!isLoadingComments &&
                    comments &&
                    comments.map((cmt) => <Comment data={cmt} key={cmt._id} />)}

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
            </div>
        </>
    );
};

export default FooterPost;
