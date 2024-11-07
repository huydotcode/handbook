'use client';
import { Button, Icons } from '@/components/ui';
import socketEvent from '@/constants/socketEvent.constant';
import { useSocket } from '@/context';
import { MessageService } from '@/lib/services';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/upload';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Props {
    currentRoom: IConversation;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

interface IFormData {
    text: string;
    files: File[];
}

const InputMessage: React.FC<Props> = ({ currentRoom, setMessages }) => {
    const { data: session } = useSession();
    const { socket } = useSocket();

    const [files, setFiles] = useState<File[]>([]);
    const [showEmoji, setShowEmoji] = useState<boolean>(false);

    const {
        handleSubmit,
        register,
        reset,
        setValue,
        getValues,
        formState: { isSubmitting, isLoading },
    } = useForm<IFormData>();

    const handleFileChange = (files: File[]) => {
        setFiles(files);
        setValue('files', files);
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setValue(
            'files',
            files.filter((_, i) => i !== index)
        );
    };

    // Xử lý select emoji
    const handleEmojiSelect = (emoji: any) => {
        console.log(emoji);
        setValue('text', getValues('text') + emoji.native);
    };

    const onSubmit = async (data: IFormData) => {
        if (isSubmitting || isLoading) return;

        const { text } = data;

        if (text.trim().length === 0 && files.length === 0) {
            return;
        }

        try {
            let imagesUpload = [] as string[];

            if (files.length > 0) {
                const uploadPromises = files.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = async () => {
                            try {
                                const base64 = reader.result as string;
                                const image = await uploadImage({
                                    image: base64,
                                });
                                resolve(image._id);
                            } catch (error) {
                                reject(error);
                            }
                        };
                        reader.onerror = (error) => reject(error);
                    });
                });

                imagesUpload = await Promise.all(uploadPromises);
            }

            const newMsg = await MessageService.sendMessage({
                roomId: currentRoom._id,
                text,
                images: imagesUpload,
            });

            setMessages((prev) => [newMsg, ...prev]);
            if (socket) {
                socket.emit(socketEvent.SEND_MESSAGE, newMsg);
            }

            setFiles([]);
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

    return (
        <div className={'flex w-full flex-1 items-center justify-center p-2'}>
            <input
                className={'hidden'}
                id={'file'}
                type="file"
                multiple
                onChange={(e) => {
                    if (e.target.files) {
                        handleFileChange(Array.from(e.target.files));
                    }
                }}
            />

            <Button variant={'event'} type={'button'}>
                <label
                    htmlFor="file"
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
                    {files.length > 0 && (
                        <div className="flex gap-3 px-4 py-2">
                            <input
                                className={'hidden'}
                                id={'more-file'}
                                type="file"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        handleFileChange([
                                            ...files,
                                            ...Array.from(e.target.files),
                                        ]);
                                    }
                                }}
                            />

                            <label
                                htmlFor="more-file"
                                className="justify-cente flex cursor-pointer items-center rounded-lg px-4 hover:bg-hover-1 dark:hover:bg-dark-hover-1"
                            >
                                <Icons.Upload className={'h-8 w-8'} />
                            </label>

                            {files.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <Button
                                        className="absolute right-0 top-0 rounded-full p-1 text-white"
                                        type={'button'}
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
                            className="flex-1 bg-transparent px-4 py-2"
                            type="text"
                            placeholder="Nhập tin nhắn..."
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
