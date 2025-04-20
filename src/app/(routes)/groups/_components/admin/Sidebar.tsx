'use client';
import { Avatar, Icons, Modal } from '@/components/ui';
import { useSocket } from '@/context';
import { createConversation } from '@/lib/actions/conversation.action';
import logger from '@/utils/logger';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { timeConvert } from '@/utils/timeConvert';
import socketEvent from '@/constants/socketEvent.constant';
import group from '@/models/Group';
import { useQueryClient } from '@tanstack/react-query';
import { getConversationsKey } from '@/lib/queryKey';

interface Props {
    group: IGroup;
    conversations: IConversation[];
}

interface FormData {
    name: string;
    desc: string;
}

const Sidebar: React.FC<Props> = ({
    group: currentGroup,
    conversations: initConversations,
}) => {
    const { socket } = useSocket();
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const [showModalCreateConversation, setShowModalCreateConversation] =
        useState<boolean>(false);
    const [conversations, setConversations] =
        useState<IConversation[]>(initConversations);

    const canCreateConversation = useMemo(() => {
        return currentGroup.members.some(
            (member) =>
                member.user._id === session?.user?.id && member.role === 'admin'
        );
    }, [currentGroup, session]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const isCreator = currentGroup.creator._id === session?.user?.id;

    const createGroupConversation = async (data: FormData) => {
        if (!session) return toast.error('Chưa đăng nhập');

        try {
            const newConversation = await createConversation({
                creator: session.user.id,
                participantsUserId: currentGroup.members.map(
                    (mem) => mem.user._id
                ),
                title: data.name,
                groupId: currentGroup._id,
                type: 'group',
            });

            if (newConversation) {
                toast.success('Tạo cuộc hội thoại thành công!');
                setShowModalCreateConversation(false);
                setConversations([...conversations, newConversation]);

                for (const mem of currentGroup.members) {
                    socket?.emit(socketEvent.JOIN_ROOM, {
                        roomId: newConversation._id,
                        userId: mem.user._id,
                    });
                }
            }

            queryClient.invalidateQueries({
                queryKey: getConversationsKey(session.user.id),
            });
        } catch (error) {
            toast.error(
                'Có lỗi xảy ra khi tạo hội thoại, vui lòng thử lại sau!'
            );
        }
    };

    return (
        <>
            <div className="no-scrollbar fixed left-0 top-[56px] h-[calc(100vh-56px)] w-[300px] overflow-scroll border-r-2 bg-secondary-1 p-2 dark:border-none dark:bg-dark-secondary-1 lg:w-[200px] md:w-[72px]">
                <div className="flex h-full flex-col">
                    <div className="flex p-2">
                        <div className="relative h-8 w-8">
                            <Avatar
                                imgSrc={currentGroup.avatar.url}
                                rounded="sm"
                            />
                        </div>

                        <div className="ml-2 flex flex-1 flex-col">
                            <p className="text-sm dark:text-dark-primary-1 md:hidden">
                                {currentGroup.name}
                            </p>

                            <p className="text-xs text-secondary-1 lg:hidden">
                                Hoạt động gần nhất:
                                {timeConvert(currentGroup.updatedAt.toString())}
                            </p>
                        </div>
                    </div>

                    {isCreator && (
                        <div className={'flex w-full flex-col gap-2'}>
                            <Button
                                href={`/groups/${currentGroup._id}/manage/posts`}
                                variant={'secondary'}
                                size={'sm'}
                            >
                                <Icons.Posts />
                                <span className={'md:hidden'}>
                                    Quản lý bài viết
                                </span>
                            </Button>

                            <Button
                                href={`/groups/${currentGroup._id}/manage`}
                                variant={'secondary'}
                                size={'sm'}
                            >
                                <Icons.Edit />
                                <span className={'md:hidden'}>
                                    Cài đặt nhóm
                                </span>
                            </Button>
                        </div>
                    )}

                    <div className="mt-2 flex-1">
                        <h5 className="md:hidden">
                            Các cuộc hội thoại của nhóm
                        </h5>

                        <div className="flex flex-col space-y-2 pt-1">
                            {conversations.map((conversation) => (
                                <Button
                                    href={`/messages/${conversation._id}`}
                                    key={conversation._id}
                                    variant={'default'}
                                >
                                    <div className="ml-2 flex flex-1 flex-col md:hidden">
                                        <p className="text-sm dark:text-dark-primary-1">
                                            {conversation.title}
                                        </p>
                                    </div>
                                </Button>
                            ))}
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
                                <span className="text-sm md:hidden">
                                    Tạo cuộc hội thoại
                                </span>
                                <span className="hidden md:block">
                                    <Icons.Plus className="h-4 w-4" />
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
                    onSubmit={handleSubmit(createGroupConversation)}
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

                    <div>
                        <label htmlFor="desc">Mô tả</label>
                        <input
                            id="desc"
                            className="my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1"
                            type="text"
                            placeholder="Tên cuộc hội thoại"
                            {...register('desc', {
                                required: true,
                                maxLength: 100,
                            })}
                        />
                        <span className="text-red-500">
                            {errors.desc &&
                                'Tên cuộc hội thoại không trống và không được quá 50 ký tự'}
                        </span>
                    </div>

                    <div className="mt-2">
                        <Button variant="primary" className="w-full">
                            Tạo
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
export default Sidebar;
