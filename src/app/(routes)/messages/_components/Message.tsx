'use client';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
import MessageContent from './MessageContent';
import ReadMessage from './ReadMessage';
import { useInView } from 'react-intersection-observer';
import { useSocket } from '@/context';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';

interface Props {
    data: IMessage;
    messages: IMessage[];
    handleClick?: () => void;
    searchMessage?: string;
    isSearchMessage?: boolean;
    ref?: React.RefObject<HTMLDivElement>;
    isLastMessage?: boolean;
    isPin?: boolean;
}

const Message: React.FC<Props> = React.memo<Props>(
    ({
        data: msg,
        messages,
        handleClick = () => {},
        searchMessage,
        isSearchMessage = false,
        isLastMessage,
        isPin = false,
    }) => {
        const { data: session } = useSession();
        const { ref: messageRef, inView } = useInView({
            threshold: 0.1,
            triggerOnce: true,
        });
        const { socketEmitor } = useSocket();
        const { queryClientReadMessage } = useQueryInvalidation();

        const isFindMessage =
            searchMessage && searchMessage === msg._id && isSearchMessage
                ? true
                : false;
        const index = messages.findIndex((m) => m._id === msg._id);
        const isOwnMsg = msg.sender._id === session?.user.id;
        const isGroupMsg = msg.conversation.group ? true : false;

        // Nếu đang inview và là tin nhắn cuối sẽ xử lý readmessage
        useEffect(() => {
            if (
                inView &&
                isLastMessage &&
                session?.user?.id &&
                msg.sender._id !== session.user.id
            ) {
                queryClientReadMessage(msg.conversation._id, session.user.id);
                socketEmitor.readMessage({
                    roomId: msg.conversation._id,
                    userId: session.user.id,
                });
            }
        }, [
            inView,
            isLastMessage,
            session?.user?.id,
            msg.conversation._id,
            msg.sender._id,
            socketEmitor,
            queryClientReadMessage,
        ]);

        return (
            <div
                id={msg._id + (isPin ? 'pinned' : '')}
                key={msg._id}
                className={cn('relative flex w-full', {
                    'justify-end': isOwnMsg,
                    'justify-start': !isOwnMsg,
                })}
                ref={messageRef}
            >
                <div
                    className={cn('relative flex w-full', {
                        'flex-row-reverse': isOwnMsg,
                        'w-full items-center': isGroupMsg,
                    })}
                >
                    <div
                        className={cn(
                            'relative mb-1 flex w-full items-center text-xs',
                            {
                                'flex-row-reverse items-end rounded-xl rounded-r-md text-white':
                                    isOwnMsg,
                                'rounded-xl rounded-l-md': !isOwnMsg,
                                'border-2 border-yellow-300': isFindMessage,
                                'cursor-pointer': isSearchMessage,
                                'bg-transparent': msg.text.length === 0,
                                'px-2': isGroupMsg,
                                'mx-2 border-none': isPin,
                            }
                        )}
                    >
                        {msg.conversation.group && !isOwnMsg && (
                            <div
                                className={cn(
                                    'relative flex h-8 w-8 items-center p-2',
                                    {
                                        'mr-2 pr-4': !isOwnMsg,
                                        'ml-2 pl-4': isOwnMsg,
                                    }
                                )}
                            >
                                {messages[index + 1]?.sender._id !==
                                    msg?.sender?._id && (
                                    <Avatar imgSrc={msg.sender.avatar} fill />
                                )}
                            </div>
                        )}

                        <div
                            className={cn('flex w-full flex-1 flex-col', {
                                'items-end': isOwnMsg,
                                'items-start': !isOwnMsg,
                            })}
                        >
                            {!isPin &&
                                msg.conversation.group &&
                                messages[index + 1]?.sender._id !==
                                    msg?.sender?._id &&
                                !isOwnMsg && (
                                    <div
                                        className={cn(
                                            'text-xs text-primary-1 dark:text-dark-primary-1',
                                            {
                                                'ml-1': !isOwnMsg,
                                                'mr-1': isOwnMsg,
                                            }
                                        )}
                                    >
                                        {msg.sender.name}
                                    </div>
                                )}

                            {isPin && (
                                <div
                                    className={cn(
                                        'text-xs text-primary-1 dark:text-dark-primary-1',
                                        {
                                            'ml-1': !isOwnMsg,
                                            'mr-1': isOwnMsg,
                                        }
                                    )}
                                >
                                    {msg.sender.name}
                                </div>
                            )}

                            <MessageContent
                                handleClick={handleClick}
                                isLastMessage={isLastMessage}
                                isPin={isPin}
                                isSearchMessage={isSearchMessage}
                                messages={messages}
                                msg={msg}
                                searchMessage={searchMessage}
                            />

                            <ReadMessage
                                index={index}
                                isOwnMsg={isOwnMsg}
                                msg={msg}
                                isSearchMessage={isSearchMessage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

Message.displayName = 'Message';

export default Message;
