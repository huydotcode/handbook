'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createPost } from '@/lib/actions/post.action';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createPostValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ModalCreatePost } from '.';
import { getPostsKey } from '@/lib/queryKey';

interface Props {
    groupId?: string;
    type?: 'default' | 'profile' | 'group';
}

const CreatePost: FC<Props> = ({ groupId, type = 'default' }) => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [photos, setPhotos] = useState<any[]>([]);
    const form = useForm<IPostFormData>({
        defaultValues: {
            content: '',
            option: 'public',
            files: [],
        },
        resolver: zodResolver(createPostValidation),
    });

    const mutation = useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getPostsKey() });
        },
        mutationFn: onSubmit,
    });

    const { control, register, handleSubmit, formState, reset } = form;

    async function sendPost(data: IPostFormData) {
        if (!session?.user) return;

        try {
            const { content, option, files } = data;

            if (!content && photos.length === 0) {
                toast.error('Nội dung bài viết không được để trống!');
                return;
            }

            const imagesId = await uploadImagesWithFiles({
                files,
            });

            reset({
                content: '',
            });

            setPhotos([]);

            const newPost = (await createPost({
                content: content,
                option: option,
                images: imagesId,
                groupId: groupId,
                type,
            })) as IPost;

            await queryClient.invalidateQueries({ queryKey: getPostsKey() });
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi đăng bài!');
        }
    }

    async function onSubmit(data: IPostFormData) {
        if (formState.isSubmitting) return;
        setShow(false);
        try {
            await toast.promise(
                sendPost(data),
                {
                    loading: 'Bài viết đang được đăng...!',
                    success:
                        type == 'default'
                            ? 'Đăng bài thành công!'
                            : 'Bài viết của bạn sẽ được duyệt trước khi hiển thị',
                    error: 'Đã có lỗi xảy ra khi đăng bài!',
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
                    submit={submit}
                    form={form}
                    formState={formState}
                    control={control}
                />
            )}
        </>
    );
};

export default CreatePost;
