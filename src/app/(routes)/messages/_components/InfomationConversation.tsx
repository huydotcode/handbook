'use client';
import { Items } from '@/components/shared';
import { Avatar, Collapse, Icons, Modal, SlideShow } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import SideHeader from './SideHeader';
import Message from './Message';
import { useRouter } from 'next/navigation';
import { usePinnedMessages } from './ChatBox';

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

    const [openSlideShow, setOpenSlideShow] = useState<boolean>(false);
    const [startImageIndex, setStartImageIndex] = useState<number>(0);

    const [openPinnedMessageModal, setOpenPinnedMessageModal] = useState(false);
    const [openArchiveMessageModal, setOpenArchiveMessageModal] =
        useState(false);

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

    const items = [
        {
            key: 'infomation-chat',
            label: 'Thông tin về đoạn chat',
            children: (
                // Tin nhắn đã ghim tin nhắn lưu trữ
                <div>
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
                    <Button
                        className={'mb-2 w-full justify-start'}
                        variant={'ghost'}
                    >
                        <Icons.Archive className="h-5 w-5" />
                        <p className="ml-2 text-xs">Tin nhắn đã lưu trữ</p>
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
