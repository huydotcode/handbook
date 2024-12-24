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
    const { socketEmitor } = useSocket();
    const [showEmoji, setShowEmoji] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        getValues,
        formState: { isLoading },
        setFocus,
    } = useForm<IFormData>({
        defaultValues: {
            text: '',
            files: [],
        },
    });
    const files = getValues('files');

    const handleRemoveFile = (index: number) => {
        setValue(
            'files',
            files.filter((_, i) => i !== index)
        );
        setFocus('text');
    };

    // Xử lý select emoji
    const handleEmojiSelect = (emoji: any) => {
        setValue('text', getValues('text') + emoji.native);
        setFocus('text');
    };

    const onSubmit = async (data: IFormData) => {
        if (isLoading) {
            console.log(isLoading);
            return;
        }

        // Reset form
        reset();
        setFocus('text');

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
        } catch (error: any) {
            toast.error('Không thể gửi tin nhắn!');
        } finally {
            setFocus('text');
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
            <form
                className="relative mx-2 flex min-w-[500px] overflow-hidden rounded-xl border bg-transparent shadow-xl md:min-w-0 md:flex-1 "
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
            >
                <Controller
                    control={control}
                    name={'files'}
                    render={({ field: { value, onChange, ...field } }) => {
                        return (
                            <input
                                {...field}
                                className="hidden"
                                multiple={true}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(event) => {
                                    if (event.target.files) {
                                        console.log(event.target.files);
                                        onChange(
                                            Array.from(
                                                files.concat(
                                                    Array.from(
                                                        event.target.files
                                                    )
                                                )
                                            )
                                        );
                                    }

                                    setFocus('text');
                                }}
                                type="file"
                                id="files"
                            />
                        );
                    }}
                />

                <label
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-hover-1 dark:hover:bg-dark-hover-1"
                    htmlFor="files"
                >
                    <Icons.Upload className={'h-6 w-6'} />
                </label>

                <div className={cn('flex w-full flex-col')}>
                    {files.length > 0 && (
                        <div className="flex gap-3 px-4 py-2">
                            {files.map((file, index) => (
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
                            onKeyDown={(e) => {
                                // Kiểm tra có text và không phải shift + enter
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();

                                    if (
                                        getValues('text').trim() ||
                                        files.length > 0
                                    ) {
                                        handleSubmit(onSubmit)();
                                    }
                                }
                            }}
                        />

                        <Button
                            className={
                                'h-full rounded-none bg-transparent p-2 shadow-none hover:bg-hover-1 dark:hover:bg-dark-hover-1'
                            }
                            onClick={() => {
                                setShowEmoji((prev) => !prev);
                            }}
                        >
                            <Icons.Emoji className={'h-4 w-4'} />
                        </Button>

                        {showEmoji && (
                            <div className={'fixed bottom-20 right-10'}>
                                <Picker
                                    data={data}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme={'light'}
                                    locale={'vi'}
                                    onClickOutside={() => setShowEmoji(false)}
                                    previewPosition={'none'}
                                />
                            </div>
                        )}

                        <Button
                            className="h-full rounded-none border-l px-4 py-2 text-base"
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
                </div>
            </form>
        </div>
    );
};
export default InputMessage;
