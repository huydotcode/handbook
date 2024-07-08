'use client';
import { Button, Icons } from '@/components/ui';
import { ConversationService } from '@/lib/services';
import { cn } from '@/lib/utils';
import TimeAgoConverted from '@/utils/timeConvert';
import { Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        const { data: session } = useSession();
        const isOnline = friend.isOnline;

        const { data: conversation } = useQuery(
            ['conversation', friend._id, session?.user.id],
            () =>
                ConversationService.getConversationByParticipants({
                    otherUserId: friend._id || '',
                    userId: session?.user.id || '',
                }),
            {
                enabled: !!friend._id && !!session?.user.id,
            }
        );

        if (!session) return null;

        const items: MenuProps['items'] = [
            {
                key: '1',
                label: (
                    <Link href={`/profile/${friend._id}`}>Trang cá nhân</Link>
                ),
                icon: <Icons.Users />,
            },
            {
                key: '2',
                label: (
                    <Link href={`/messages/${conversation?._id}`}>
                        Nhắn tin
                    </Link>
                ),
                icon: <Icons.Message />,
            },
        ];

        return (
            <Dropdown
                trigger={['click', 'hover']}
                menu={{ items }}
                placement="bottomCenter"
                autoFocus
            >
                <Button
                    variant={'custom'}
                    className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:w-auto lg:justify-center"
                    key={friend._id}
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
            </Dropdown>
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
                className="mb-2 w-full justify-start"
                variant={'default'}
                href={`/groups/${group._id}`}
            >
                <div className="relative h-8 w-8">
                    <Image
                        className="overflow-hidden rounded-full object-cover"
                        src={group.avatar || ''}
                        alt={group.name || ''}
                        fill
                    />
                </div>

                <div className="ml-2 flex flex-1 flex-col">
                    <p className="text-sm dark:text-dark-primary-1 md:hidden">
                        {group.name}
                    </p>

                    <p className="text-xs text-secondary-1 lg:hidden">
                        Lần hoạt động gần nhất:
                        <TimeAgoConverted
                            className=""
                            time={group.lastActivity}
                        />
                    </p>
                </div>
            </Button>
        );
    },
};

export default Items;
