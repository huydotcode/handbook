'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import postAudience from '@/constants/postAudience.constant';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import PostService from '@/lib/services/post.service';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { createPostValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FileUploaderWrapper } from '../shared/FileUploader';
import { Icons } from '../ui';
import { Button } from '../ui/Button';
import { EditorField } from '../ui/EditorV2';
import Video from '../ui/video';
import TagInput from './TagInput';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

interface Props {
    className?: string;
    groupId?: string;
    type?: 'default' | 'profile' | 'group';
    variant?: 'default' | 'modal';
    hasMenu?: boolean;
    onSubmitSuccess?: () => void;
}

const TOAST_POSITION = 'bottom-left';

const CreatePostV2: FC<Props> = ({
    className,
    groupId,
    type = 'default',
    hasMenu = true,
    variant = 'default',
    onSubmitSuccess,
}) => {
    const { data: session } = useSession();
    const { invalidatePosts } = useQueryInvalidation();
    const [showTagInput, setShowTagInput] = useState<boolean>(true);

    const form = useForm<IPostFormData>({
        defaultValues: {
            content: '',
            option: 'public',
            files: [],
            tags: [],
        },
        resolver: zodResolver(createPostValidation),
    });
    const files = form.watch('files');

    const { control, register, handleSubmit, formState, reset } = form;

    const sendPost = useCallback(
        async (data: IPostFormData) => {
            if (!session?.user) return;

            try {
                const { content, option, files, tags } = data;

                if (!content && files.length === 0) {
                    toast.error('Vui lòng nhập nội dung hoặc thêm ảnh/video.');
                    return;
                }

                const results = await uploadImagesWithFiles({
                    files: files,
                });
                const resultsId = results.map((result) => result._id);

                await PostService.create({
                    content,
                    option,
                    mediaIds: resultsId,
                    groupId,
                    type,
                    tags,
                });

                await invalidatePosts();
                reset();

                onSubmitSuccess?.();
            } catch (error: any) {
                console.log('Error creating post:', error);
                throw new Error(error);
            }
        },
        [session?.user, groupId, type, invalidatePosts, reset, onSubmitSuccess]
    );

    const mutation = useMutation({
        mutationFn: sendPost,
    });

    const onSubmit = useCallback(
        async (data: IPostFormData) => {
            if (formState.isSubmitting) return;

            try {
                await toast.promise(
                    mutation.mutateAsync(data),
                    {
                        loading: 'Bài viết đang được đăng...!',
                        success:
                            type === 'default'
                                ? 'Đăng bài thành công!'
                                : 'Bài viết của bạn sẽ được duyệt trước khi hiển thị',
                        error: 'Đã có lỗi xảy ra khi đăng bài!',
                    },
                    {
                        position: TOAST_POSITION,
                    }
                );

                reset();
            } catch (error: any) {
                logger({
                    message: 'Error submitting post: ' + error.message,
                    type: 'error',
                });
            }
        },
        [formState.isSubmitting, mutation, reset, type]
    );

    // Xử lý thay đổi ảnh
    const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const newFiles: File[] = Array.from(fileList || []);

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
        // Lấy tất cả files hiện tại từ form
        const currentFiles = form.getValues('files') || [];

        // Loại bỏ file tại index
        const updatedFiles = currentFiles.filter((_, i) => i !== index);

        // Cập nhật lại form với danh sách files đã loại bỏ
        form.setValue('files', updatedFiles);
    };

    return (
        <>
            <FileUploaderWrapper
                handleChange={(newFiles: File[]) => {
                    form.setValue('files', [
                        ...(form.getValues('files') || []),
                        ...newFiles,
                    ]);
                }}
            >
                <div className={cn('relative mx-auto', className)}>
                    <div className="relative mt-3 flex flex-col">
                        <div className="flex items-center">
                            {session?.user && (
                                <Link href="/">
                                    <Image
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                        src={session?.user.image || ''}
                                        alt={session?.user.name || ''}
                                    />
                                </Link>
                            )}

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
                                    className="h-10 cursor-pointer border py-1 text-[10px]"
                                    {...register('option')}
                                >
                                    {postAudience.map((audience) => (
                                        <option
                                            key={audience.value}
                                            value={audience.value}
                                            className="text-sm"
                                        >
                                            {audience.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <form
                            className="flex flex-1 flex-col justify-between p-0 pt-3"
                            onSubmit={handleSubmit(onSubmit)}
                            encType="multipart/form-data"
                        >
                            <Controller
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <EditorField
                                            className="max-h-[30vh] overflow-scroll"
                                            onChange={onChange}
                                            value={value}
                                            hasMenu={hasMenu}
                                        />
                                    </>
                                )}
                                name="content"
                                control={control}
                            />

                            {showTagInput && (
                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TagInput
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Nhập tag và nhấn Enter"
                                            maxTags={10}
                                            className="mt-2"
                                        />
                                    )}
                                />
                            )}

                            {formState.errors.content && (
                                <p className="text-sm text-red-500">
                                    {formState.errors.content.message}
                                </p>
                            )}

                            {files && files.length > 0 && (
                                <div className="mt-2 flex w-full flex-wrap gap-2">
                                    {files
                                        .sort((a, b) => {
                                            // Sắp xếp video lên đầu
                                            if (
                                                a.type.startsWith('video/') &&
                                                !b.type.startsWith('video/')
                                            ) {
                                                return -1;
                                            }
                                            if (
                                                !a.type.startsWith('video/') &&
                                                b.type.startsWith('video/')
                                            ) {
                                                return 1;
                                            }

                                            return 0;
                                        })
                                        .map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex items-center gap-2"
                                            >
                                                {file.type.startsWith(
                                                    'video/'
                                                ) ? (
                                                    <Video
                                                        className="rounded-lg object-cover"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                    />
                                                ) : (
                                                    <Image
                                                        className="rounded-lg"
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt={file.name}
                                                        width={140}
                                                        height={140}
                                                        quality={100}
                                                    />
                                                )}

                                                <Button
                                                    type="button"
                                                    variant={'secondary'}
                                                    size={
                                                        file.type.startsWith(
                                                            'video/'
                                                        )
                                                            ? 'default'
                                                            : 'xs'
                                                    }
                                                    className="absolute right-2 top-2"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                >
                                                    <Icons.Close className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div
                                className={cn(
                                    'relative mt-2 flex items-center justify-between rounded-xl bg-secondary-1 px-4 py-1 dark:bg-dark-secondary-1',
                                    variant === 'modal' &&
                                        'border border-secondary-2 dark:border-dark-secondary-2'
                                )}
                            >
                                <h5 className={'text-sm'}>
                                    Thêm vào bài viết của bạn
                                </h5>

                                <div className="flex items-center">
                                    {/* Tags */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant={'ghost'}
                                                    size={'xs'}
                                                    className={cn(
                                                        'mr-2 h-10 w-10 rounded-xl hover:bg-secondary-2 dark:hover:bg-dark-secondary-2',
                                                        showTagInput
                                                            ? 'bg-secondary-2 dark:bg-dark-secondary-2'
                                                            : 'bg-transparent'
                                                    )}
                                                    onClick={() =>
                                                        setShowTagInput(
                                                            !showTagInput
                                                        )
                                                    }
                                                >
                                                    <Icons.Tag className="h-4 w-4 text-primary-2" />
                                                </Button>
                                            </TooltipTrigger>

                                            <TooltipContent>
                                                <span className="text-xs">
                                                    Thêm tag
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl hover:cursor-pointer">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <label
                                                        className="flex h-10 w-10 cursor-pointer items-center  justify-center rounded-xl hover:cursor-pointer hover:bg-secondary-2 dark:hover:bg-dark-secondary-2"
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
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span className="text-xs">
                                                        Thêm ảnh/video
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <input
                                            className="hidden"
                                            id="input-file"
                                            type="file"
                                            accept="image/*, video/*"
                                            multiple
                                            onChange={handleChangeImage}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-3 h-10 w-full disabled:cursor-not-allowed"
                                variant={'primary'}
                                disabled={formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Icons.Loading className="h-4 w-4 animate-spin" />{' '}
                                        Đang đăng...
                                    </>
                                ) : (
                                    'Đăng'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </FileUploaderWrapper>
        </>
    );
};

export default CreatePostV2;
