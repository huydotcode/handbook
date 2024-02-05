import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '..';
import Avatar from '../Avatar';
import Icons from '../ui/Icons';

interface Link {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface FriendItem {
    data: IFriend;
}

interface NavItem {
    className?: string;
    link: Link;
    onlyIcon?: boolean;
    direction?: 'row' | 'col';
    index: number;
    handleClose?: () => void;
}

interface UserItem {
    data: IUser;
    handleHideModal: () => void;
}

const Items = {
    User: (props: UserItem) => {
        const { data, handleHideModal } = props;
        const { image, _id, name } = data;

        return (
            <Link
                className="relative mb-2 flex h-[50px] items-center rounded-xl px-4 shadow-md dark:bg-dark-100 dark:hover:bg-dark-200"
                href={`/profile/${_id}`}
                onClick={handleHideModal}
            >
                <Image
                    className="overflow-hidden rounded-full object-cover"
                    src={image || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <Link
                    className="ml-2 text-base text-dark-100 hover:underline dark:text-primary"
                    href={`/profile/${_id}`}
                >
                    {name}
                </Link>
            </Link>
        );
    },
    Friend: (props: FriendItem) => {
        const { data: friend } = props;
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

                    <span className="ml-2 text-xs lg:hidden">
                        {friend.name}
                    </span>
                </div>

                <span className="lg:hidden">
                    {isOnline && (
                        <Icons.Circle className="text-sm text-blue-500" />
                    )}
                </span>
            </Button>
        );
    },
    Nav: (props: NavItem) => {
        const { index, link, className, direction, handleClose, onlyIcon } =
            props;
        const path = usePathname();
        const isActived = link.path === path;
        const Icon = () => {
            return link.icon;
        };

        return (
            <Tooltip
                title={link.name}
                placement={direction == 'col' ? 'right' : 'bottom'}
            >
                <li
                    key={index}
                    className={cn(
                        `flex cursor-pointer items-center rounded-xl p-2 hover:bg-light-100 dark:hover:bg-dark-500 `,
                        {
                            'w-[50%] ': onlyIcon,
                            'bg-light-100 dark:bg-dark-100 ': isActived,
                            'rounded-none ': direction === 'row',
                        },
                        ` ${className}`
                    )}
                    onClick={handleClose}
                >
                    <Link
                        className={cn(
                            'flex h-full w-full items-center md:justify-center ',
                            {
                                'justify-center': onlyIcon,
                                'text-blue-500': isActived,
                            }
                        )}
                        href={link.path || '/'}
                    >
                        <Icon />
                        {!onlyIcon && (
                            <span className="ml-2 text-xs dark:text-primary lg:hidden">
                                {link.name}
                            </span>
                        )}
                    </Link>
                </li>
            </Tooltip>
        );
    },
};

export default Items;
