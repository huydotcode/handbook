'use client';
import { Icons } from '@/components/ui';

import { Button } from '@/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import GroupService from '@/lib/services/group.service';
import UserService from '@/lib/services/user.service';
import { uploadImageWithFile } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { createGroupValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sidebar } from '../_components';

const INPUT_CLASSNAME =
    'my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1';

interface ICreateGroup {
    name: string;
    description: string;
    type: 'public' | 'private';
    file?: File;
}

const CreateGroupPage: React.FC = ({}) => {
    const form = useForm<ICreateGroup>({
        defaultValues: {
            type: 'public',
            description: '',
            name: '',
            file: undefined,
        },
        resolver: zodResolver(createGroupValidation),
    });
    const {
        handleSubmit,

        watch,
        formState: { isSubmitting, errors },
    } = form;
    const [members, setMembers] = useState<string[]>([]);

    const [friends, setFriends] = useState<IFriend[]>([]);
    const [searchFriendValue, setSearchFriendValue] = useState<string>('');
    const { data: session } = useSession();
    const file = watch('file');

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const friends = await UserService.getFriendsByUserId({
                userId: session?.user.id as string,
            });

            setFriends(friends);
        })();
    }, [session?.user.id]);

    const onSubmit = async (data: ICreateGroup) => {
        if (isSubmitting) return;

        try {
            if (!data.file) {
                toast.error('Vui lòng chọn ảnh đại diện cho nhóm!');
                return;
            }

            const avatar = await uploadImageWithFile({
                file: data.file,
            });

            if (!avatar) {
                toast.error(
                    'Có lỗi xảy ra khi tải ảnh đại diện, vui lòng thử lại!'
                );
                return;
            }

            const newGroup = await GroupService.create({
                ...data,
                avatar: avatar._id,
                members,
            });

            toast.success('Tạo nhóm thành công!');
            router.push(`/groups/${newGroup._id}`);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo nhóm, vui lòng thử lại!');
        }
    };

    return (
        <>
            <Sidebar />

            <div className="ml-300 mt-4">
                <div className="mx-auto w-[500px] max-w-screen rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-2">
                    <div className={'flex items-center justify-between'}>
                        <h5 className="text-xl font-bold">Tạo nhóm</h5>
                        <Button href={'/groups'} variant={'text'} size={'xs'}>
                            Trở về trang nhóm
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-4 flex flex-col space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên nhóm</FormLabel>
                                        <FormControl>
                                            <Input
                                                className={INPUT_CLASSNAME}
                                                placeholder="Tên nhóm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Input
                                                className={INPUT_CLASSNAME}
                                                placeholder="Mô tả nhóm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ảnh đại diện */}
                            <div>
                                <label htmlFor="avatar">Ảnh đại diện</label>
                                <label
                                    className="flex items-center"
                                    htmlFor="avatar"
                                >
                                    <span className="mr-2 p-2">
                                        {file ? (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="avatar"
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <Icons.Images className="h-8 w-8" />
                                        )}
                                    </span>
                                    Chọn ảnh đại diện
                                </label>
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            form.setValue('file', files[0]);
                                        } else {
                                            form.setValue('file', undefined);
                                        }
                                    }}
                                />

                                {errors.file && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.file.message}
                                    </p>
                                )}
                            </div>

                            {/* Loại nhóm */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại nhóm</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className={INPUT_CLASSNAME}
                                            >
                                                <option value="public">
                                                    Công khai
                                                </option>
                                                <option value="private">
                                                    Riêng tư
                                                </option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Thêm thành viên */}
                            <div className="flex flex-col">
                                <label>Thêm thành viên</label>
                                <input
                                    className={cn(
                                        INPUT_CLASSNAME,
                                        'rounded-b-none border-b'
                                    )}
                                    placeholder="Tìm kiếm bạn bè"
                                    value={searchFriendValue}
                                    onChange={(e) =>
                                        setSearchFriendValue(e.target.value)
                                    }
                                />

                                {/* Thêm bạn vào nhóm */}
                                <div className="max-h-[200px] overflow-y-scroll bg-primary-1 p-2 dark:bg-dark-primary-1">
                                    {friends
                                        .filter((friend) =>
                                            friend.name
                                                .toLowerCase()
                                                .includes(
                                                    searchFriendValue.toLowerCase()
                                                )
                                        )
                                        .map((friend) => (
                                            <div
                                                key={friend._id}
                                                className="mb-2 flex items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={friend._id}
                                                    value={friend._id}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setMembers([
                                                                ...members,
                                                                friend._id,
                                                            ]);
                                                        } else {
                                                            setMembers(
                                                                members.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        friend._id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Image
                                                    src={friend.avatar}
                                                    alt="avatar"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                                <label htmlFor={friend._id}>
                                                    {friend.name}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <Button
                                className="mt-2"
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                size={'sm'}
                            >
                                {isSubmitting ? 'Đang tạo nhóm...' : 'Tạo nhóm'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};
export default CreateGroupPage;
