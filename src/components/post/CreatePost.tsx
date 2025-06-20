'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createPostValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ModalCreatePost } from '.';

interface Props {
    groupId?: string;
    type?: 'default' | 'profile' | 'group';
}

const TOAST_POSITION = 'bottom-left';

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    file?: File;
}

const CreatePost: FC<Props> = ({ groupId, type = 'default' }) => {
    const { data: session } = useSession();
    const { invalidatePosts } = useQueryInvalidation();

    const [show, setShow] = useState(false);
    const [photos, setPhotos] = useState<MediaItem[]>([]);

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(() => setShow(true), []);

    const form = useForm<IPostFormData>({
        defaultValues: {
            content: '',
            option: 'public',
            files: [],
        },
        resolver: zodResolver(createPostValidation),
    });

    const { control, register, handleSubmit, formState, reset } = form;

    const resetForm = useCallback(() => {
        reset({
            content: '',
        });
        setPhotos([]);
    }, [reset]);

    const sendPost = useCallback(
        async (data: IPostFormData) => {
            if (!session?.user) return;

            try {
                const { content, option, files } = data;

                if (!content && photos.length === 0) {
                    toast.error('Nội dung bài viết không được để trống!');
                    return;
                }

                const results = await uploadImagesWithFiles({
                    files: files,
                });
                const resultsId = results.map((result) => result._id);

                await PostService.create({
                    content,
                    option,
                    mediaIds: resultsId,
                    groupId,
                    type,
                });

                await invalidatePosts();
                resetForm();
            } catch (error: any) {
                console.log('Error creating post:', error);
                throw new Error(error);
            }
        },
        [
            session?.user,
            photos.length,
            groupId,
            type,
            invalidatePosts,
            resetForm,
        ]
    );

    const mutation = useMutation({
        mutationFn: sendPost,
    });

    const onSubmit = useCallback(
        async (data: IPostFormData) => {
            if (formState.isSubmitting) return;

            // Đóng form khi submit
            setShow(false);

            try {
                await toast.promise(
                    mutation.mutateAsync(data),
                    {
                        loading: 'Bài viết đang được đăng...!',
                        success:
                            type === 'default'
                                ? 'Đăng bài thành công!'
                                : 'Bài viết của bạn sẽ được duyệt trước khi hiển thị',
                        error: 'Đã có lỗi xảy ra khi đăng bài!',
                    },
                    {
                        position: TOAST_POSITION,
                    }
                );
            } catch (error: any) {
                logger({
                    message: 'Error submitting post: ' + error.message,
                    type: 'error',
                });
            }
        },
        [formState.isSubmitting, mutation, type]
    );

    return (
        <>
            <div className="mb-4 rounded-xl bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out dark:bg-dark-secondary-1">
                <div className="flex items-center">
                    <Link
                        className="h-10 w-10"
                        href={`/profile/${session?.user.id}`}
                    >
                        {session?.user && (
                            <Image
                                className="h-full w-full rounded-full object-cover"
                                width={40}
                                height={40}
                                src={session.user.image || ''}
                                alt={session.user.name || ''}
                            />
                        )}
                    </Link>
                    <div
                        className="ml-3 flex h-10 flex-1 cursor-text items-center rounded-xl bg-primary-1 px-3 dark:bg-dark-secondary-2"
                        onClick={handleShow}
                    >
                        <h5 className="text-secondary-1">
                            {type === 'group'
                                ? `Đăng bài lên nhóm này...`
                                : `Bạn đang nghĩ gì?`}
                        </h5>
                    </div>
                </div>
            </div>

            {show && (
                <ModalCreatePost
                    show={show}
                    setShow={setShow}
                    handleClose={handleClose}
                    photos={photos}
                    setPhotos={setPhotos}
                    register={register}
                    submit={handleSubmit(onSubmit)}
                    form={form}
                    formState={formState}
                    control={control}
                    groupId={groupId}
                />
            )}
        </>
    );
};

export default CreatePost;
