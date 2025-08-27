'use client';
import { Items } from '@/components/shared';
import {
    Avatar,
    Collapse,
    ConfirmModal,
    Icons,
    Modal,
    SlideShow,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { leaveConversation } from '@/lib/actions/conversation.action';
import ConversationService from '@/lib/services/conversation.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { usePinnedMessages } from './ChatBox';
import Message from './Message';
import SideHeader from './SideHeader';
import Image from '@/components/ui/image';

interface Props {
    conversation: IConversation;
    setOpenInfo: React.Dispatch<React.SetStateAction<boolean>>;
    messages: IMessage[];
}

const InfomationConversation: React.FC<Props> = ({
    conversation,
    setOpenInfo,
    messages,
}) => {
    const { data: session } = useSession();
    const { socketEmitor } = useSocket();
    const router = useRouter();
    const { invalidateConversations } = useQueryInvalidation();

    const [openSlideShow, setOpenSlideShow] = useState<boolean>(false);
    const [startImageIndex, setStartImageIndex] = useState<number>(0);

    const [openPinnedMessageModal, setOpenPinnedMessageModal] = useState(false);
    const [openArchiveMessageModal, setOpenArchiveMessageModal] =
        useState(false);

    const isGroup = useMemo(() => {
        return conversation.group ? true : false;
    }, [conversation.group]);
    const isPrivate = useMemo(() => {
        return conversation.type === 'private';
    }, [conversation.type]);

    const [openModalDeleteConversation, setOpenModalDeleteConversation] =
        useState<boolean>(false);

    const imagesInRoom = useMemo(() => {
        return (messages && messages.map((msg) => msg.media).flat()) || [];
    }, [messages]);

    const pinnedMessages = useMemo(
        () => messages?.filter((msg) => msg.isPin) || [],
        [messages]
    );

    const partner = useMemo(() => {
        if (conversation.group) {
            return null;
        } else {
            if (conversation.participants[0]._id === session?.user?.id) {
                return conversation.participants[1];
            } else {
                return conversation.participants[0];
            }
        }
    }, [conversation.group, conversation.participants, session?.user?.id]);

    const title = useMemo(() => {
        if (conversation.group) {
            return conversation.group.name;
        } else {
            return partner?.name;
        }
    }, [conversation.group, partner?.name]);

    const avatar = useMemo(() => {
        if (conversation.group) {
            return conversation.group.avatar.url;
        } else {
            return partner?.avatar;
        }
    }, [conversation.group, partner?.avatar]);

    const handleOutConversation = async () => {
        if (!conversation._id || !session?.user) return;

        try {
            if (isPrivate) {
                await ConversationService.deleteByUser({
                    conversationId: conversation._id,
                    userId: session.user.id,
                });

                toast.success('Xóa đoạn hội thoại thành công');
            }

            if (isGroup) {
                await leaveConversation({
                    conversationId: conversation._id,
                    userId: session.user.id,
                });

                toast.success('Rời đoạn hội thoại thành công');
            }

            router.push('/messages');

            await invalidateConversations();

            socketEmitor.leaveRoom({
                roomId: conversation._id,
                userId: session?.user?.id,
            });
        } catch (error) {
            toast.error(
                'Có lỗi khi rời hoặc xóa đoạn hội thoại. Vui lòng thử lại sau!'
            );
        }
    };

    const items = [
        {
            key: 'infomation-chat',
            label: 'Thông tin về đoạn chat',
            children: (
                <div>
                    {isGroup && (
                        <>
                            <Button
                                className={'mb-2 w-full justify-start'}
                                variant={'ghost'}
                                href={`/groups/${conversation.group?._id}`}
                            >
                                <Icons.Group className="h-5 w-5" />
                                <p className="ml-2 text-xs">
                                    Truy cập {conversation?.group?.name}
                                </p>
                            </Button>

                            <Button
                                className={'mb-2 w-full justify-start'}
                                variant={'ghost'}
                                onClick={() => {
                                    window.navigator.clipboard.writeText(
                                        `${window.location.origin}/messages/${conversation?._id}`
                                    );

                                    toast.success(
                                        'Đã sao chép liên kết đoạn chat'
                                    );
                                }}
                            >
                                <Icons.Link className="h-5 w-5" />
                                <p className="ml-2 text-xs">
                                    Sao chép liên kết
                                </p>
                            </Button>
                        </>
                    )}

                    <Button
                        className={'mb-2 w-full justify-start'}
                        variant={'ghost'}
                        onClick={() => {
                            setOpenPinnedMessageModal(true);
                        }}
                    >
                        <Icons.Pin className="h-5 w-5" />
                        <p className="ml-2 text-xs">Tin nhắn đã ghim</p>
                    </Button>
                </div>
            ),
        },
        {
            key: 'member',
            label: 'Thành viên',
            children: (
                <div>
                    {conversation.participants.slice(0, 5).map((part) => (
                        <Items.User
                            className={'h-10 text-xs shadow-none'}
                            data={part}
                            key={part._id}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: 'file-attachment',
            label: 'File đính kèm',
            children: (
                <>
                    <div className="grid max-h-[200px] grid-cols-2 gap-2 overflow-y-scroll">
                        {imagesInRoom.map((img, i) => (
                            <div className={'relative h-16 w-full'} key={i}>
                                <Image
                                    className="absolute cursor-pointer rounded-md object-cover"
                                    fill
                                    key={i}
                                    quality={100}
                                    src={img.url}
                                    alt="image"
                                    onClick={() => {
                                        setStartImageIndex(i);
                                        setOpenSlideShow(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {imagesInRoom.length === 0 && (
                        <p className="text-center text-xs text-secondary-1">
                            Không có file đính kèm nào
                        </p>
                    )}
                </>
            ),
        },
    ];

    return (
        <div className="relative ml-2 flex h-full max-h-screen w-full flex-col overflow-y-scroll rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none md:flex-1 sm:ml-0">
            <SideHeader
                title="Thông tin"
                handleClickBack={() => setOpenInfo(false)}
            />

            <div className="mt-2 flex flex-col items-center px-4">
                <Avatar imgSrc={avatar} width={64} height={64} />
                <h1 className="mt-2">{title}</h1>
                {partner && (
                    <div>
                        <p className="text-center text-xs text-secondary-1">
                            {partner.isOnline ? 'Online' : 'Offline'}
                        </p>

                        <div className="flex gap-2 pt-2">
                            <div className="flex flex-col items-center">
                                <Button
                                    className="flex flex-col rounded-full"
                                    href={`/profile/${partner._id}`}
                                >
                                    <Icons.Profile size={24} />
                                </Button>

                                <h5 className="mt-2 text-xs">Trang cá nhân</h5>
                            </div>
                        </div>
                    </div>
                )}

                <Collapse
                    className={'mt-2 w-full bg-transparent text-xs'}
                    items={items}
                />

                <Button
                    className={'w-full justify-start'}
                    variant={'ghost'}
                    onClick={() => {
                        setOpenModalDeleteConversation(true);
                    }}
                >
                    <Icons.Delete className="h-5 w-5" />
                    <p className="ml-2 text-xs">
                        {isPrivate
                            ? 'Xóa đoạn chat'
                            : isGroup
                              ? 'Rời đoạn chat'
                              : 'Xóa đoạn chat'}
                    </p>
                </Button>
            </div>

            <SlideShow
                show={openSlideShow}
                setShow={setOpenSlideShow}
                images={imagesInRoom}
                startIndex={startImageIndex}
            />

            {openPinnedMessageModal && (
                <PinnedMessagesModal
                    conversationId={conversation._id}
                    handleClose={() => setOpenPinnedMessageModal(false)}
                />
            )}

            <ConfirmModal
                cancelText="Huỷ"
                confirmText={
                    isPrivate
                        ? 'Xóa đoạn chat'
                        : isGroup
                          ? 'Rời đoạn chat'
                          : 'Xóa đoạn chat'
                }
                message={`Bạn có chắc chắn muốn ${
                    isPrivate ? 'xóa' : isGroup ? 'rời' : 'xóa'
                } đoạn chat này?`}
                onClose={() => setOpenModalDeleteConversation(false)}
                onConfirm={handleOutConversation}
                open={openModalDeleteConversation}
                setShow={setOpenModalDeleteConversation}
                title={`${isPrivate ? 'Xóa' : isGroup ? 'Rời' : 'Xóa'} đoạn chat`}
            />
        </div>
    );
};

const PinnedMessagesModal = ({
    conversationId,
    handleClose,
}: {
    handleClose: () => void;
    conversationId: string;
}) => {
    const { data: pinnedMessages } = usePinnedMessages(conversationId);
    const router = useRouter();

    return (
        <Modal
            width="500px"
            show={true}
            handleClose={handleClose}
            title="Tin nhắn đã ghim"
        >
            <div className="flex max-h-[400px] w-full flex-col overflow-y-scroll">
                {pinnedMessages && pinnedMessages.length > 0 ? (
                    pinnedMessages.map((msg) => (
                        <Message
                            key={msg._id}
                            data={msg}
                            messages={pinnedMessages}
                            isPin
                            isSearchMessage
                            handleClick={() => {
                                router.push(
                                    `/messages/${msg.conversation._id}?find_msg=${msg._id}`
                                );
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center text-xs text-secondary-1">
                        Không có tin nhắn nào được ghim
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default InfomationConversation;
