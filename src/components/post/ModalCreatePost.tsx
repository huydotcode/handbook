'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { BaseSyntheticEvent, ChangeEvent } from 'react';
import {
    Control,
    Controller,
    FormState,
    UseFormRegister,
} from 'react-hook-form';

import { Fade, Modal, Tooltip } from '@mui/material';
import { toast } from 'react-hot-toast';

import { useSession } from 'next-auth/react';
import TextEditor from '../ui/TextEditor';
import Button from '../ui/Button';
import Icons from '../ui/Icons';
interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose: () => void;
    register: UseFormRegister<IPostFormData>;
    submit: (
        e?: BaseSyntheticEvent<object, any, any> | undefined
    ) => Promise<void>;
    photos: any;
    setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
    formState: FormState<IPostFormData>;
    control: Control<IPostFormData, any>;
}

const ModalCreatePost: React.FC<Props> = ({
    show,
    setShow,
    handleClose,
    control,
    formState,
    register,
    submit,
    photos,
    setPhotos,
}) => {
    const { data: session } = useSession();
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
                            >
                                <Icons.Close className="text-primary-1 dark:text-dark-primary-1" />
                            </Button>
                        </div>

                        <div className="mt-3 flex flex-col">
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
                                        <option
                                            className="text-xs"
                                            value="public"
                                        >
                                            Công khai
                                        </option>
                                        <option
                                            className="text-xs"
                                            value="private"
                                        >
                                            Chỉ mình tôi
                                        </option>
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
                                    defaultValue=""
                                    rules={{
                                        validate: {
                                            required: (v) =>
                                                (v && v.trim().length > 0) ||
                                                'Vui lòng nhập nội dung trước khi hoàn tất',
                                        },
                                    }}
                                />

                                {/* Images */}
                                {photos && photos.length > 0 && (
                                    <div className=" flex max-h-[200px] flex-wrap overflow-y-scroll rounded-xl p-2">
                                        {photos.map(
                                            (img: string, index: number) => {
                                                return (
                                                    <div
                                                        className="relative w-[50%] overflow-hidden px-1"
                                                        key={index}
                                                    >
                                                        <span
                                                            className="absolute left-2 top-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                                                            onClick={() =>
                                                                handleRemoveImage(
                                                                    index
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
                                            }
                                        )}
                                    </div>
                                )}

                                <div>
                                    <div className=" relative mt-2 flex items-center justify-between rounded-xl border-t-2 px-2 py-2 shadow-md  dark:border-none dark:shadow-none">
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
                                                        src={
                                                            '/assets/img/images.png'
                                                        }
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
                                                    onChange={handleChangeImage}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Tooltip
                                        title={
                                            formState.errors.content?.message
                                        }
                                    >
                                        <Button
                                            type="submit"
                                            className="mt-3 h-10 w-full disabled:cursor-not-allowed"
                                            variant={'primary'}
                                            disabled={
                                                formState.errors.content
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Đăng
                                        </Button>
                                    </Tooltip>
                                </div>
                            </form>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default ModalCreatePost;
