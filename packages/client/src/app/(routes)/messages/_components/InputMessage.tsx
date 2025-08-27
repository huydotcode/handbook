'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/context';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import MessageService from '@/lib/services/message.service';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    currentRoom: IConversation;
    setIsSendMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IFormData {
    text: string;
    files: File[];
}

const InputMessage: React.FC<Props> = ({ currentRoom, setIsSendMessage }) => {
    const { socketEmitor } = useSocket();
    const { data: session } = useSession();
    const formRef = React.useRef<HTMLFormElement>(null);
    const { queryClientAddMessage, invalidateConversation } =
        useQueryInvalidation();
    const form = useForm<IFormData>({
        defaultValues: {
            text: '',
            files: [],
        },
    });
    const {
        control,
        handleSubmit,
        register,
        reset,
        setValue,
        watch,
        getValues,
        formState: { isLoading, isSubmitting },
        setFocus,
    } = form;

    const files = form.watch('files');

    const handleRemoveFile = (index: number) => {
        setValue(
            'files',
            files.filter((_, i) => i !== index)
        );
        setFocus('text');
    };

    const onSubmit = async (data: IFormData) => {
        setIsSendMessage(true);
        reset();
        setFocus('text');

        const { text, files } = data;

        setValue('files', []);
        setValue('text', '');

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

            const newMsg = await MessageService.send({
                roomId: currentRoom._id,
                text,
                images: imagesUpload?.map((image) => image._id),
            });

            if (!newMsg) {
                toast.error('Không thể gửi tin nhắn!');
                return;
            }

            queryClientAddMessage(newMsg);

            socketEmitor.sendMessage({
                roomId: currentRoom._id,
                message: newMsg,
            });
        } catch (error: any) {
            console.log(error);
            toast.error('Không thể gửi tin nhắn!');
        } finally {
            setFocus('text');
            setIsSendMessage(false);
        }
    };

    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const fileList = e.target.files;
        if (fileList) {
            const newFiles: File[] = Array.from(fileList || []);

            try {
                // Kiểm tra kích thước video
                const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

                for (const file of newFiles) {
                    if (
                        file.type.startsWith('video/') &&
                        file.size > MAX_VIDEO_SIZE
                    ) {
                        toast.error(
                            `Video "${file.name}" quá lớn. Vui lòng chọn video nhỏ hơn 50MB.`
                        );
                        return;
                    }
                }

                // LẤY TẤT CẢ FILES HIỆN TẠI từ form
                const currentFiles = form.getValues('files') || [];

                // Thêm files mới vào danh sách files hiện tại
                const allFiles = [...currentFiles, ...newFiles];

                // Cập nhật form với TẤT CẢ files
                form.setValue('files', allFiles);
            } catch (error: any) {
                toast.error(error.message || 'Có lỗi xảy ra khi tải file');
            }
        }
    };

    useEffect(() => {
        console.log('Files in InputMessage:', files);
    }, [files]);

    return (
        <form
            className="max-[calc(100vw-100px)] flex min-w-[500px] overflow-hidden rounded-xl border bg-secondary-1 dark:border-none dark:bg-dark-secondary-2 md:min-w-0"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
            }}
            autoComplete="off"
            ref={formRef}
        >
            {/* <Controller
                control={control}
                name={'files'}
                render={({ field: { value, onChange, ...field } }) => {
                    return (
                        <input
                            className="hidden"
                            accept="image/*, video/*"
                            multiple={true}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                            onChange={handleChangeImage}
                            // onChange={(event) => {
                            //     // Kiểm tra nếu có file được chọn
                            //     if (!event.target.files) return;

                            //     if (files && event.target.files) {
                            //         if (
                            //             files.length +
                            //                 event.target.files.length >=
                            //             11
                            //         ) {
                            //             toast.error(
                            //                 'Bạn chỉ có thể gửi tối đa 5 tệp tin!'
                            //             );
                            //             return;
                            //         }

                            //         onChange(
                            //             Array.from(
                            //                 files.concat(
                            //                     Array.from(
                            //                         event.target.files || []
                            //                     )
                            //                 )
                            //             )
                            //         );
                            //     }

                            //     setFocus('text');
                            // }}
                            type="file"
                            id="files"
                        />
                    );
                }}
            /> */}

            <input
                className="hidden"
                accept="image/*, video/*"
                multiple={true}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                onChange={handleChangeImage}
                // onChange={(event) => {
                //     // Kiểm tra nếu có file được chọn
                //     if (!event.target.files) return;

                //     if (files && event.target.files) {
                //         if (
                //             files.length +
                //                 event.target.files.length >=
                //             11
                //         ) {
                //             toast.error(
                //                 'Bạn chỉ có thể gửi tối đa 5 tệp tin!'
                //             );
                //             return;
                //         }

                //         onChange(
                //             Array.from(
                //                 files.concat(
                //                     Array.from(
                //                         event.target.files || []
                //                     )
                //                 )
                //             )
                //         );
                //     }

                //     setFocus('text');
                // }}
                type="file"
                id="files"
            />

            <label
                className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-hover-1 dark:hover:bg-dark-secondary-1"
                htmlFor="files"
            >
                <Icons.Upload className={'h-6 w-6'} />
            </label>

            <div
                className={cn('flex w-full flex-col', {
                    'p-2': files.length > 0,
                })}
            >
                {!isSubmitting && files.length > 0 && (
                    <div className="dark:bg-dark-200 flex w-full flex-col overflow-hidden">
                        <div className="flex max-h-[200px] max-w-[50vw] flex-wrap gap-3 overflow-y-auto md:max-w-full">
                            {files.map((file, index) => {
                                const fileUrl = URL.createObjectURL(file);
                                const isImage = file.type.startsWith('image/');
                                const isVideo = file.type.startsWith('video/');

                                return (
                                    <div key={index} className="relative">
                                        {isImage && (
                                            <Image
                                                src={fileUrl}
                                                alt={file.name}
                                                className="h-16 w-16 rounded-lg object-cover"
                                                width={64}
                                                height={64}
                                                quality={100}
                                            />
                                        )}

                                        {isVideo && (
                                            <video
                                                className="h-16 w-16 rounded-lg object-cover"
                                                src={URL.createObjectURL(file)}
                                            />
                                        )}

                                        <Button
                                            className="absolute right-0 top-0 h-6 w-6 rounded-full p-1"
                                            type={'reset'}
                                            onClick={() =>
                                                handleRemoveFile(index)
                                            }
                                        >
                                            <Icons.Close className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        <span className="mt-2 text-sm text-secondary-1">
                            Số file đã chọn: {files.length}
                        </span>
                    </div>
                )}

                <div
                    className={cn(
                        'flex w-full items-center justify-between overflow-hidden rounded-xl',
                        {
                            'mt-2 border border-primary-1 dark:border dark:border-dark-primary-1':
                                files && files.length > 0,
                        }
                    )}
                >
                    <input
                        {...register('text')}
                        className="text-md flex-1 bg-transparent px-4 py-2"
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

                    {/* <Button
                            className={'h-full rounded-none p-2'}
                            variant={'ghost'}
                            onClick={() => {
                                setShowEmoji((prev) => !prev);
                            }}
                        >
                            <Icons.Emoji className={'h-4 w-4'} />
                        </Button> */}

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
                        className="h-full rounded-none px-4 py-2"
                        variant={'ghost'}
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
    );
};
export default InputMessage;
