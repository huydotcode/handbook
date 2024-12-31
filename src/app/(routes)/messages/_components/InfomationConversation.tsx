import { Items } from '@/components/shared';
import { Avatar, Button, Collapse, Icons, SlideShow } from '@/components/ui';
import { useMessages } from '@/context/SocialContext';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    conversation: IConversation;
    openInfo: boolean;
    setOpenInfo: React.Dispatch<React.SetStateAction<boolean>>;
    messages: IMessage[];
}

const InfomationConversation: React.FC<Props> = ({
    conversation,
    openInfo,
    setOpenInfo,
    messages,
}) => {
    const { data: session } = useSession();

    const [openSlideShow, setOpenSlideShow] = useState<boolean>(false);
    const [startImageIndex, setStartImageIndex] = useState<number>(0);

    const imagesInRoom = useMemo(() => {
        return (messages && messages.map((msg) => msg.images).flat()) || [];
    }, [messages]);

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
    }, [conversation]);

    const title = useMemo(() => {
        if (conversation.group) {
            return conversation.group.name;
        } else {
            return partner?.name;
        }
    }, [conversation]);

    const avatar = useMemo(() => {
        if (conversation.group) {
            return conversation.group.avatar;
        } else {
            return partner?.avatar;
        }
    }, [conversation]);

    const items = [
        {
            key: '1',
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
            key: '2',
            label: 'File đính kèm',
            children: (
                <div className="grid grid-cols-2 gap-2 overflow-y-scroll">
                    {imagesInRoom.map((img, i) => (
                        <div className={'relative h-16 w-full'}>
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
            ),
        },
    ];

    return (
        <div className="relative ml-2 flex h-full max-h-screen min-w-[220px] flex-col overflow-y-scroll rounded-xl bg-white p-4 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none md:flex-1">
            <Button
                className="absolute left-2 top-2 hidden md:block"
                onClick={() => setOpenInfo(false)}
                variant={'event'}
            >
                <Icons.ArrowBack size={24} />
            </Button>

            <div className="flex flex-col items-center">
                <Avatar imgSrc={avatar} width={64} height={64} />
                <h1 className="mt-2">{title}</h1>
                {partner && (
                    <div>
                        <p className="text-center">
                            {partner.isOnline ? 'Online' : 'Offline'}
                        </p>

                        <div className="flex gap-2 pt-2">
                            <Tooltip title="Trang cá nhân">
                                <Button
                                    className="flex flex-col rounded-full"
                                    href={`/profile/${partner._id}`}
                                >
                                    <Icons.Profile size={24} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )}

                <Collapse
                    className={'mt-2 w-full bg-transparent'}
                    items={items}
                />
            </div>

            <SlideShow
                show={openSlideShow}
                setShow={setOpenSlideShow}
                images={imagesInRoom.map((img) => img.url)}
                startIndex={startImageIndex}
            />
        </div>
    );
};

export default InfomationConversation;
