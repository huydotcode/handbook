'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui';
import ChatHeader from './ChatHeader';
import InputMessage from './InputMessage';

interface IFormData {
    text: string;
}

const ChatWithGemini = () => {
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [messages, setMessages] = useState<GemimiChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const form = useForm<IFormData>();

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-3 right-3 z-10 w-fit md:hidden">
            {!openChat && (
                <Button
                    onClick={() => setOpenChat((prev) => !prev)}
                    className="flex items-center justify-center rounded-xl bg-white px-4 shadow-lg"
                >
                    <Image
                        src={'/assets/img/Google_Gemini_logo.svg.png'}
                        alt="Gemini"
                        width={64}
                        height={64}
                    />
                </Button>
            )}

            {openChat && (
                <div
                    className={cn(
                        'relative flex h-full w-[30vw] min-w-[300px] flex-1 flex-col rounded-xl bg-white p-2 shadow-xl transition-all duration-200 dark:bg-dark-secondary-1 dark:shadow-none',
                        {
                            'h-0 w-0 p-0 transition-none': !openChat,
                        }
                    )}
                >
                    {openChat && (
                        <>
                            <ChatHeader setOpenChat={setOpenChat} />

                            <div className="relative flex h-[30vh] w-full flex-col-reverse overflow-y-auto overflow-x-hidden p-2">
                                <div ref={bottomRef}></div>

                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            'mb-2 flex flex-col items-start',
                                            {
                                                'items-end': !msg.isGemini,
                                            }
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex max-w-[70%] items-center rounded-xl px-2 py-1',
                                                {
                                                    'bg-primary-1 dark:bg-dark-secondary-2':
                                                        msg.isGemini,
                                                    'bg-primary-2 text-white':
                                                        !msg.isGemini,
                                                }
                                            )}
                                        >
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <InputMessage
                                form={form}
                                setMessages={setMessages}
                            />
                        </>
                    )}
                </div>
            )}

            {/* {showScrollDown && (
                        <Button
                            className={cn(
                                'absolute bottom-0 left-1/2 z-50 w-fit -translate-x-1/2 opacity-30 transition-all duration-300 hover:opacity-100'
                            )}
                            onClick={handleScrollDown}
                        >
                            <Icons.ArrowDown className="h-4 w-4" />
                        </Button>
                    )} */}
        </div>
    );
};

export default ChatWithGemini;
