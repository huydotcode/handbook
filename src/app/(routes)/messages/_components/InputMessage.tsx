'use client';
import { Button, Icons } from '@/components/ui';
import { MessageService } from '@/lib/services';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useSocket } from '@/context';
import { uploadImagesWithFiles } from '@/lib/uploadImage';

interface Props {
    currentRoom: IConversation;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

interface IFormData {
    text: string;
    files: File[];
}

const InputMessage: React.FC<Props> = ({ currentRoom, setMessages }) => {
    const { socket, socketEmitor } = useSocket();
    const [showEmoji, setShowEmoji] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        getValues,
        formState: { isSubmitting, isLoading },
    } = useForm<IFormData>({
        defaultValues: {
            text: '',
            files: [],
        },
    });

    const handleRemoveFile = (index: number) => {
        setValue(
            'files',
            getValues('files').filter((_, i) => i !== index)
        );
    };

    // Xử lý select emoji
    const handleEmojiSelect = (emoji: any) => {
        setValue('text', getValues('text') + emoji.native);
    };

    const onSubmit = async (data: IFormData) => {
        if (isSubmitting || isLoading) return;

        const { text, files } = data;

        if (!text.trim() && files.length === 0) {
            return;
        }

        try {
            let imagesUpload = await uploadImagesWithFiles({
                files,
            });

            const newMsg = await MessageService.sendMessage({
                roomId: currentRoom._id,
                text,
                images: imagesUpload,
            });

            setMessages((prev) => [newMsg, ...prev]);

            socketEmitor.sendMessage({
                roomId: currentRoom._id,
                message: newMsg,
            });

            reset();
        } catch (error: any) {
            toast.error('Không thể gửi tin nhắn!');
        }
    };

    // Khi nhấn esc thì thoát khỏi emoji
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowEmoji(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    watch('files');

    return (
        <div className={'flex w-full flex-1 items-center justify-center p-2'}>
            <Controller
                name="files"
                control={control}
                render={({ field }) => (
                    <input
                        id={'files'}
                        type={'file'}
                        className={'hidden'}
                        multiple
                        onChange={(e) => {
                            if (e.target.files) {
                                field.onChange(Array.from(e.target.files));
                            }
                        }}
                    />
                )}
            />

            <Button variant={'event'} type={'button'}>
                <label
                    htmlFor="files"
                    className="flex cursor-pointer items-center gap-2"
                >
                    <Icons.Upload className={'h-6 w-6'} />
                </label>
            </Button>

            <form
                className="relative mx-2 flex min-w-[500px] overflow-hidden rounded-xl border bg-transparent shadow-xl md:min-w-0 md:flex-1 "
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <div className={cn('flex w-full flex-col')}>
                    {getValues('files').length > 0 && (
                        <div className="flex gap-3 px-4 py-2">
                            <input
                                className={'hidden'}
                                id={'more-file'}
                                type="file"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setValue(
                                            'files',
                                            Array.from(e.target.files)
                                        );
                                    }
                                }}
                            />

                            <label
                                htmlFor="more-file"
                                className="justify-cente flex cursor-pointer items-center rounded-lg px-4 hover:bg-hover-1 dark:hover:bg-dark-hover-1"
                            >
                                <Icons.Upload className={'h-8 w-8'} />
                            </label>

                            {getValues('files').map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <Button
                                        className="absolute right-0 top-0 rounded-full p-1 text-white"
                                        type={'reset'}
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <Icons.Close className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={'flex w-full items-center justify-between'}>
                        <input
                            {...register('text')}
                            className="flex-1 bg-transparent px-4 py-2 md:w-[50px]"
                            type="text"
                            placeholder="Nhắn tin"
                            spellCheck={false}
                            autoComplete="off"
                        />

                        <div className={'flex items-center'}>
                            <button
                                className={
                                    'p-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1'
                                }
                                type={'button'}
                                onClick={() => {
                                    setShowEmoji((prev) => !prev);
                                }}
                            >
                                <Icons.Emoji className={'h-4 w-4'} />
                            </button>

                            {showEmoji && (
                                <div className={'fixed bottom-20 right-10'}>
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        theme={'light'}
                                        locale={'vi'}
                                        onClickOutside={() =>
                                            setShowEmoji(false)
                                        }
                                        previewPosition={'none'}
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            className="h-full rounded-none border-l px-4 py-2 text-base"
                            variant={'event'}
                            type="submit"
                        >
                            {isSubmitting ? (
                                <Icons.Loading className="animate-spin" />
                            ) : (
                                <Icons.Send />
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default InputMessage;
