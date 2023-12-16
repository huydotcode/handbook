'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { createPost } from '@/lib/actions/post.action';
import { ModalCreatePost } from '..';

interface Props {
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

interface IFormData {
    option: 'public' | 'option';
    content: string;
}

const CreatePost: FC<Props> = ({ setPosts }) => {
    const { data: session } = useSession();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [photos, setPhotos] = useState<any[]>([]);
    const { control, register, handleSubmit, formState, reset } =
        useForm<IFormData>({
            defaultValues: {
                option: 'public',
            },
        });

    const onSubmit: SubmitHandler<IFormData> = async (data) => {
        if (formState.isSubmitting) return;
        const { content, option } = data;

        setShow(false);

        let imagesUpload = [];
        try {
            if (photos && photos.length > 0) {
                const data = await fetch('/api/images', {
                    method: 'POST',
                    body: JSON.stringify(photos),
                });
                imagesUpload = await data.json();
            }

            reset({
                content: '',
            });

            setPhotos([]);

            const newPost = await createPost({
                content: content,
                option: option,
                images: imagesUpload,
            });

            if (newPost) {
                setPosts((prev) => [newPost, ...prev]);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
    const submit = handleSubmit(onSubmit);

    return (
        <>
            <div className="my-4 py-2 px-4 rounded-xl shadow-md min-w-[200px] bg-white dark:bg-dark-200">
                <div className="flex items-center">
                    <Link
                        className="w-10 h-10"
                        href={`/profile/${session?.user.id}`}
                    >
                        <Image
                            className="w-full h-full object-cover rounded-full"
                            width={40}
                            height={40}
                            src={session?.user.image || ''}
                            alt={session?.user.name || ''}
                        />
                    </Link>
                    <div
                        className="flex items-center h-10 flex-1 rounded-xl ml-3 px-3 cursor-text bg-secondary dark:bg-dark-500"
                        onClick={handleShow}
                    >
                        <h5 className="text-gray-400 dark:text-primary">
                            Bạn đang nghĩ gì thế?
                        </h5>
                    </div>
                </div>
            </div>

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
        </>
    );
};

export default CreatePost;
