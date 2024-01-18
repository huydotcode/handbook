import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { Button } from '..';
import Avatar from '../Avatar';

interface Props {
    data: IFriend;
}

const FriendItem: React.FC<Props> = ({ data: friend }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();
    const { setCurrentRoom, setRooms } = useChat();

    const isOnline = friend.isOnline;

    const handleClickFriend = async ({
        _id,
        image,
        name,
        lastAccessed,
    }: IFriend) => {
        if (!socket || !session) return;

        const roomId = generateRoomId(session.user.id, _id);

        await socket.emit('join-room', {
            roomId,
        });

        await socket.emit('read-message', {
            roomId: roomId,
        });

        setCurrentRoom({
            id: roomId,
            name: name,
            image: image,
            members: [session.user.id, _id],
            messages: [],
            lastAccessed: lastAccessed,
        });

        setRooms((prev) => {
            const roomIndex = prev.findIndex((room) => room.id === roomId);

            if (roomIndex === -1) {
                if (prev.length === 3) prev.pop();

                return [
                    {
                        id: roomId,
                        name: name,
                        image: image,
                        members: [session.user.id, _id],
                        messages: [],
                        lastAccessed: lastAccessed,
                    },
                    ...prev,
                ];
            }

            return prev;
        });
    };

    return (
        <Button
            variant={'custom'}
            className="flex items-center justify-between p-3 shadow-sm w-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-500"
            key={friend._id}
            onClick={() => handleClickFriend(friend)}
        >
            <div className="flex items-center">
                <Avatar imgSrc={friend.image || ''} />
                <span className="ml-2 lg:hidden">{friend.name}</span>
            </div>

            <span className="lg:hidden">
                {isOnline && <FaCircle className="text-sm text-blue-500" />}
            </span>
        </Button>
    );
};
export default FriendItem;