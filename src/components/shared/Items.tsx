'use client';
import { Button, Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import generateRoomId from '@/utils/generateRoomId';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

interface GroupItem {
    data: IGroup;
}

const Items = {
    User: (props: UserItem) => {
        const { data, handleHideModal } = props;
        const { avatar, _id, name } = data;

        return (
            <Button
                className="mb-2 w-full justify-start"
                onClick={handleHideModal}
                variant={'default'}
            >
                <Image
                    className="overflow-hidden rounded-full object-cover"
                    src={avatar || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <Link
                    className="ml-2 text-base dark:text-dark-primary-1"
                    href={`/profile/${_id}`}
                >
                    {name}
                </Link>
            </Button>
        );
    },
    Friend: (props: FriendItem) => {
        const { data: friend } = props;
        const isOnline = friend.isOnline;

        return (
            <Button
                variant={'custom'}
                className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:w-auto lg:justify-center"
                key={friend._id}
                href={`/profile/${friend._id}`}
            >
                <div className="flex items-center lg:h-8 lg:w-8">
                    <Image
                        className="rounded-full"
                        src={friend.avatar || ''}
                        alt={friend.name || ''}
                        width={32}
                        height={32}
                    />

                    <span className="ml-2 text-xs lg:hidden">
                        {friend.name}
                    </span>
                </div>

                <span className="lg:hidden">
                    {isOnline && (
                        <Icons.Circle className="text-sm text-primary-2" />
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
                        `flex cursor-pointer items-center rounded-xl p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1`,
                        {
                            'w-[50%]': onlyIcon,
                            'border-b-4 border-b-blue': isActived,
                            'rounded-none': direction === 'row',
                        },
                        className
                    )}
                    onClick={handleClose}
                >
                    <Link
                        className={cn(
                            'flex h-full w-full items-center dark:text-dark-primary-1 md:justify-center',
                            {
                                'justify-center': onlyIcon,
                                'text-blue dark:text-blue': isActived,
                            }
                        )}
                        href={link.path || '/'}
                    >
                        <Icon />
                        {!onlyIcon && (
                            <span className="ml-2 text-xs  lg:hidden">
                                {link.name}
                            </span>
                        )}
                    </Link>
                </li>
            </Tooltip>
        );
    },
    Group: (props: GroupItem) => {
        const { data: group } = props;
        return (
            <Button
                className="mb-2 w-full justify-start rounded-xl"
                variant={'default'}
                href={`/groups/${group._id}`}
            >
                <div className="relative h-8 w-8">
                    <Image
                        className="overflow-hidden rounded-full object-cover"
                        src={group.avatar || '/assets/img/group-avatar.jpg'}
                        alt={group.name || ''}
                        fill
                    />
                </div>

                <Link
                    className="ml-2 max-w-[calc(100%-50px)] overflow-hidden overflow-ellipsis"
                    href={`/groups/${group._id}`}
                >
                    <p className="whitespace-nowrap text-sm dark:text-dark-primary-1 lg:hidden">
                        {group.name}
                    </p>
                </Link>
            </Button>
        );
    },
};

export default Items;
