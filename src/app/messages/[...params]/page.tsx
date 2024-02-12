'use client';
import { useSocket } from '@/context';
import { fetchFriends, fetchUserByUserId } from '@/lib/actions/user.action';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ChatBox, Sidebar } from '../_components';
import { useChat } from '@/context/ChatContext';

interface Props {
    params: {
        params: string[];
    };
}
// Các loại trang
// f: Trang nhắn với bạn bè
// r: Trang nhắn với người lạ
// d: Trang nhắn với nhóm
// c: Trang nhắn với trang

const typePage = ['f', 'r', 'd', 'c'];

const MessagePage: React.FC<Props> = ({ params }) => {
    const [type, conversation] = params.params;
    const { data: session } = useSession();
    const router = useRouter();

    const { socket } = useSocket();

    // Kiểm tra type có hợp lệ hay không
    if (!typePage.includes(type) || !conversation) {
        redirect('/messages');
    }

    const { friends, currentRoom, setCurrentRoom, setConversations } =
        useChat();

    useEffect(() => {
        (async () => {
            if (!session || !socket) return;

            const friends = (await fetchFriends({
                userId: session.user.id,
            })) as IFriend[];

            switch (type) {
                case 'f':
                    // Nhắn tin với bạn bè
                    const friend = friends.find(
                        (friend) => friend._id === conversation
                    );

                    if (!friend) {
                        router.push('/messages');
                        return;
                    }

                    const roomId = [session?.user.id, friend._id]
                        .sort()
                        .join('');

                    setCurrentRoom({
                        id: roomId,
                        name: friend.name,
                        image: friend.image,
                        members: [friend._id, session?.user.id],
                        messages: [],
                        lastAccessed: friend.lastAccessed,
                        type: 'f',
                    });
                    break;
                case 'r':
                    // Nhắn tin với người lạ
                    const user = await fetchUserByUserId({
                        userId: conversation,
                    });

                    if (!user) {
                        router.push('/messages');
                        return;
                    }

                    const roomId2 = generateRoomId(session.user.id, user._id);

                    setCurrentRoom({
                        id: roomId2,
                        name: user.name,
                        image: user.image,
                        members: [user._id, session?.user.id],
                        messages: [],
                        lastAccessed: user.lastAccessed,
                        type: 'r',
                    });

                    setConversations((prev) => {
                        const index = prev.findIndex(
                            (item) => item.id === roomId2
                        );
                        if (index !== -1) {
                            return prev;
                        }

                        const newConversation = {
                            id: roomId2,
                            image: user.image,
                            name: user.name,
                            lastAccessed: user.lastAccessed,
                            members: [user._id, session?.user.id],
                            messages: [],
                            type: 'r',
                        } as IRoomChat;

                        return [...prev, newConversation];
                    });
                    break;
                case 'd':
                    //TODO Nhắn tin với nhóm
                    break;
                case 'c':
                    //TODO Nhắn tin với trang
                    break;
                default:
                    break;
            }
        })();
    }, [socket, friends]);

    return <>{currentRoom.id && <ChatBox currentRoom={currentRoom} />}</>;
};
export default MessagePage;
