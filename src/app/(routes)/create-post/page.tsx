'use client';
import EditorV2 from '@/components/ui/EditorV2';
import { Button } from '@/components/ui/Button';
import React, { ChangeEvent, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { createPost } from '@/lib/actions/post.action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostValidation } from '@/lib/validation';
import { useSession } from 'next-auth/react';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { getPostsKey } from '@/lib/queryKey';
import Photos from '@/components/post/Photos';
import AddToPost from '@/components/post/AddToPost';
import { convertFilesToBase64 } from '@/utils/downloadFile';
import postAudience from '@/constants/postAudience.constant';

const TOAST_POSITION = 'bottom-left';
const TOAST_DURATION = 3000;

const CreatePostPage = () => {
    const { data: session } = useSession();
    const form = useForm<IPostFormData>({
        defaultValues: {
            content: '',
            option: 'public',
            files: [],
        },
        resolver: zodResolver(createPostValidation),
    });
    const groupId = null;
    const type = 'default';
    const [photos, setPhotos] = useState<any[]>([]);
    const queryClient = useQueryClient();
    const { control, register, handleSubmit, reset } = form;
    const resetForm = useCallback(() => {
        reset({
            option: 'public',
            files: [],
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

                const imagesId = await uploadImagesWithFiles({ files });

                const newPost = (await createPost({
                    content,
                    option,
                    images: imagesId,
                    groupId,
                    type,
                })) as IPost;

                await queryClient.invalidateQueries({
                    queryKey: getPostsKey(),
                });
                resetForm();
                return newPost;
            } catch (error: any) {
                throw new Error(error);
            }
        },
        [session?.user, photos.length, groupId, type, queryClient, resetForm]
    );

    const mutation = useMutation({
        mutationFn: sendPost,
        onSuccess: () => {
            toast.dismiss('loading');
            toast.success(
                type === 'default'
                    ? 'Đăng bài thành công!'
                    : 'Bài viết của bạn sẽ được duyệt trước khi hiển thị',
                {
                    position: TOAST_POSITION,
                    duration: TOAST_DURATION,
                }
            );
        },
        onMutate: () => {
            toast.loading('Đang đăng bài...', {
                position: TOAST_POSITION,
                id: 'loading',
            });
        },
        onError: () => {
            toast.dismiss('loading');
            toast.error('Đã có lỗi xảy ra khi đăng bài!', {
                position: TOAST_POSITION,
                duration: TOAST_DURATION,
            });
        },
    });

    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const files: File[] = Array.from(fileList);

            try {
                const base64Files = await convertFilesToBase64(files);

                setPhotos((prev) => [...prev, ...base64Files]);
            } catch (error: any) {
                toast.error(error);
            }

            form.setValue('files', files);
        }
    };

    const handleRemoveImage = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form
            onSubmit={handleSubmit((data) => {
                mutation.mutate(data);
            })}
            className="mx-auto mt-[80px] w-[800px] max-w-screen overflow-y-scroll pb-[200px]"
        >
            <div className={'flex items-center gap-4'}>
                <h1 className={'text-2xl'}>Đăng bài</h1>

                <select
                    className="h-full cursor-pointer border bg-secondary-1 px-4 py-1.5 text-[10px] dark:bg-dark-secondary-1"
                    {...register('option')}
                >
                    {postAudience.map((audience) => (
                        <option
                            key={audience.value}
                            value={audience.value}
                            className="text-xs"
                        >
                            {audience.label}
                        </option>
                    ))}
                </select>

                <Button
                    className={'p-0 text-secondary-1'}
                    variant={'text'}
                    href={'/'}
                    size={'sm'}
                >
                    Trở về trang chủ
                </Button>
            </div>

            <Controller
                name={'content'}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <EditorV2 setContent={onChange} content={value} />
                )}
            />

            <Photos
                className={
                    'mt-2 min-h-[50vh] bg-secondary-1 dark:bg-dark-secondary-1'
                }
                photos={photos}
                onClickPhoto={handleRemoveImage}
            />

            <AddToPost
                className={
                    'mr-2 border-none bg-secondary-1 shadow-none dark:bg-dark-secondary-1'
                }
                handleChangeImage={handleChangeImage}
            />

            <div className={'mt-2 flex justify-center gap-2'}>
                <Button
                    type={'submit'}
                    className={'w-full max-w-[400px]'}
                    variant={'primary'}
                >
                    Đăng
                </Button>
            </div>
        </form>
    );
};

export default CreatePostPage;
