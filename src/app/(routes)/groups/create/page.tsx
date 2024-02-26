'use client';
import { Button, Icons } from '@/components/ui';

import { UserService } from '@/lib/services';
import GroupService from '@/lib/services/group.service';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {}

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
            avatar: 'https://res.cloudinary.com/da4pyhfyy/image/upload/v1708495339/oynzl5ggetllzf6u52k0.jpg',
            // image[0].url,
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
            <div className="mx-auto w-[500px] max-w-screen">
                <h5 className="text-xl font-bold">Tạo nhóm</h5>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4"
                    autoComplete="off"
                >
                    <label htmlFor="name">
                        <h2>Tên nhóm</h2>
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Tên nhóm"
                        className="rounded-md border  p-2"
                        {...register('name', { required: true })}
                    />
                    <label htmlFor="description">Mô tả nhóm</label>
                    <input
                        id="description"
                        type="text"
                        placeholder="Mô tả"
                        autoComplete="off"
                        className="rounded-md border p-2"
                        {...register('description', { required: true })}
                    />
                    <label htmlFor="avatar">Ảnh đại diện</label>
                    <label className="flex items-center" htmlFor="avatar">
                        <span className="mr-2">
                            {photo ? (
                                <Image
                                    src={photo}
                                    alt="avatar"
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <Icons.Images className="h-12 w-12" />
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

                    <label htmlFor="type">Loại nhóm</label>
                    <select
                        id="type"
                        className="rounded-md border p-2"
                        {...register('type', { required: true })}
                    >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                    </select>

                    <label>Thêm thành viên</label>
                    <div className="flex flex-col space-y-2 ">
                        <input
                            className="rounded-md p-2"
                            autoComplete="off"
                            placeholder="Tìm kiếm bạn bè"
                            value={searchFriendValue}
                            onChange={(e) =>
                                setSearchFriendValue(e.target.value)
                            }
                        />

                        <div className="max-h-[200px] overflow-y-scroll bg-secondary-1 p-2">
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
                                            src={friend.image}
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
