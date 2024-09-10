'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import InputMessage from './InputMessage';
import { Button } from './ui';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

const ChatWithGemini = () => {
    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState<GemimiChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-3 right-3 z-10">
            {!openChat && (
                <Button
                    onClick={() => setOpenChat(!openChat)}
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
                <div className="relative flex h-full w-[30vw] min-w-[300px] flex-1 flex-col rounded-xl bg-white p-2 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
                    <ChatHeader setOpenChat={setOpenChat} />

                    <div className="relative h-[30vh] w-full overflow-y-auto overflow-x-hidden p-2">
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
                                        'flex items-center rounded-xl px-2 py-1',
                                        {
                                            'bg-primary-1 dark:bg-dark-secondary-2':
                                                msg.isGemini,
                                            'bg-primary-2 text-white':
                                                !msg.isGemini,
                                        }
                                    )}
                                >
                                    <div
                                        className="text-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                msg.text
                                            ),
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div ref={bottomRef}></div>
                    </div>

                    <InputMessage setMessages={setMessages} />

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
            )}
        </div>
    );
};

export default ChatWithGemini;
