'use client';
import { useSession } from 'next-auth/react';
import React, { ChangeEvent, FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Modal, TextEditor } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import postAudience from '@/constants/postAudience.constant';
import { editPost } from '@/lib/actions/post.action';
import { getPostsKey } from '@/lib/queryKey';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { editPostValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IShowModal } from '../ActionPost';
import AddToPost from '../AddToPost';
import Photos from '../Photos';

interface Props {
    post: IPost;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<IShowModal>>;
    handleClose: () => void;
}

const EditPostModal: FC<Props> = ({ post, setShow, show, handleClose }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [photos, setPhotos] = useState<string[]>(
        post.images.map((img) => img.url)
    );
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const { control, register, handleSubmit, formState, reset, setValue } =
        useForm<IPostFormData>({
            defaultValues: {
                content: post.text,
                option: post.option as 'public' | 'private',
                files: [],
            },
            resolver: zodResolver(editPostValidation),
        });

    const mutation = useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getPostsKey() });
        },
        mutationFn: onSubmit,
    });

    const updatePost = async (data: IPostFormData) => {
        if (!session?.user) return;

        try {
            const { content, option, files } = data;

            const imagesOld = post.images.map((img) => img._id);

            if (!content && photos.length === 0) {
                toast.error('Nội dung bài viết không được để trống!');
                return;
            }

            const imagesId = await uploadImagesWithFiles({
                files,
            });

            const newImages = imagesId.concat(
                imagesOld.filter((img) => !removeImages.includes(img))
            );

            reset({
                content: '',
            });

            setPhotos([]);

            await editPost({
                content: content,
                option: option,
                postId: post._id,
                images: newImages,
            });

            queryClient.invalidateQueries({ queryKey: getPostsKey() });
        } catch (error: any) {
            logger({
                message: 'Error send post' + error,
                type: 'error',
            });
        }
    };

    async function onSubmit(data: IPostFormData) {
        if (formState.isSubmitting) return;
        setShow({ editModal: false, deleteModal: false });
        try {
            await toast.promise(
                updatePost(data),
                {
                    loading: 'Bài viết đang được cập nhật...!',
                    success: 'Cập nhật thành công!',
                    error: 'Đã có lỗi xảy ra khi cập nhật!',
                },
                {
                    position: 'bottom-left',
                }
            );
        } catch (error: any) {
            logger({
                message: 'Error submit post' + error,
                type: 'error',
            });
        } finally {
            reset({
                content: '',
            });
        }
    }
    const submit = handleSubmit(
        mutation.mutate as SubmitHandler<IPostFormData>
    );

    // Xử lý thay đổi ảnh
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const files: File[] = Array.from(fileList);
            files.forEach((file) => {
                if (!file) {
                    toast.error('Có lỗi trong quá trình đăng tải ảnh!');
                    return;
                }

                if (!file.type.includes('image')) {
                    toast.error('Sai định dạng! Vui lòng upload ảnh');
                    return;
                }

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const result = reader.result as string;

                    setPhotos((prev) => [...prev, result]);
                };
            });

            setValue('files', files);
        }
    };

    const handleRemoveImage = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
        setRemoveImages((prev) => [...prev, post.images[index]._id]);
    };

    return (
        <>
            <Modal
                title="Chỉnh sửa bài viết"
                show={show}
                handleClose={handleClose}
            >
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
                            render={({ field }) => (
                                <>
                                    <TextEditor
                                        className="dark:no-scrollbar relative max-h-[20vh] min-h-[150px] w-full cursor-text overflow-scroll text-base "
                                        handleSubmit={submit}
                                        field={field}
                                    />
                                </>
                            )}
                            name="content"
                            control={control}
                        />

                        <Photos
                            onClickPhoto={handleRemoveImage}
                            photos={photos}
                        />

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
                            Chỉnh sửa
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EditPostModal;
