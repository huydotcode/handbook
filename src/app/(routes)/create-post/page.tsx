'use client';
import { FriendSection, Sidebar } from '@/components/layout';
import AddToPost from '@/components/post/AddToPost';
import Photos from '@/components/post/Photos';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import EditorV2 from '@/components/ui/EditorV2';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import postAudience from '@/constants/postAudience.constant';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { createPost } from '@/lib/actions/post.action';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createPostValidation } from '@/lib/validation';
import { convertFilesToBase64 } from '@/utils/downloadFile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const TOAST_POSITION = 'bottom-left';
const TOAST_DURATION = 3000;

const CreatePostPage = () => {
    const { data: session } = useSession();
    const { invalidatePosts } = useQueryInvalidation();
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
            console.log({
                data,
            });
            if (!session?.user) return;

            try {
                const { content, option, files } = data;

                if (content.trim().length === 0 && photos.length === 0) {
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

                await invalidatePosts();
                resetForm();
            } catch (error: any) {
                throw new Error(error);
            }
        },
        [session?.user, photos.length, invalidatePosts, resetForm]
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
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <div className="mx-auto mt-2 w-[600px] xl:w-[550px] md:w-full">
                <form
                    onSubmit={handleSubmit((data) => {
                        mutation.mutate(data);
                    })}
                >
                    <div
                        className={
                            'mb-2 flex items-center justify-between gap-4'
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <h1 className="flex items-end">
                                <Icons.CreatePost className="mr-2 h-8 w-8" />
                                Đăng bài
                            </h1>

                            <div className="flex w-full items-center justify-between gap-2">
                                <label htmlFor="">
                                    <span className="text-sm font-semibold">
                                        Tùy chọn:
                                    </span>
                                </label>
                                <select
                                    className="h-full cursor-pointer border bg-secondary-1 px-6 py-2 text-[10px] dark:bg-dark-secondary-1"
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
                            </div>
                        </div>

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
                            <EditorV2
                                setContent={onChange}
                                content={value}
                                onEmptyStateChange={(isEmpty) => {
                                    if (isEmpty) {
                                        form.setValue('content', '');
                                    }
                                }}
                            />
                        )}
                    />

                    {form.formState.errors.content && (
                        <p className="mt-2 text-sm text-red-500">
                            {form.formState.errors.content.message}
                        </p>
                    )}

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
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Đang đăng...' : 'Đăng'}
                        </Button>
                    </div>
                </form>
            </div>

            {session && <FriendSection session={session} />}
        </div>
    );
};

export default CreatePostPage;
