import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import generateRoomId from '@/utils/generateRoomId';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '..';
import Avatar from '../Avatar';
import Icons from '../ui/Icons';
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

        setCurrentRoom({
            id: roomId,
            name: name,
            image: image,
            lastAccessed: lastAccessed,
            members: [session.user.id, _id],
            messages: [],
            type: 'f',
        });

        setRooms((prev) => {
            const roomIndex = prev.findIndex((room) => room.id === roomId);

            if (roomIndex === -1) {
                if (prev.length === 3) prev.pop();

                const newRoom = {
                    id: roomId,
                    image: image,
                    lastAccessed: lastAccessed,
                    members: [session.user.id, _id],
                    messages: [],
                    name: name,
                    type: 'f',
                } as IRoomChat;

                return [newRoom, ...prev];
            }

            return prev;
        });
    };

    return (
        <Button
            variant={'custom'}
            className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-gray-200 dark:hover:bg-dark-500 lg:w-auto lg:justify-center"
            key={friend._id}
            onClick={() => handleClickFriend(friend)}
        >
            <div className="flex items-center">
                <Avatar imgSrc={friend.image || ''} />

                <span className="ml-2 text-xs lg:hidden">{friend.name}</span>
            </div>

            <span className="lg:hidden">
                {isOnline && <Icons.Circle className="text-sm text-blue-500" />}
            </span>
        </Button>
    );
};
export default FriendItem;
