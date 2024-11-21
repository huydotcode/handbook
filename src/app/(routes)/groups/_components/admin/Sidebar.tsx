'use client';
import { Avatar, Button, Icons, Modal } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { ConversationService } from '@/lib/services';
import logger from '@/utils/logger';
import TimeAgoConverted from '@/utils/timeConvert';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSocket } from '@/context';

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
    const [showModalCreateConversation, setShowModalCreateConversation] =
        useState<boolean>(false);

    const [conversations, setConversations] =
        useState<IConversation[]>(initConversations);

    const { data: session } = useSession();
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

    const createGroupConversation = async (data: FormData) => {
        if (!session) return toast.error('Chưa đăng nhập');

        try {
            const newConversation =
                await ConversationService.createConversation({
                    creator: session.user.id,
                    participantsUserId: currentGroup.members.map(
                        (mem) => mem.user._id
                    ),
                    title: data.name,
                    groupId: currentGroup._id,
                });

            if (newConversation) {
                toast.success('Tạo cuộc hội thoại thành công!');
                setShowModalCreateConversation(false);
                setConversations([...conversations, newConversation]);

                socket?.emit(socketEvent.JOIN_ROOM, {
                    conversationId: newConversation._id,
                });
            }
        } catch (error) {
            logger({
                message: 'Error create group conversation in sidebar' + error,
                type: 'error',
            });
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
                            <Avatar imgSrc={currentGroup.avatar} rounded="sm" />
                        </div>

                        <div className="ml-2 flex flex-1 flex-col">
                            <p className="text-sm dark:text-dark-primary-1 md:hidden">
                                {currentGroup.name}
                            </p>

                            <p className="text-xs text-secondary-1 lg:hidden">
                                Lần hoạt động gần nhất:
                                <TimeAgoConverted
                                    time={currentGroup.lastActivity}
                                />
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-2">
                        <h5 className="md:hidden">
                            Các cuộc hội thoại của nhóm
                        </h5>

                        <div className="flex flex-col space-y-2">
                            {conversations.map((conversation) => (
                                <Button
                                    href={`/messages/${conversation._id}`}
                                    key={conversation._id}
                                    className="flex items-center rounded-md bg-secondary-1 dark:bg-dark-secondary-2"
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
                                <span className="md:hidden">
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
