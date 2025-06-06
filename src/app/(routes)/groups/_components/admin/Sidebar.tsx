'use client';
import SidebarCollapse from '@/components/layout/SidebarCollapse';
import { Avatar, Icons, Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocket } from '@/context';
import { GroupUserRole } from '@/enums/GroupRole';
import useBreakPoint from '@/hooks/useBreakpoint';
import { createConversation } from '@/lib/actions/conversation.action';
import { cn } from '@/lib/utils';
import { timeConvert } from '@/utils/timeConvert';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
    conversations: IConversation[];
}

interface FormData {
    name: string;
}

const Sidebar: React.FC<Props> = ({
    group: currentGroup,
    conversations: initConversations,
}) => {
    const { socket } = useSocket();
    const { data: session } = useSession();
    const { breakpoint } = useBreakPoint();
    const isMobile = breakpoint === 'sm' || breakpoint === 'md';

    const [showModalCreateConversation, setShowModalCreateConversation] =
        useState<boolean>(false);
    const [conversations, setConversations] =
        useState<IConversation[]>(initConversations);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const canCreateConversation = useMemo(() => {
        return currentGroup.members.some(
            (member) =>
                member.user._id === session?.user?.id &&
                member.role === GroupUserRole.ADMIN
        );
    }, [currentGroup, session]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate: createGroupConversation, isPending } = useMutation({
        mutationFn: createConversation,
        onSuccess: (newConversation) => {
            toast.success('Tạo cuộc hội thoại thành công!');
            setShowModalCreateConversation(false);
            setConversations((prev) => [...prev, newConversation]);

            for (const mem of currentGroup.members) {
                socket?.emit(socketEvent.JOIN_ROOM, {
                    roomId: newConversation._id,
                    userId: mem.user._id,
                });
            }
        },
        onError: () => {
            toast.error(
                'Có lỗi xảy ra khi tạo hội thoại, vui lòng thử lại sau!'
            );
        },
    });

    const mutateCreateConversation = (data: FormData) => {
        if (!session) return toast.error('Chưa đăng nhập');
        createGroupConversation({
            creator: session.user.id,
            participantsUserId: [session.user.id],
            title: data.name,
            groupId: currentGroup._id,
            type: 'group',
            status: 'active',
        });
    };

    const isCreator = currentGroup.creator._id === session?.user?.id;

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile]);

    return (
        <>
            <SidebarCollapse>
                <div className="flex">
                    <Avatar
                        imgSrc={currentGroup.avatar.url}
                        rounded="sm"
                        width={40}
                        height={40}
                    />

                    <div className="ml-2 flex flex-1 flex-col">
                        <p className="dark:text-dark-primary-1">
                            {currentGroup.name}
                        </p>

                        <p className="text-xs text-secondary-1">
                            Hoạt động gần nhất:{' '}
                            {timeConvert(currentGroup.updatedAt.toString())}
                        </p>
                    </div>
                </div>

                {isCreator && (
                    <div className={'mt-4 flex w-full flex-col'}>
                        <h1 className="font-semibold">Quản lý nhóm</h1>

                        <Button
                            className="justify-start"
                            href={`/groups/${currentGroup._id}/manage/posts`}
                            variant={'ghost'}
                            size={'sm'}
                        >
                            <Icons.Posts className="h-6 w-6" />
                            <span>Quản lý bài viết</span>
                        </Button>

                        <Button
                            className="justify-start"
                            href={`/groups/${currentGroup._id}/manage`}
                            variant={'ghost'}
                            size={'sm'}
                        >
                            <Icons.Edit className="h-6 w-6" />
                            <span>Cài đặt nhóm</span>
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    <div className="mt-2">
                        <h1 className="font-semibold">Đoạn chat đã tham gia</h1>

                        <div className="flex flex-col pt-1">
                            {conversations
                                .filter(
                                    (conversation) =>
                                        conversation.participants.some(
                                            (p) => p._id === session?.user.id
                                        ) && conversation.type === 'group'
                                )
                                .map((conversation) => (
                                    <Button
                                        href={`/messages/${conversation._id}`}
                                        key={conversation._id}
                                        variant={'ghost'}
                                        size={'sm'}
                                    >
                                        <Icons.Message className="h-6 w-6" />
                                        <div className="flex flex-1 flex-col">
                                            <p className="text-sm dark:text-dark-primary-1">
                                                {conversation.title}
                                            </p>
                                        </div>
                                    </Button>
                                ))}
                        </div>
                    </div>

                    <div className="mt-2">
                        <h1 className="font-semibold">
                            Các đoạn chat của nhóm
                        </h1>

                        <div className="flex flex-col pt-1">
                            {conversations
                                .filter(
                                    (conversation) =>
                                        conversation.participants.some(
                                            (p) => p._id !== session?.user.id
                                        ) && conversation.type === 'group'
                                )
                                .map((conversation) => (
                                    <Button
                                        href={`/messages/${conversation._id}`}
                                        key={conversation._id}
                                        variant={'ghost'}
                                        size={'sm'}
                                    >
                                        <Icons.Message className="h-6 w-6" />
                                        <div className="flex flex-1 flex-col">
                                            <p className="text-sm dark:text-dark-primary-1">
                                                {conversation.title}
                                            </p>
                                        </div>
                                    </Button>
                                ))}
                        </div>
                    </div>
                </div>

                {canCreateConversation && (
                    <div>
                        <Button
                            variant={'primary'}
                            className="w-full"
                            onClick={() => setShowModalCreateConversation(true)}
                        >
                            <span className="text-sm">Tạo cuộc hội thoại</span>
                        </Button>
                    </div>
                )}

                <Modal
                    title="Tạo cuộc hội thoại"
                    show={showModalCreateConversation}
                    handleClose={() => setShowModalCreateConversation(false)}
                >
                    <form
                        onSubmit={handleSubmit(mutateCreateConversation)}
                        className="p-4"
                    >
                        <div>
                            <label htmlFor="name">Tên cuộc hội thoại</label>
                            <input
                                id="name"
                                className="my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1"
                                type="text"
                                placeholder="Tên cuộc hội thoại"
                                {...register('name', {
                                    required: true,
                                    maxLength: 50,
                                })}
                            />
                            <span className="text-red-500">
                                {errors.name &&
                                    'Tên cuộc hội thoại không trống và không được quá 50 ký tự'}
                            </span>
                        </div>

                        <div className="mt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={isPending}
                            >
                                Tạo
                            </Button>
                        </div>
                    </form>
                </Modal>
            </SidebarCollapse>

            {/* <div
                className={cn(
                    'fixed left-0 top-[64px] z-50 hidden items-center justify-center transition-all duration-300 ease-in-out md:flex',
                    {
                        'left-[300px]': isSidebarOpen,
                    }
                )}
            >
                <Button
                    className="rounded-l-none rounded-r-md bg-secondary-2 shadow-xl dark:bg-dark-secondary-2"
                    variant={'secondary'}
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                >
                    <Icons.Menu className="h-5 w-5" />
                </Button>
            </div>

            <div
                className={cn(
                    'no-scrollbar fixed left-0 top-[56px] z-10 h-[calc(100vh-56px)] w-[300px] overflow-scroll border-r-2 bg-secondary-1 p-2 transition-transform duration-300 ease-in-out dark:border-none dark:bg-dark-secondary-1',
                    {
                        'translate-x-0': isSidebarOpen,
                        '-translate-x-full': !isSidebarOpen && isMobile,
                    }
                )}
            >
                <div className="flex h-full flex-col p-2">
                    <div className="flex">
                        <Avatar
                            imgSrc={currentGroup.avatar.url}
                            rounded="sm"
                            width={40}
                            height={40}
                        />

                        <div className="ml-2 flex flex-1 flex-col">
                            <p className="dark:text-dark-primary-1">
                                {currentGroup.name}
                            </p>

                            <p className="text-xs text-secondary-1">
                                Hoạt động gần nhất:{' '}
                                {timeConvert(currentGroup.updatedAt.toString())}
                            </p>
                        </div>
                    </div>

                    {isCreator && (
                        <div className={'mt-4 flex w-full flex-col'}>
                            <h1 className="font-semibold">Quản lý nhóm</h1>

                            <Button
                                className="justify-start"
                                href={`/groups/${currentGroup._id}/manage/posts`}
                                variant={'ghost'}
                                size={'sm'}
                            >
                                <Icons.Posts className="h-6 w-6" />
                                <span>Quản lý bài viết</span>
                            </Button>

                            <Button
                                className="justify-start"
                                href={`/groups/${currentGroup._id}/manage`}
                                variant={'ghost'}
                                size={'sm'}
                            >
                                <Icons.Edit className="h-6 w-6" />
                                <span>Cài đặt nhóm</span>
                            </Button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto">
                        <div className="mt-2">
                            <h1 className="font-semibold">
                                Đoạn chat đã tham gia
                            </h1>

                            <div className="flex flex-col pt-1">
                                {conversations
                                    .filter(
                                        (conversation) =>
                                            conversation.participants.some(
                                                (p) =>
                                                    p._id === session?.user.id
                                            ) && conversation.type === 'group'
                                    )
                                    .map((conversation) => (
                                        <Button
                                            href={`/messages/${conversation._id}`}
                                            key={conversation._id}
                                            variant={'ghost'}
                                            size={'sm'}
                                        >
                                            <Icons.Message className="h-6 w-6" />
                                            <div className="flex flex-1 flex-col">
                                                <p className="text-sm dark:text-dark-primary-1">
                                                    {conversation.title}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                            </div>
                        </div>

                        <div className="mt-2">
                            <h1 className="font-semibold">
                                Các đoạn chat của nhóm
                            </h1>

                            <div className="flex flex-col pt-1">
                                {conversations
                                    .filter(
                                        (conversation) =>
                                            conversation.participants.some(
                                                (p) =>
                                                    p._id !== session?.user.id
                                            ) && conversation.type === 'group'
                                    )
                                    .map((conversation) => (
                                        <Button
                                            href={`/messages/${conversation._id}`}
                                            key={conversation._id}
                                            variant={'ghost'}
                                            size={'sm'}
                                        >
                                            <Icons.Message className="h-6 w-6" />
                                            <div className="flex flex-1 flex-col">
                                                <p className="text-sm dark:text-dark-primary-1">
                                                    {conversation.title}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {canCreateConversation && (
                        <div>
                            <Button
                                variant={'primary'}
                                className="w-full"
                                onClick={() =>
                                    setShowModalCreateConversation(true)
                                }
                            >
                                <span className="text-sm">
                                    Tạo cuộc hội thoại
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title="Tạo cuộc hội thoại"
                show={showModalCreateConversation}
                handleClose={() => setShowModalCreateConversation(false)}
            >
                <form
                    onSubmit={handleSubmit(mutateCreateConversation)}
                    className="p-4"
                >
                    <div>
                        <label htmlFor="name">Tên cuộc hội thoại</label>
                        <input
                            id="name"
                            className="my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1"
                            type="text"
                            placeholder="Tên cuộc hội thoại"
                            {...register('name', {
                                required: true,
                                maxLength: 50,
                            })}
                        />
                        <span className="text-red-500">
                            {errors.name &&
                                'Tên cuộc hội thoại không trống và không được quá 50 ký tự'}
                        </span>
                    </div>

                    <div className="mt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isPending}
                        >
                            Tạo
                        </Button>
                    </div>
                </form>
            </Modal> */}
        </>
    );
};
export default Sidebar;
