'use client';
import { useSession } from 'next-auth/react';
import React, { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Avatar, Button, Icons, Modal, TextEditor } from '@/components/ui';
import { usePost } from '@/context';
import { editPost } from '@/lib/actions/post.action';
import { Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { IShowModal } from '../ActionPost';
import PostService from '@/lib/services/post.service';
import toast from 'react-hot-toast';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<IShowModal>>;
    handleClose: () => void;
}

const EditPostModal: FC<Props> = ({ setShow, show, handleClose }) => {
    const { data: session } = useSession();
    const { post, setPosts } = usePost();

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
        });

    const onSubmit: SubmitHandler<IPostFormData> = async (data) => {
        if (formState.isSubmitting) return;

        const newImages = post.images.filter((img) => {
            return photos.includes(img.url);
        });

        try {
            const postEdited = await PostService.editPost({
                ...data,
                images: newImages.map((img) => img._id),
                postId: post._id,
            });

            setPosts((prev) =>
                prev.map((p) => (p._id === post._id ? postEdited : p))
            );
        } catch (error) {
            console.log('error edit post', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            reset();
            handleClose();
        }
    };
    const submit = handleSubmit(onSubmit);

    return (
        <>
            <Modal
                title="Chỉnh sửa bài viết"
                show={show}
                handleClose={handleClose}
            >
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
                            defaultValue={
                                post.option as 'public' | 'option' | 'private'
                            }
                        >
                            <option className="text-xs" value="public">
                                Công khai
                            </option>
                            <option className="text-xs" value="private">
                                Chỉ mình tôi
                            </option>
                        </select>
                    </div>
                </div>
                <form
                    className="flex flex-1 flex-col justify-between pt-3"
                    onSubmit={submit}
                    encType="multipart/form-data"
                >
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
                        defaultValue=""
                        rules={{
                            validate: {
                                required: (v) =>
                                    (v && v.trim().length > 0) ||
                                    'Vui lòng nhập nội dung trước khi hoàn tất',
                            },
                        }}
                    />

                    {photos && photos.length > 0 && (
                        <div className="flex max-h-[200px] flex-wrap overflow-y-scroll rounded-xl p-2">
                            {photos.map((img: string, index: number) => {
                                return (
                                    <div
                                        className="relative w-[50%] overflow-hidden px-1"
                                        key={index}
                                    >
                                        <span
                                            className="absolute left-2 top-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                                            onClick={() =>
                                                setPhotos((prev) =>
                                                    prev.filter(
                                                        (photo) => photo !== img
                                                    )
                                                )
                                            }
                                        >
                                            <Icons.Close className="h-5 w-5" />
                                        </span>
                                        <div className="relative min-h-[500px] w-full object-cover">
                                            <Image
                                                className="mt-2 align-middle "
                                                quality={100}
                                                src={img || ''}
                                                alt=""
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div>
                        <div className="relative mt-2 flex items-center justify-between rounded-xl border-t-2 px-2 py-2  shadow-md dark:shadow-none">
                            <h5 className="text-base font-bold ">
                                Thêm vào bài viết của bạn
                            </h5>

                            <div className="flex items-center">
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:cursor-pointer">
                                    <label
                                        className="flex h-10 w-10 cursor-pointer items-center  justify-center rounded-xl hover:cursor-pointer "
                                        htmlFor="input-file"
                                    >
                                        <Image
                                            src={'/assets/img/images.png'}
                                            alt=""
                                            width={24}
                                            height={24}
                                        />
                                    </label>
                                    <input
                                        id="input-file"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        // onChange={handleChangeImage}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Tooltip title={formState.errors.content?.message}>
                            <Button
                                type="submit"
                                className="mt-3 h-10 w-full"
                                variant={'primary'}
                                disabled={
                                    formState.errors.content
                                        ? true
                                        : false || formState.isSubmitting
                                }
                            >
                                Chỉnh sửa
                            </Button>
                        </Tooltip>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EditPostModal;
