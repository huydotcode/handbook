'use client';
import { Avatar, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useFriends } from '@/context/SocialContext';
import ConversationService from '@/lib/services/conversation.service';
import MessageService from '@/lib/services/message.service';
import PostService from '@/lib/services/post.service';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../ui/dialog';

interface Props {
    post: IPost;
}

const BASE_URL = 'https://handbookk.vercel.app';

const SharePost: React.FC<Props> = ({ post }) => {
    const { data: session } = useSession();
    const { data: friends } = useFriends(session?.user.id);
    const [sended, setSended] = useState<string[]>([]);
    const { socketEmitor } = useSocket();

    const handleShare = async (friendId: string) => {
        if (!session?.user) return;

        try {
            await PostService.share(post._id);

            const { isNew, conversation } =
                await ConversationService.getPrivateConversation({
                    userId: session.user.id,
                    friendId,
                });

            if (conversation) {
                setSended([...sended, friendId]);

                const newMsg = await MessageService.send({
                    roomId: conversation._id,
                    text: `${BASE_URL}/posts/${post._id}`,
                });

                if (!newMsg) {
                    toast.error('Không thể chia sẻ bài viết!');
                    return;
                }

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

export default SharePost;
