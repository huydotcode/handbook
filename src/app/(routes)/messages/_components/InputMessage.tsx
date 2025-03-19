'use client';
import { Icons } from '@/components/ui';
import { useSocket } from '@/context';
import { sendMessage } from '@/lib/actions/message.action';
import { invalidateMessages } from '@/lib/query';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

interface Props {
    currentRoom: IConversation;
}

interface IFormData {
    text: string;
    files: File[];
}

const InputMessage: React.FC<Props> = ({ currentRoom }) => {
    const { socketEmitor } = useSocket();
    const queryClient = useQueryClient();
    const { data: session } = useSession();

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
        reset();
        setFocus('text');

        const { text, files } = data;

        if (!session?.user) return;

        if (!text.trim() && files.length === 0) {
            return;
        }

        try {
            let imagesUpload;

            if (files.length > 0) {
                imagesUpload = await uploadImagesWithFiles({
                    files,
                });
            }

            const newMsg = await sendMessage({
                roomId: currentRoom._id,
                text,
                images: imagesUpload,
            });

            invalidateMessages(queryClient, currentRoom._id);

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
        <div
            className={
                'flex w-full flex-1 items-center justify-center p-2 md:p-0'
            }
        >
            <form
                className="md:max-[calc(100vw-100px)] relative mx-2 flex min-w-[500px] overflow-hidden rounded-xl border bg-transparent shadow-xl md:fixed md:bottom-4 md:mx-auto md:min-w-[300px] md:flex-auto"
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
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                        width={64}
                                        height={64}
                                        quality={100}
                                    />
                                    <Button
                                        className="absolute right-0 top-0 rounded-full p-1"
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
                            className="text-md flex-1 bg-transparent px-4 py-2 md:w-[50px]  "
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

                        {/* {showEmoji && (
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
                        )} */}

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
