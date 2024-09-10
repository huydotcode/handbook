'use client';
import { Button, Icons } from '@/components/ui';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    setMessages: React.Dispatch<React.SetStateAction<GemimiChatMessage[]>>;
}

interface IFormData {
    text: string;
}

const InputMessage: React.FC<Props> = ({ setMessages }) => {
    const {
        handleSubmit,
        register,
        reset,
        resetField,
        formState: { isSubmitting, isLoading, errors },
    } = useForm<IFormData>();

    const onSubmit = async (data: IFormData) => {
        if (isSubmitting || isLoading) return;

        const { text } = data;

        if (text.trim().length === 0) {
            toast.error('Vui lòng nhập tin nhắn', {
                id: 'text-is-required',
            });
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                text,
                isGemini: false,
                createAt: new Date(),
            },
        ]);

        resetField('text');

        const textFromGemini = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text }),
        });

        const { response } = await textFromGemini.json();

        setMessages((prev) => [
            ...prev,
            {
                text: response,
                isGemini: true,
                createAt: new Date(),
            },
        ]);

        reset();
    };

    return (
        <form
            className="relative mx-4 flex overflow-hidden rounded-xl border bg-transparent shadow-xl"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <input
                {...register('text', {
                    required: {
                        message: 'Vui lòng nhập bình luận',
                        value: true,
                    },
                })}
                className="flex-1 px-4 py-2"
                type="text"
                placeholder="Nhập tin nhắn..."
                spellCheck={false}
                autoComplete="off"
            />

            <Button
                className="h-full rounded-none border-l px-4 text-base"
                variant={'event'}
                type="submit"
            >
                {isSubmitting ? (
                    <Icons.Loading className="animate-spin" />
                ) : (
                    <Icons.Send />
                )}
            </Button>
        </form>
    );
};
export default InputMessage;
