'use client';
import { useSession } from 'next-auth/react';
import React, { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import usePostContext from '@/hooks/usePostContext';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';
import Image from 'next/image';
import { IShowModal } from '../ActionPost';
import Avatar from '@/components/Avatar';
import { Button, TextEditor } from '@/components';
import { CgClose } from 'react-icons/cg';
import { Tooltip } from 'antd';
import { editPost } from '@/lib/actions/post.action';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<IShowModal>>;
    handleClose: () => void;
}

const EditPostModal: FC<Props> = ({ setShow, show, handleClose }) => {
    const { data: session } = useSession();
    const { post, setPosts } = usePostContext();

    const [photos, setPhotos] = useState<string[]>(
        post.images.map((img) => img.url)
    );

    if (!post) return null;

    const { control, register, handleSubmit, formState, reset } =
        useForm<IPostFormData>({
            defaultValues: {
                content: post.content,
                option: post.option as 'public' | 'private',
            },
        });

    const onSubmit: SubmitHandler<IPostFormData> = async (data) => {
        if (formState.isSubmitting) return;

        const newImages = post.images.filter((img) => {
            return photos.includes(img.url);
        });

        const postEdited = await editPost({
            ...data,
            images: newImages,
            postId: post._id,
        });

        setPosts((prev) =>
            prev.map((post) => {
                if (post._id === postEdited._id) {
                    return postEdited;
                }

                return post;
            })
        );

        reset();
        handleClose();
    };
    const submit = handleSubmit(onSubmit);

    return (
        <>
            <Modal title="Chỉnh sửa bài viết" show={show} setShow={setShow}>
                <div className="flex items-center">
                    <Avatar
                        userUrl={session?.user.id}
                        imgSrc={session?.user.image || ''}
                    />

                    <div className="flex flex-col ml-2 h-12">
                        <Link
                            className="h-6"
                            href={`/profile/${session?.user.id}`}
                        >
                            <span className="text-base dark:text-primary">
                                {session?.user.name}
                            </span>
                        </Link>

                        <select
                            className="text-[10px] border h-6 py-1 cursor-pointer dark:border-none"
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
                    className="pt-3 flex flex-col justify-between flex-1"
                    onSubmit={submit}
                    encType="multipart/form-data"
                >
                    <Controller
                        render={({ field }) => (
                            <>
                                <TextEditor
                                    className="relative w-full min-h-[150px] max-h-[20vh] cursor-text text-base overflow-scroll dark:text-primary dark:no-scrollbar"
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
                        <div className="flex flex-wrap p-2 border-[1px solid #ccc] rounded-xl max-h-[200px] overflow-y-scroll">
                            {photos.map((img: string, index: number) => {
                                return (
                                    <div
                                        className="relative px-1 w-[50%] overflow-hidden"
                                        key={index}
                                    >
                                        <span
                                            className="absolute top-2 left-2 flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-[rgba(144,144,144,0.5)] hover:bg-[rgba(144,144,144,0.8)] dark:bg-[rgba(88,88,88,0.8)] dark:hover:bg-[rgba(88,88,88,0.9)] z-10"
                                            onClick={() =>
                                                setPhotos((prev) =>
                                                    prev.filter(
                                                        (photo) => photo !== img
                                                    )
                                                )
                                            }
                                        >
                                            <CgClose className="w-5 h-5" />
                                        </span>
                                        <div className="relative w-full min-h-[500px] object-cover">
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
                        <div className="relative flex items-center justify-between mt-2 px-2 py-2 border-[1px solid #ccc] rounded-xl border-t-2 shadow-md dark:shadow-none dark:border-gray-500">
                            <h5 className="text-base font-bold dark:text-primary">
                                Thêm vào bài viết của bạn
                            </h5>

                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:cursor-pointer hover:bg cursor-pointer">
                                    <label
                                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:cursor-pointer  cursor-pointer hover:bg-light-100 dark:hover:bg-dark-500 "
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
                                className="w-full h-10 mt-3 p-2 rounded-xl text-base text-white bg-primary hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                variant={'custom'}
                                size={'none'}
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
