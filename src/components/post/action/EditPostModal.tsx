'use client';
import { useSession } from 'next-auth/react';
import React, { ChangeEvent, FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Button, Icons, Modal, TextEditor } from '@/components/ui';
import postAudience from '@/constants/postAudience.constant';
import PostService from '@/lib/services/post.service';
import logger from '@/utils/logger';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IShowModal } from '../ActionPost';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPostValidation } from '@/lib/validation';
import AddToPost from '../AddToPost';
import Photos from '../Photos';

interface Props {
    post: IPost;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<IShowModal>>;
    handleClose: () => void;
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const EditPostModal: FC<Props> = ({
    post,
    setShow,
    show,
    handleClose,
    setPosts,
}) => {
    const { data: session } = useSession();

    if (!post) return null;

    const [photos, setPhotos] = useState<string[]>(
        post.images.map((img) => img.url)
    );

    if (!post) return null;

    const { control, register, handleSubmit, formState, reset } =
        useForm<IPostFormData>({
            defaultValues: {
                content: post.text,
                option: post.option as 'public' | 'private',
            },
            resolver: zodResolver(editPostValidation),
        });

    const onSubmit: SubmitHandler<IPostFormData> = async (data) => {
        console.log({
            data,
        });

        const newImages = post.images.filter((img) => {
            return photos.includes(img.url);
        });

        try {
            const postEdited = await PostService.editPost({
                content: data.content,
                option: data.option,
                images: newImages.map((img) => img._id),
                postId: post._id,
            });

            setPosts((prev) =>
                prev.map((p) => (p._id === post._id ? postEdited : p))
            );

            toast.success('Chỉnh sửa bài viết thành công', {
                id: 'success-edit-post',
                duration: 3000,
            });
        } catch (error) {
            logger({
                message: 'Error edit post' + error,
                type: 'error',
            });
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            reset();
            handleClose();
        }
    };

    const submit = handleSubmit(onSubmit);

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
        }
    };

    const handleRemoveImage = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
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
