'use client';
import { Icons } from '@/components/ui';

import { createGroup } from '@/lib/actions/group.action';
import { getFriendsByUserId } from '@/lib/actions/user.action';
import { uploadImages } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { createGroupValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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

interface Props {}

const INPUT_CLASSNAME =
    'my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1';

interface ICreateGroup {
    name: string;
    description: string;
    type: 'public' | 'private';
}

const CreateGroupPage: React.FC<Props> = ({}) => {
    const form = useForm<ICreateGroup>({
        defaultValues: {
            type: 'public',
            description: '',
            name: '',
        },
        resolver: zodResolver(createGroupValidation),
    });
    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = form;
    const [photo, setPhoto] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);

    const [friends, setFriends] = useState<IFriend[]>([]);
    const [searchFriendValue, setSearchFriendValue] = useState<string>('');
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const friends = await getFriendsByUserId({
                userId: session?.user.id as string,
            });

            setFriends(friends);
        })();
    }, [session?.user.id]);

    const onSubmit = async (data: ICreateGroup) => {
        if (isSubmitting) return;

        try {
            // Kiểm tra xem người dùng đã chọn ảnh đại diện cho nhóm chưa
            if (!photo) {
                toast.error('Vui lòng chọn ảnh đại diện cho nhóm!');
                return;
            }

            const image = await uploadImages({ photos: [photo] });

            if (image) {
                const newGroup = await createGroup({
                    ...data,
                    avatar: image[0],
                    members,
                });

                toast.success('Tạo nhóm thành công!');
                router.push(`/groups/${newGroup._id}`);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo nhóm, vui lòng thử lại!');
        }
    };

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="mx-auto my-[100px] w-[500px] max-w-screen rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-2">
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
                                    {photo ? (
                                        <Image
                                            src={photo}
                                            alt="avatar"
                                            width={48}
                                            height={48}
                                        />
                                    ) : (
                                        <Icons.Images className="h-8 w-8" />
                                    )}
                                </span>
                                Chọn ảnh đại diện
                            </label>
                            <input
                                id="avatar"
                                type="file"
                                className="hidden rounded-md border p-2"
                                onChange={handleChangeImage}
                            />
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
        </>
    );
};
export default CreateGroupPage;
