'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import PostService from '@/lib/services/post.service';
import { ModalCreatePost } from '.';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostValidation } from '@/lib/validation';
import { uploadImage } from '@/lib/upload';

interface Props {
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
    groupId?: string;
    type?: 'home' | 'profile' | 'group';
}

const CreatePost: FC<Props> = ({ setPosts, groupId, type = 'home' }) => {
    const { data: session } = useSession();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [photos, setPhotos] = useState<any[]>([]);
    const { control, register, handleSubmit, formState, reset } =
        useForm<IPostFormData>({
            defaultValues: {
                option: 'public',
            },
            resolver: zodResolver(createPostValidation),
        });

    const sendPost = async (data: IPostFormData) => {
        if (!session?.user) return;

        try {
            const { content, option } = data;
            let imagesUpload: IImage[] = [];

            console.log({
                photos,
            });

            if (photos && photos.length > 0) {
                for (const img of photos) {
                    try {
                        const res = await uploadImage({ image: img });
                        imagesUpload.push(res);
                    } catch (error: any) {
                        console.log({
                            error,
                        });
                        toast.error('Đã có lỗi xảy ra khi tải ảnh lên!');
                        return;
                    }
                }
            }

            if (photos.length != imagesUpload.length) {
                toast.error('Đã có lỗi xảy ra khi tải ảnh lên!');
                return;
            }

            reset({
                content: '',
            });

            setPhotos([]);

            const newPost = (await PostService.createPost({
                content: content,
                option: option,
                images: imagesUpload.map((img) => img._id),
                groupId: groupId,
            })) as IPost;

            if (newPost) {
                setPosts((prev) => [newPost, ...prev]);
            }
        } catch (error: any) {
            logger({
                message: 'Error send post' + error,
                type: 'error',
            });
        }
    };

    const onSubmit: SubmitHandler<IPostFormData> = async (data) => {
        if (formState.isSubmitting) return;
        setShow(false);
        try {
            toast.promise(sendPost(data), {
                loading: 'Bài viết đang được đăng...!',
                success: 'Đăng bài thành công!',
                error: 'Đã có lỗi xảy ra khi đăng bài!',
            });
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
    };
    const submit = handleSubmit(onSubmit);

    return (
        <>
            <div className="mb-4 rounded-xl bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out dark:bg-dark-secondary-1">
                <div className="flex items-center">
                    <Link
                        className="h-10 w-10"
                        href={`/profile/${session?.user.id}`}
                    >
                        <Image
                            className="h-full w-full rounded-full object-cover"
                            width={40}
                            height={40}
                            src={session?.user.image || ''}
                            alt={session?.user.name || ''}
                        />
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
                    formState={formState}
                    control={control}
                />
            )}
        </>
    );
};

export default CreatePost;
