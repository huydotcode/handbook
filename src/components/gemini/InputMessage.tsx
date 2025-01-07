'use client';
import { Icons } from '@/components/ui';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface IFormData {
    text: string;
}

interface Props {
    form: UseFormReturn<IFormData, any, undefined>;
    setMessages: React.Dispatch<React.SetStateAction<GemimiChatMessage[]>>;
}

const InputMessage: React.FC<Props> = ({ form, setMessages }) => {
    const {
        handleSubmit,
        register,
        reset,
        resetField,
        formState: { isSubmitting, isLoading, errors },
    } = form;

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
            {
                text,
                isGemini: false,
                createAt: new Date(),
            },
            ...prev,
        ]);

        resetField('text');

        const textFromGemini = await fetch('/api/gemini', {
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
    };

    return (
        <form
            className="relative overflow-hidden rounded-xl border bg-transparent shadow-xl"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <div className="flex w-full">
                <input
                    {...register('text', {
                        required: {
                            message: 'Vui lòng nhập bình luận',
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
    );
};
export default InputMessage;
