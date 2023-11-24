import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { ChangeEvent } from 'react';
import { CgClose } from 'react-icons/cg';
import { useCreatePostContext } from './CreatePost';
import { Fade, Modal, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';
import TextEditor from './TextEditor';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface Props {}

const ModalCreatePost: React.FC<Props> = ({}) => {
    const { data: session } = useSession();
    const {
        control,
        formState,
        handleCloseModal,
        photos,
        register,
        setPhotos,
        setShowModal,
        showModal,
        submitForm,
    } = useCreatePostContext();

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

    return (
        <>
            <Modal
                open={showModal}
                onClose={handleCloseModal}
                keepMounted
                disableAutoFocus
            >
                <Fade in={showModal}>
                    <div className="fixed flex flex-col top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-xl p-6 max-w-[800px] min-w-[50vw] bg-white shadow-md border-t-2 md:w-screen  md:rounded-none md:h-screen md:max-h-none md:top-0 md:translate-y-0 xl:max-w-none xl:w-[60vw] dark:bg-dark-200 dark:shadow-none dark:border-none">
                        <div className="flex items-center h-12 border-b-2 dark:border-gray-500">
                            <div className="w-full text-xl font-extrabold text-center">
                                Tạo bài viết
                            </div>
                            <Button
                                variant={'event'}
                                onClick={() => setShowModal(false)}
                            >
                                <CgClose />
                            </Button>
                        </div>

                        <div className="flex flex-col mt-3">
                            <div className="flex items-center">
                                <Link href="/">
                                    <Image
                                        width={48}
                                        height={48}
                                        className="object-cover rounded-full"
                                        src={session?.user.image || ''}
                                        alt={session?.user.name || ''}
                                    />
                                </Link>

                                <div className="flex flex-col ml-2 h-12">
                                    <Link
                                        className="h-6"
                                        href={`/profile/${session?.user.id}`}
                                    >
                                        <span className="text-base dark:text-primary">
                                            {session?.user.name}
                                        </span>
                                    </Link>

                                    {/* Option */}
                                    <select
                                        className="text-[10px] border h-6 py-1 cursor-pointer dark:border-none"
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
                                            value="friend"
                                        >
                                            Bạn bè
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
                                className="pt-3 flex flex-col justify-between flex-1"
                                onSubmit={submitForm}
                                encType="multipart/form-data"
                            >
                                {/* Content */}
                                <Controller
                                    render={({ field }) => (
                                        <>
                                            <TextEditor
                                                className="relative w-full min-h-[150px] max-h-[20vh] cursor-text text-base overflow-scroll dark:text-primary dark:no-scrollbar"
                                                handleSubmit={submitForm}
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
                                    <div className="flex flex-wrap p-2 border-[1px solid #ccc] rounded-xl max-h-[200px] overflow-y-scroll">
                                        {photos.map(
                                            (img: string, index: number) => {
                                                return (
                                                    <div
                                                        className="relative px-1 max-w-[50%] overflow-hidden"
                                                        key={index}
                                                    >
                                                        <span
                                                            className="absolute top-2 left-2 flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-[rgba(144,144,144,0.5)] hover:bg-[rgba(144,144,144,0.8)] dark:bg-[rgba(88,88,88,0.8)] dark:hover:bg-[rgba(88,88,88,0.9)] z-10"
                                                            onClick={() => {
                                                                setPhotos(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                );
                                                            }}
                                                        >
                                                            <CgClose className="w-5 h-5" />
                                                        </span>
                                                        <div className="relative w-full h-full object-cover">
                                                            <Image
                                                                className="mt-2 align-middle w-full"
                                                                quality={100}
                                                                src={img || ''}
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
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
                                                    {...register('pictures')}
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
                                            className="mt-3 bg-primary hover:bg-blue-600"
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
