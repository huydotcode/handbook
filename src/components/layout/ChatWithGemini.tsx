'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Avatar, Icons, Loading } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@/config/api';
import MessageSkeleton from '../skeleton/MessageSkeleton';

interface IFormData {
    text: string;
}

const ChatWithGemini = () => {
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [messages, setMessages] = useState<GemimiChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const form = useForm<IFormData>();
    const {
        handleSubmit,
        register,
        reset,
        resetField,
        formState: { isSubmitting, isLoading, errors },
    } = form;
    const { mutate, isPending } = useMutation({ mutationFn: sendMessage });

    async function sendMessage(data: IFormData) {
        try {
            const { text } = data;

            if (text.trim().length === 0) {
                toast.error('Vui lòng nhập tin nhắn', {
                    id: 'text-is-required',
                });
                return;
            }

            setMessages((prev) => [
                {
                    text,
                    isGemini: false,
                    createAt: new Date(),
                },
                ...prev,
            ]);

            resetField('text');

            const textFromGemini = await fetch(API_ROUTES.GEMINI.CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text }),
            });

            const { response, result } = await textFromGemini.json();

            const textGemini = result.response.candidates[0].content.parts[0]
                .text as string;

            setMessages((prev) => [
                {
                    text: textGemini,
                    isGemini: true,
                    createAt: new Date(),
                },
                ...prev,
            ]);

            reset();
        } catch (error: any) {
            console.log(error);
            toast.error('Có lỗi khi gửi tin nhắn, vui lòng thử lại sau');
        }
    }

    async function onSubmit(data: IFormData) {
        if (isSubmitting || isLoading) return;

        mutate(data);
    }

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
                            <div className="flex h-14 items-center justify-between border-b p-2 dark:border-dark-secondary-2">
                                <div className="flex items-center">
                                    <Avatar
                                        imgSrc={
                                            '/assets/img/Google_Gemini_logo.svg.png'
                                        }
                                        alt="Gemini"
                                        className="h-10 w-10 object-contain"
                                    />

                                    <div className="flex flex-col">
                                        <h3 className="ml-2 text-sm">
                                            Trò chuyện cùng Gemini
                                        </h3>
                                    </div>
                                </div>

                                <Button
                                    variant={'secondary'}
                                    onClick={() => setOpenChat(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </Button>
                            </div>

                            <div className="relative flex h-[30vh] w-full flex-col-reverse overflow-y-auto overflow-x-hidden p-2">
                                <div ref={bottomRef}></div>
                                {isPending && (
                                    <div className="w-[70%]">
                                        <MessageSkeleton />
                                    </div>
                                )}

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
                                                'flex max-w-[70%] items-center rounded-lg px-2 py-1',
                                                {
                                                    'bg-primary-1 dark:bg-dark-secondary-2':
                                                        msg.isGemini,
                                                    'bg-primary-2 text-white':
                                                        !msg.isGemini,
                                                }
                                            )}
                                        >
                                            <p className={'text-sm'}>
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <p className="mx-4 text-center text-xs text-gray-500 dark:text-gray-400">
                                    Dữ liệu đoạn chat này không được lưu trữ và
                                    sẽ biến mất khi bạn rời khỏi trang.
                                </p>
                            </div>

                            <form
                                className="relative overflow-hidden rounded-xl border bg-transparent shadow-xl"
                                onSubmit={handleSubmit(onSubmit)}
                                autoComplete="off"
                            >
                                <div className="flex w-full">
                                    <input
                                        {...register('text', {
                                            required: {
                                                message:
                                                    'Vui lòng nhập bình luận',
                                                value: true,
                                            },
                                        })}
                                        className="flex-1 px-4 py-2 text-sm"
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                        spellCheck={false}
                                        autoComplete="off"
                                    />

                                    <Button
                                        className="rounded-none border-l text-base"
                                        variant={'event'}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <Icons.Loading className="animate-spin" />
                                        ) : (
                                            <Icons.Send />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatWithGemini;
