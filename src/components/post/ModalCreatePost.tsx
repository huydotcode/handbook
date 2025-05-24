'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { BaseSyntheticEvent, ChangeEvent } from 'react';
import {
    Control,
    Controller,
    FormState,
    UseFormRegister,
    UseFormReturn,
} from 'react-hook-form';

import { Fade, Modal } from '@mui/material';

import { Button } from '@/components/ui/Button';
import postAudience from '@/constants/postAudience.constant';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Icons from '../ui/Icons';
import TextEditor from '../ui/TextEditor';
import AddToPost from './AddToPost';
import Photos from './Photos';

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    file?: File; // Chỉ có với video mới upload
}

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
    register: UseFormRegister<IPostFormData>;
    submit: (
        e?: BaseSyntheticEvent<object, any, any> | undefined
    ) => Promise<void>;
    photos: MediaItem[];
    setPhotos: React.Dispatch<React.SetStateAction<MediaItem[]>>;
    form: UseFormReturn<IPostFormData>;
    formState: FormState<IPostFormData>;
    control: Control<IPostFormData, any>;
    groupId?: string;
}

const ModalCreatePost: React.FC<Props> = ({
    show,
    setShow,
    handleClose,
    control,
    formState,
    register,
    form,
    submit,
    photos,
    setPhotos,
    groupId,
}) => {
    const { data: session } = useSession();

    // Xử lý thay đổi ảnh
    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        console.log('handleChangeImage', fileList);
        if (fileList) {
            const newFiles: File[] = Array.from(fileList);

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

                const mediaFiles: MediaItem[] = newFiles
                    .filter(
                        (file) =>
                            file.type.startsWith('image/') ||
                            file.type.startsWith('video/')
                    )
                    .map((file) => {
                        return {
                            url: URL.createObjectURL(file),
                            type: file.type.startsWith('video/')
                                ? 'video'
                                : 'image',
                            file: file, // Chỉ có với video mới upload
                        };
                    });

                const validMediaFiles = mediaFiles.filter(Boolean); // Loại bỏ các giá trị null

                // Cập nhật photos để hiển thị
                console.log('validMediaFiles', validMediaFiles);
                setPhotos((prev) => [...prev, ...validMediaFiles]);

                // LẤY TẤT CẢ FILES HIỆN TẠI từ form
                const currentFiles = form.getValues('files') || [];

                // Thêm files mới vào danh sách files hiện tại
                const allFiles = [...currentFiles, ...newFiles];

                console.log('New files added:', allFiles);

                // Cập nhật form với TẤT CẢ files
                form.setValue('files', allFiles);
            } catch (error: any) {
                toast.error(error.message || 'Có lỗi xảy ra khi tải file');
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        // Xóa khỏi state photos
        setPhotos((prev) => {
            const newPhotos = prev.filter((_, i) => i !== index);

            // Lấy danh sách files hiện tại
            const currentFiles = form.getValues('files') || [];

            // Xóa file tương ứng (đảm bảo index phù hợp)
            const newFiles = currentFiles.filter((_, i) => i !== index);

            // Cập nhật form
            form.setValue('files', newFiles);

            return newPhotos;
        });
    };

    return (
        <>
            <Modal
                open={show}
                onClose={handleClose}
                keepMounted
                disableAutoFocus
            >
                <Fade in={show}>
                    <div className="fixed left-1/2 top-1/2 flex min-w-[50vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border-t-2 bg-white p-6 shadow-md dark:border-none dark:bg-dark-secondary-1 dark:shadow-none xl:w-[60vw] xl:max-w-none md:top-0 md:h-screen md:max-h-none md:w-screen md:translate-y-0 md:rounded-none">
                        <div className="flex h-12 items-center border-b-2 ">
                            <div className="w-full text-center text-xl font-extrabold text-primary-1 dark:text-dark-primary-1">
                                Tạo bài viết
                            </div>
                            <Button
                                className="bg-secondary-1 text-2xl"
                                onClick={() => setShow(false)}
                                variant={'secondary'}
                                size={'sm'}
                            >
                                <Icons.Close className="text-primary-1 dark:text-dark-primary-1" />
                            </Button>
                        </div>

                        <div className="relative mt-3 flex flex-col">
                            <Button
                                href={`/create-post?group_id=${groupId}`}
                                variant={'text'}
                                size={'sm'}
                                className={
                                    'absolute right-2 top-2 text-secondary-1 '
                                }
                            >
                                Nâng cao
                            </Button>
                            <div className="flex items-center">
                                <Link href="/">
                                    <Image
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                        src={session?.user.image || ''}
                                        alt={session?.user.name || ''}
                                    />
                                </Link>

                                <div className="ml-2 flex h-12 flex-col">
                                    <Link
                                        className="h-6"
                                        href={`/profile/${session?.user.id}`}
                                    >
                                        <span className="text-base dark:text-dark-primary-1">
                                            {session?.user.name}
                                        </span>
                                    </Link>

                                    <select
                                        className="h-6 cursor-pointer border py-1 text-[10px]"
                                        {...register('option')}
                                    >
                                        {postAudience.map((audience) => (
                                            <option
                                                key={audience.value}
                                                value={audience.value}
                                                className="text-xs"
                                            >
                                                {audience.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* //! FORM HERE */}
                            <form
                                className="flex flex-1 flex-col justify-between pt-3"
                                onSubmit={submit}
                                encType="multipart/form-data"
                            >
                                {/* Content */}
                                <Controller
                                    render={({ field }) => (
                                        <>
                                            <TextEditor
                                                className="dark:no-scrollbar relative max-h-[20vh] min-h-[150px] w-full cursor-text overflow-scroll text-base"
                                                handleSubmit={submit}
                                                field={field}
                                            />
                                        </>
                                    )}
                                    name="content"
                                    control={control}
                                />

                                <Photos
                                    photos={photos}
                                    onClickPhoto={handleRemoveImage}
                                />

                                {formState.errors.content && (
                                    <p className="text-sm text-red-500">
                                        {formState.errors.content.message}
                                    </p>
                                )}

                                <AddToPost
                                    handleChangeImage={handleChangeImage}
                                />

                                <Button
                                    type="submit"
                                    className="mt-3 h-10 w-full disabled:cursor-not-allowed"
                                    variant={'primary'}
                                >
                                    Đăng
                                </Button>
                            </form>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default ModalCreatePost;
