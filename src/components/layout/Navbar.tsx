'use client';
import { Items } from '@/components/shared';
import { Avatar } from '@/components/ui';
import { SkeletonAvatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { navbarLink, navLink } from '@/constants/navLink';
import { useSocket } from '@/context';
import { useNotifications } from '@/context/AppContext';
import { useDebounce } from '@/hooks';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { createConversationAfterAcceptFriend } from '@/lib/actions/conversation.action';
import {
    acceptFriend,
    createNotificationAcceptFriend,
    declineFriend,
    deleteNotification,
    getNotificationAddFriendByUserId,
    markAllAsRead,
} from '@/lib/actions/notification.action';
import { searchUsers } from '@/lib/actions/user.action';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { Collapse } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, {
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import DarkmodeButton from '../ui/DarkmodeButton';
import Icons from '../ui/Icons';

const Navbar = () => {
    const { data: session } = useSession();
    const [showPages, setShowPages] = useState<boolean>(false);
    const path = usePathname();
    const listNavRef = React.useRef<HTMLUListElement>(null);
    const menuButtonRef = React.useRef<HTMLButtonElement>(null);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                listNavRef.current &&
                !listNavRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setShowPages(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [listNavRef]);

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 h-14 w-screen shadow-md md:px-2">
            <div className="relative flex h-full w-full items-center justify-between px-5 md:px-1">
                <div className="flex w-1/4 items-center md:w-1/2">
                    <div className={'flex items-center justify-center'}>
                        <Link className="flex h-8 w-8 items-center" href={'/'}>
                            <Icons.Logo className="text-4xl text-primary-2" />
                        </Link>
                    </div>

                    <Searchbar />

                    <div className="ml-2 hidden md:block">
                        <Button
                            onClick={() => setShowPages((prev) => !prev)}
                            size={'md'}
                            variant={'ghost'}
                            ref={menuButtonRef}
                        >
                            <Icons.Menu />
                        </Button>
                    </div>
                </div>
                <div className="mx-auto flex h-full w-1/2 max-w-[400px] flex-1 items-center justify-center md:hidden">
                    <ul
                        className={
                            'top-14 flex h-full w-full items-center justify-between overflow-hidden bg-white dark:bg-dark-secondary-1'
                        }
                        ref={listNavRef}
                    >
                        {navbarLink.map((link) => {
                            if (
                                link.role === 'admin' &&
                                session?.user.role !== 'admin'
                            )
                                return null;

                            const isActived =
                                path === link.path ||
                                (path.includes(link.path) && link.path !== '/');
                            const Icon = () => {
                                return link.icon;
                            };

                            return (
                                <TooltipProvider key={link.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <li
                                                className={cn(
                                                    `flex h-full w-full cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1 md:rounded-xl`,
                                                    {
                                                        'border-b-4 border-b-blue':
                                                            isActived,
                                                    }
                                                )}
                                            >
                                                <Link
                                                    className={cn(
                                                        'flex h-full w-full items-center justify-center dark:text-dark-primary-1 md:justify-start',
                                                        {
                                                            'text-blue dark:text-blue':
                                                                isActived,
                                                        }
                                                    )}
                                                    href={link.path || '/'}
                                                >
                                                    <Icon />

                                                    <span className="ml-2 hidden text-xs md:block">
                                                        {link.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            {link.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </ul>
                </div>

                {showPages && (
                    <ul
                        className={
                            'fixed left-0 top-14 hidden w-[200px] flex-col items-center justify-between overflow-hidden rounded-b-xl bg-white p-2 shadow-xl dark:bg-dark-secondary-1 md:flex'
                        }
                        ref={listNavRef}
                    >
                        {navLink.map((link, index) => {
                            if (
                                link.role === 'admin' &&
                                session?.user.role !== 'admin'
                            )
                                return null;

                            const isActived =
                                path === link.path ||
                                (path.includes(link.path) && link.path !== '/');
                            const Icon = () => {
                                return link.icon;
                            };

                            return (
                                <TooltipProvider key={link.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <li
                                                key={index}
                                                className={cn(
                                                    `flex w-full cursor-pointer items-center p-2 hover:bg-hover-2 dark:hover:bg-dark-hover-1`,
                                                    {
                                                        'border-b-4 border-b-blue':
                                                            isActived,
                                                    }
                                                )}
                                            >
                                                <Link
                                                    className={cn(
                                                        'flex w-full items-center justify-center dark:text-dark-primary-1 md:justify-start',
                                                        {
                                                            'text-blue dark:text-blue':
                                                                isActived,
                                                        }
                                                    )}
                                                    href={link.path || '/'}
                                                    onClick={() =>
                                                        setShowPages(false)
                                                    }
                                                >
                                                    <Icon />

                                                    <span className="ml-2 hidden text-xs md:block">
                                                        {link.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {link.name}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </ul>
                )}
                <div className="flex h-full w-1/4 items-center justify-end md:w-1/2">
                    <div className="relative mr-4 flex items-center">
                        <DarkmodeButton />
                    </div>
                    <div className="mr-2 flex h-full items-center justify-center">
                        <NavNotification />
                    </div>
                    <div className="flex h-full items-center">
                        <NavUser />
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavNotification = () => {
    const { data: session } = useSession();
    const { data: notifications, isLoading } = useNotifications(
        session?.user?.id
    );
    const { invalidateNotifications } = useQueryInvalidation();
    const [open, setOpen] = useState(false);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            await invalidateNotifications(session?.user.id as string);
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    if (isLoading || !notifications) {
        return <SkeletonAvatar />;
    }

    return (
        <>
            <Popover
                onOpenChange={() => {
                    setOpen(!open);
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        className={'relative'}
                        size={'sm'}
                        variant={'ghost'}
                    >
                        {open ? (
                            <Icons.NotificationActive className="h-7 w-7" />
                        ) : (
                            <Icons.Notification className="h-7 w-7" />
                        )}

                        <Badge
                            className="absolute bottom-0 right-0 px-1 py-0 text-xs font-light"
                            variant={'secondary'}
                        >
                            {notifications.filter((n) => !n.isRead).length}
                        </Badge>
                    </Button>
                </PopoverTrigger>

                <PopoverContent asChild>
                    <div className="max-h-[50vh] min-h-[300px] w-[300px] overflow-x-hidden overflow-y-scroll px-4 py-2 dark:bg-dark-secondary-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text font-bold dark:text-dark-primary-1">
                                Thông báo
                            </h1>

                            <Button
                                className="p-0"
                                size={'xs'}
                                variant={'text'}
                            >
                                <h5 onClick={handleMarkAllAsRead}>
                                    Đánh dấu đã đọc
                                </h5>
                            </Button>
                        </div>

                        {notifications.map((notification) => {
                            return (
                                <NotificationItem
                                    key={notification._id}
                                    data={notification}
                                />
                            );
                        })}

                        {notifications.length == 0 && (
                            <div className="flex h-[200px] w-full items-center justify-center dark:text-dark-primary-1">
                                <p>Không có thông báo nào</p>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};

const NotificationItem = ({
    data: notification,
    showMessage = true,
}: {
    data: INotification;
    showMessage?: boolean;
}) => {
    const { data: session } = useSession();
    const { socket, socketEmitor } = useSocket();
    const { invalidateNotifications, invalidateFriends } =
        useQueryInvalidation();

    const [showRemove, setShowRemove] = useState(false);

    // Chấp nhận lời mời kết bạn // Xử lý phía người nhận
    const handleAcceptFriend = useCallback(async () => {
        try {
            const notificatonRequestAddFriend =
                await getNotificationAddFriendByUserId({
                    receiverId: notification.receiver._id,
                });

            if (!notificatonRequestAddFriend) {
                toast.error('Không tìm thấy thông báo. Vui lòng thử lại!');

                await invalidateNotifications(session?.user.id as string);

                return;
            }

            // Chấp nhận lời mời kết bạn
            const acceptSuccess = await acceptFriend({
                notification,
            });

            if (!acceptSuccess) {
                toast.error('Chấp nhận lời mời kết bạn thất bại!');
                return;
            }

            const newConversation = await createConversationAfterAcceptFriend({
                userId: notification.receiver._id,
                friendId: notification.sender._id,
            });

            if (!newConversation) {
                toast.error('Tạo cuộc trò chuyện thất bại!');
                return;
            }

            // Cập nhật lại danh sách bạn bè
            await invalidateNotifications(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);

            //Tạo thông báo cho người gửi
            const notificationAcceptFriend =
                await createNotificationAcceptFriend({
                    type: 'accept-friend',
                    senderId: notification.receiver._id,
                    receiverId: notification.sender._id,
                    message: 'Đã chấp nhận lời mời kết bạn',
                });

            if (socket) {
                // Join room
                socketEmitor.joinRoom({
                    roomId: newConversation._id,
                    userId: notification.receiver._id,
                });

                socketEmitor.joinRoom({
                    roomId: newConversation._id,
                    userId: notification.sender._id,
                });

                // Gửi thông báo cho người gửi
                socketEmitor.receiveNotification({
                    notification: notificationAcceptFriend,
                });
            }
        } catch (error) {
            toast.error(
                'Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại!'
            );
        }
    }, [
        invalidateFriends,
        invalidateNotifications,
        notification,
        session?.user.id,
        socket,
        socketEmitor,
    ]);

    // Từ chối lời mời kết bạn
    const handleDeclineFriend = async () => {
        try {
            await declineFriend({ notification });

            await invalidateNotifications(session?.user.id as string);
            await invalidateFriends(session?.user.id as string);
            toast.success('Đã từ chối lời mời kết bạn');
        } catch (error) {
            toast.error('Không thể từ chối lời mời kết bạn. Vui lòng thử lại!');
        }
    };

    const removeNotification = async () => {
        try {
            await deleteNotification({
                notificationId: notification._id,
            });

            await invalidateNotifications(session?.user.id as string);
            toast.success('Đã xóa thông báo');
        } catch (error) {
            toast.error('Không thể xóa thông báo. Vui lòng thử lại!');
        }
    };

    return (
        <>
            <div
                className="relative flex w-full items-center p-2"
                onMouseEnter={() => setShowRemove(true)}
                onMouseLeave={() => setShowRemove(false)}
            >
                <div className="mr-4">
                    <Avatar
                        width={40}
                        height={40}
                        imgSrc={notification.sender.avatar}
                        userUrl={notification.sender._id}
                    />
                </div>

                <div>
                    <p
                        className={cn(
                            'text-sm dark:text-dark-primary-1',
                            notification.isRead && 'text-secondary-2'
                        )}
                    >
                        <strong>{notification.sender.name}</strong>{' '}
                        {showMessage && notification.message}
                    </p>
                    {notification.type === 'request-add-friend' && (
                        <div className="mt-2 flex items-center">
                            <Button
                                className="mr-2"
                                variant={'primary'}
                                size={'sm'}
                                onClick={handleAcceptFriend}
                            >
                                {showMessage ? 'Chấp nhận' : <Icons.Tick />}
                            </Button>
                            <Button size={'sm'} onClick={handleDeclineFriend}>
                                {showMessage ? 'Từ chối' : <Icons.Close />}
                            </Button>
                        </div>
                    )}
                </div>

                <Button
                    className={cn(
                        'absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 transition-all duration-200 ease-in-out',
                        !showRemove && 'opacity-0',
                        showRemove && 'opacity-100'
                    )}
                    onClick={removeNotification}
                >
                    <Icons.Close />
                </Button>
            </div>
        </>
    );
};

const Searchbar = () => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const debounceValue = useDebounce(searchValue, 300);
    const inputRef = useRef(null) as React.RefObject<HTMLInputElement | null>;
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPagesize] = useState<number>(5);

    const router = useRouter();

    // Xử lý khi thay đổi input
    const handleChangeInput = useCallback((e: any) => {
        setSearchValue(e.target.value);
    }, []);

    // Xử lý khi đóng modal
    const handleClose = useCallback(() => {
        setSearchResult([]);
        setSearchValue('');
        setShowModal(false);
    }, []);

    // Fetch dữ liệu khi search
    useEffect(() => {
        const fetchSearchData = async (value: string) => {
            setIsSearching(true);

            if (!session?.user.id) return;

            try {
                const { users, isNext } = await searchUsers({
                    userId: session?.user.id,
                    pageNumber: page,
                    pageSize: pageSize,
                    searchString: value,
                    sortBy: 'desc',
                });

                setSearchResult(users);
            } catch (error: any) {
                logger({
                    message: 'Error fetch search data' + error,
                    type: 'error',
                });
            } finally {
                setIsSearching(false);
            }
        };

        if (debounceValue.trim().length > 0) {
            fetchSearchData(debounceValue);
        }
    }, [debounceValue, page, pageSize, session?.user.id]);

    // Đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div
                className="ml-3 flex h-10 items-center justify-center rounded-full bg-primary-1 px-3 dark:bg-dark-secondary-2"
                onClick={() => {
                    setShowModal(true);
                }}
            >
                {/* PC icon */}
                <div className="flex items-center text-lg lg:hidden">
                    <Icons.Search />
                </div>

                {/* Mobile icon*/}
                <label
                    className="hidden cursor-pointer items-center text-lg lg:flex"
                    onClick={() => setShowModal((prev) => !prev)}
                >
                    <Icons.Search />
                </label>

                <input
                    className="h-10 min-w-[170px] bg-transparent px-2 text-sm lg:hidden"
                    placeholder={'Tìm kiếm trên Handbook'}
                    value={searchValue}
                    onChange={handleChangeInput}
                    name="q"
                    dir="ltr"
                    autoComplete="off"
                    spellCheck="false"
                />
            </div>

            <Collapse in={showModal}>
                <div
                    className={
                        'fixed left-0 top-0 z-10 min-h-[200px] max-w-[30vw] rounded-b-xl bg-secondary-1 p-1 pl-5 shadow-md dark:bg-dark-secondary-1 md:max-w-screen'
                    }
                >
                    <div
                        className={
                            'flex h-12 w-full items-center bg-secondary-1 dark:bg-dark-secondary-1'
                        }
                    >
                        <Button
                            className="z-20 flex h-8 w-8 items-center justify-center rounded-full text-3xl"
                            variant={'custom'}
                            onClick={handleClose}
                        >
                            <Icons.Close />
                        </Button>

                        <div
                            className="ml-3 flex h-10 items-center justify-center rounded-full bg-primary-1 px-3 dark:bg-dark-secondary-2"
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                            <div className="flex items-center text-lg">
                                <Icons.Search />
                            </div>

                            <input
                                className="h-10 min-w-[170px] bg-transparent px-2 text-sm"
                                placeholder={'Tìm kiếm trên Handbook'}
                                ref={inputRef}
                                value={searchValue}
                                onChange={handleChangeInput}
                                name="q"
                                dir="ltr"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    <h5 className={'mt-2 text-sm'}>Kết quả</h5>

                    {searchResult.length > 0 &&
                        debounceValue.trim().length > 0 && (
                            <>
                                <div className="dark:no-scrollbar mt-2 w-full overflow-scroll">
                                    {searchResult.map((user: IUser) => {
                                        return (
                                            <Items.User
                                                data={user}
                                                key={user._id}
                                                handleHideModal={() => {
                                                    handleClose();
                                                    router.push(
                                                        `/profile/${user._id}`
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}

                    {!isSearching &&
                        searchResult.length === 0 &&
                        debounceValue.trim().length > 0 && (
                            <div className="mt-2 text-center text-sm">
                                Không có kết quả
                            </div>
                        )}

                    {isSearching && searchResult.length === 0 && (
                        <div className="mt-4 flex justify-center">
                            <Icons.Loading className="animate-spin text-2xl" />
                        </div>
                    )}

                    {!isSearching &&
                        searchResult.length == 0 &&
                        debounceValue.trim().length !== 0 && (
                            <div className={'flex justify-center'}>
                                <Button
                                    href={`/search?q=${debounceValue}`}
                                    variant={'text'}
                                >
                                    Xem tất cả kết quả: {debounceValue}
                                </Button>
                            </div>
                        )}
                </div>
            </Collapse>
        </>
    );
};

const NavUser = () => {
    const { data: session, status } = useSession();
    const [history, setHistory] = useState([{ data: [] as any }]);
    const currentHistory = history[history.length - 1] as any;

    const user = session?.user as ISessionUser;

    const handleLogout = async () => {
        await signOut();
    };

    const handleClose = () => {
        setHistory([{ data: [] }]);
    };

    if (status == 'loading' || !session?.user) {
        return <SkeletonAvatar />;
    }

    return (
        <>
            <Popover>
                <PopoverTrigger className={'ml-2 flex items-center'}>
                    <Image
                        className="cursor-pointer rounded-full"
                        width={40}
                        height={40}
                        src={(session?.user && session?.user.image) || ''}
                        alt="Your profile picture"
                        referrerPolicy="no-referrer"
                    />
                </PopoverTrigger>
                <PopoverContent align="start">
                    <div className="relative flex flex-col">
                        <div className="flex w-full items-center">
                            {currentHistory == history[0] ? (
                                <Link
                                    className="flex w-full items-center rounded-xl p-2 shadow-md hover:bg-hover-2 dark:text-dark-primary-1 dark:hover:bg-dark-hover-1"
                                    href={`/profile/${user.id}`}
                                >
                                    <div className="h-9 w-9 object-cover">
                                        <Image
                                            className="rounded-full"
                                            width={40}
                                            height={40}
                                            src={user?.image || ''}
                                            alt={user?.name || ''}
                                        />
                                    </div>
                                    <span className="ml-2">{user?.name}</span>
                                </Link>
                            ) : (
                                <>
                                    <Button
                                        className="mr-2 p-3"
                                        onClick={() =>
                                            setHistory((prev) =>
                                                prev.slice(0, prev.length - 1)
                                            )
                                        }
                                    >
                                        <Icons.ArrowLeft className="text-base" />
                                    </Button>
                                    <span>{currentHistory.title}</span>
                                </>
                            )}
                        </div>

                        <ul className=" pt-3">
                            {currentHistory.data.map((item: any) => {
                                const handleClick = () => {
                                    if (item.action) {
                                        item.action();
                                    }
                                    if (item.children) {
                                        setHistory(
                                            (prev: SetStateAction<any>) => [
                                                ...prev,
                                                item.children,
                                            ]
                                        );
                                    }

                                    if (!item.children) {
                                        handleClose();
                                    }
                                };

                                return (
                                    <Button
                                        className="relative flex h-[52px] w-full cursor-pointer items-center rounded-xl px-2 hover:bg-hover-2"
                                        key={item.title}
                                        onClick={handleClick}
                                    >
                                        {item.icon && (
                                            <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-full text-2xl">
                                                {item.icon()}
                                            </span>
                                        )}

                                        {item.title && (
                                            <h5 className="ml-2 text-base font-semibold">
                                                {item.title}
                                            </h5>
                                        )}

                                        {item.children && (
                                            <Icons.ArrowRight className="absolute right-2 text-2xl" />
                                        )}
                                    </Button>
                                );
                            })}

                            <Button
                                className="w-full"
                                variant={'secondary'}
                                onClick={handleLogout}
                            >
                                <Icons.LogOut className="mr-2 text-xl" />
                                Đăng xuất
                            </Button>
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default Navbar;
