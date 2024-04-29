'use client';
import { Button, Icons } from '@/components/ui';

import { UserService } from '@/lib/services';
import GroupService from '@/lib/services/group.service';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {}

const INPUT_CLASSNAME =
    'my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1';

interface ICreateGroup {
    name: string;
    description: string;
    type: 'public' | 'private';
}

const CreateGroupPage: React.FC<Props> = ({}) => {
    const {
        handleSubmit,
        register,
        formState: { isSubmitting },
    } = useForm<ICreateGroup>({
        defaultValues: {
            type: 'public',
        },
    });
    const [photo, setPhoto] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);

    const [friends, setFriends] = useState<IFriend[]>([]);
    const [searchFriendValue, setSearchFriendValue] = useState<string>('');
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const friends = await UserService.getFriends({
                userId: session?.user.id as string,
            });

            setFriends(friends);
        })();
    }, []);

    const onSubmit = async (data: ICreateGroup) => {
        if (isSubmitting) return;

        // Kiểm tra xem người dùng đã chọn ảnh đại diện cho nhóm chưa
        if (!photo) {
            toast.error('Vui lòng chọn ảnh đại diện cho nhóm!');
            return;
        }

        // const res = await fetch('/api/images', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         userId: null,
        //         images: [photo],
        //     }),
        // });

        // const image = await res.json();

        // if (!image) {
        //     toast.error('Có lỗi xảy ra khi tải ảnh lên, vui lòng thử lại!');
        //     return;
        // }

        const { data: newGroup, msg } = await GroupService.createGroup({
            ...data,
            avatar: '',
            members,
        });

        if (data) {
            toast.success(msg);
            router.push(`/groups/${newGroup._id}`);
        } else {
            toast.error(msg);
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
            <div className="mx-auto w-[500px] max-w-screen bg-secondary-1 p-4 dark:bg-dark-secondary-2">
                <h5 className="text-xl font-bold">Tạo nhóm</h5>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 flex flex-col"
                    autoComplete="off"
                >
                    <div>
                        <label htmlFor="name">
                            <h2>Tên nhóm</h2>
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="off"
                            placeholder="Tên nhóm"
                            className={INPUT_CLASSNAME}
                            {...register('name', { required: true })}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Mô tả nhóm</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Mô tả"
                            autoComplete="off"
                            className={INPUT_CLASSNAME}
                            {...register('description', { required: true })}
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar">Ảnh đại diện</label>
                        <label className="flex items-center" htmlFor="avatar">
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
                            autoComplete="off"
                            className="hidden rounded-md border p-2"
                            onChange={handleChangeImage}
                        />
                    </div>

                    <label htmlFor="type">Loại nhóm</label>
                    <select
                        id="type"
                        className={INPUT_CLASSNAME}
                        {...register('type', { required: true })}
                    >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                    </select>

                    <label>Thêm thành viên</label>
                    <div className="flex flex-col">
                        <input
                            className={cn(
                                INPUT_CLASSNAME,
                                'rounded-b-none border-b'
                            )}
                            autoComplete="off"
                            placeholder="Tìm kiếm bạn bè"
                            value={searchFriendValue}
                            onChange={(e) =>
                                setSearchFriendValue(e.target.value)
                            }
                        />

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
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang tạo nhóm...' : 'Tạo nhóm'}
                    </Button>
                </form>
            </div>
        </>
    );
};
export default CreateGroupPage;
