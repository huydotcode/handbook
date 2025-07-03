'use client';
import { useSession } from 'next-auth/react';
import React, { ChangeEvent, FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import EditorV2, { EditorField } from '@/components/ui/EditorV2';
import Icons from '@/components/ui/Icons';
import postAudience from '@/constants/postAudience.constant';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { editPostValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AddToPost from '../AddToPost';
import TagInput from '../TagInput';

interface Props {
    post: IPost;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
}

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    file?: File;
    _id?: string; // Thêm id nếu cần để xóa media đã upload
}

const EditPostModal: FC<Props> = ({ post, setShow, show, handleClose }) => {
    const { data: session } = useSession();
    const { invalidatePost, invalidatePosts } = useQueryInvalidation();

    // Chuyển đổi media từ post thành định dạng hiển thị
    const initialMedia = post.media.map((media) => ({
        url: media.url,
        type: media.resourceType || 'image',
        _id: media._id,
    })) as MediaItem[];

    const [media, setMedia] = useState<MediaItem[]>(initialMedia);
    const [removeImages, setRemoveImages] = useState<string[]>([]);

    const form = useForm<IPostFormData>({
        defaultValues: {
            content: post.text,
            option: post.option as 'public' | 'private',
            files: [],
            tags: post.tags || [],
        },
        resolver: zodResolver(editPostValidation),
    });

    const { control, register, handleSubmit, formState } = form;

    const mutation = useMutation({
        onSuccess: async () => {
            await invalidatePost(post._id);
            await invalidatePosts();
        },
        mutationFn: onSubmit,
    });

    const updatePost = async (data: IPostFormData) => {
        if (!session?.user) return;

        try {
            const { content, option, files, tags } = data;

            if (!content && media.length === 0) {
                toast.error('Nội dung bài viết không được để trống!');
                return;
            }

            // Upload các file mới đã thêm
            const newImages = await uploadImagesWithFiles({
                files,
            });

            // Kết hợp media mới với media cũ không bị xóa
            const updateImages = [
                ...newImages,
                ...post.media.filter((img) => !removeImages.includes(img._id)),
            ];

            // Reset form
            form.reset({
                content: '',
                option: 'public',
                files: [],
                tags: [],
            });

            // Reset media
            setMedia([]);
            setRemoveImages([]);

            // Gọi API cập nhật bài viết
            await PostService.update({
                content: content,
                option: option,
                postId: post._id,
                mediaIds: updateImages.map((img) => img._id),
                tags,
            });

            // Làm mới cache
            await invalidatePost(post._id);
            await invalidatePosts();
            handleClose();
        } catch (error: any) {
            logger({
                message: 'Error update post: ' + error,
                type: 'error',
            });
            throw error;
        }
    };

    async function onSubmit(data: IPostFormData) {
        if (formState.isSubmitting) return;
        setShow(false);

        try {
            await toast.promise(
                updatePost(data),
                {
                    loading: 'Bài viết đang được cập nhật...',
                    success: 'Cập nhật thành công!',
                    error: 'Đã có lỗi xảy ra khi cập nhật!',
                },
                {
                    position: 'bottom-left',
                }
            );
        } catch (error: any) {
            logger({
                message: 'Error submit post: ' + error,
                type: 'error',
            });
        }
    }

    const submit = handleSubmit(
        mutation.mutate as SubmitHandler<IPostFormData>
    );

    // Xử lý thay đổi ảnh hoặc video
    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const newFiles: File[] = Array.from(fileList || []);

            try {
                // Kiểm tra kích thước video
                const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

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

                const validMediaFiles = mediaFiles.filter(Boolean);

                // Cập nhật media để hiển thị
                setMedia((prev) => [...prev, ...validMediaFiles]);

                // Lấy các file hiện tại từ form
                const currentFiles = form.getValues('files') || [];

                // Thêm files mới vào danh sách files hiện tại
                const allFiles = [...currentFiles, ...newFiles];

                // Cập nhật form với tất cả files
                form.setValue('files', allFiles);
            } catch (error: any) {
                toast.error(error.message || 'Có lỗi xảy ra khi tải file');
            }
        }
    };

    // Xử lý xóa media
    const handleRemoveImage = (index: number) => {
        const mediaItem = media[index];

        // Xóa khỏi state media
        setMedia((prev) => prev.filter((_, i) => i !== index));

        // Nếu là media có sẵn từ server, thêm vào danh sách xóa
        if (mediaItem) {
            if (mediaItem.file) {
                // Nếu là video mới upload, không cần thêm vào removeImages
                setRemoveImages((prev) =>
                    prev.filter((id) => id !== mediaItem._id)
                );
            } else {
                // Nếu là media đã có trên server, thêm vào danh sách xóa
                setRemoveImages((prev) => [...prev, mediaItem._id || '']);
            }
        } else {
            // Nếu là media mới upload, xóa khỏi form.files
            const currentFiles = form.getValues('files') || [];

            const updatedFiles = currentFiles.filter(
                (file: File, i: number) => i !== index
            );

            form.setValue('files', updatedFiles);
            toast.success('Đã xóa media khỏi bài viết');
        }
    };

    return (
        <Modal title="Chỉnh sửa bài viết" show={show} handleClose={handleClose}>
            <form onSubmit={submit} encType="multipart/form-data">
                <div className="flex items-center">
                    <Avatar
                        userUrl={session?.user.id}
                        imgSrc={session?.user.image || ''}
                    />

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
                                >
                                    {audience.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-between pt-3">
                    <Controller
                        render={({ field: { onChange, value } }) => (
                            <>
                                <EditorField
                                    onChange={onChange}
                                    value={value}
                                    hasMenu={true}
                                />
                            </>
                        )}
                        name="content"
                        control={control}
                    />

                    <Controller
                        name="tags"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TagInput
                                value={value}
                                onChange={onChange}
                                placeholder="Nhập tag và nhấn Enter"
                                maxTags={10}
                                className="mt-2"
                            />
                        )}
                    />

                    {/* Hiển thị tất cả media (ảnh và video) */}
                    {media.length > 0 && (
                        <div className="relative mt-2 flex max-h-[30vh] flex-wrap gap-2 overflow-y-auto p-2">
                            {media.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative h-[150px] w-[150px]"
                                >
                                    <Button
                                        onClick={() => handleRemoveImage(index)}
                                        variant={'secondary'}
                                        size={'sm'}
                                        className="absolute right-1 top-1 z-10 rounded-full bg-gray-200/80 p-1 hover:bg-gray-300/80"
                                    >
                                        <Icons.Close className="h-4 w-4" />
                                    </Button>

                                    {item.type === 'video' ? (
                                        <video
                                            className="h-full w-full rounded-lg object-cover"
                                            src={item.url}
                                            controls
                                        />
                                    ) : (
                                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                                            <Image
                                                src={item.url}
                                                alt=""
                                                className="h-full w-full rounded-lg object-cover"
                                                fill
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {formState.errors.content && (
                        <p className="mt-2 text-sm text-red-500">
                            {formState.errors.content.message}
                        </p>
                    )}

                    <AddToPost handleChangeImage={handleChangeImage} />

                    <Button
                        type="submit"
                        className="mt-3 w-full"
                        variant={'primary'}
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditPostModal;
