'use client';
import { FriendSection, Sidebar } from '@/components/layout';
import AddToPost from '@/components/post/AddToPost';
import Photos from '@/components/post/Photos';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import EditorV2 from '@/components/ui/EditorV2';
import postAudience from '@/constants/postAudience.constant';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { createPost } from '@/lib/actions/post.action';
import { convertFileToBase64 } from '@/lib/convertFileToBase64';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createPostValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const TOAST_POSITION = 'bottom-left';
const TOAST_DURATION = 3000;

const CreatePostPage = () => {
    const params = useSearchParams(); // group
    const groupId = params.get('group_id');

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

                const media = await uploadImagesWithFiles({ files });

                await createPost({
                    content,
                    option,
                    mediaIds: media.map((img) => img._id),
                    groupId,
                    type,
                });
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
            const newFiles: File[] = Array.from(fileList);

            try {
                // Kiểm tra kích thước video
                const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

                for (const file of newFiles) {
                    if (
                        file.type.startsWith('video/') &&
                        file.size > MAX_VIDEO_SIZE
                    ) {
                        toast.error(
                            `Video "${file.name}" quá lớn. Vui lòng chọn video nhỏ hơn 50MB.`
                        );
                        return;
                    }
                }

                // Chuyển đổi files mới sang định dạng hiển thị
                const mediaFiles = await Promise.all(
                    newFiles.map(async (file) => {
                        if (file.type.startsWith('image/')) {
                            return await convertFileToBase64(file);
                        } else if (file.type.startsWith('video/')) {
                            const videoUrl = URL.createObjectURL(file);
                            return {
                                url: videoUrl,
                                type: 'video',
                                file,
                            };
                        }
                        return null;
                    })
                );

                const validMediaFiles = mediaFiles.filter(Boolean);

                // Cập nhật photos để hiển thị
                setPhotos((prev) => [...prev, ...validMediaFiles]);

                // LẤY TẤT CẢ FILES HIỆN TẠI từ form
                const currentFiles = form.getValues('files') || [];

                // Thêm files mới vào danh sách files hiện tại
                const allFiles = [...currentFiles, ...newFiles];

                // Cập nhật form với TẤT CẢ files
                form.setValue('files', allFiles);
            } catch (error: any) {
                toast.error(error.message || 'Có lỗi xảy ra khi tải file');
            }
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
                                    className="h-full cursor-pointer rounded-md border bg-secondary-1 p-1 text-sm dark:bg-dark-secondary-1"
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
