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
        formState: { isSubmitting, errors },
    } = useForm<ICreateGroup>({
        defaultValues: {
            type: 'public',
        },
        resolver: zodResolver(createGroupValidation),
    });
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

            const newGroup = await createGroup({
                ...data,
                avatar: image[0],
                members,
            });

            toast.success('Tạo nhóm thành công!');
            router.push(`/groups/${newGroup._id}`);
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
            <div className="mx-auto mt-6 w-[500px] max-w-screen rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-2">
                <h5 className="text-xl font-bold">Tạo nhóm</h5>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 flex flex-col"
                >
                    {/* Tên nhóm */}
                    <div>
                        <label htmlFor="name">
                            <h2>Tên nhóm</h2>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tên nhóm"
                            className={INPUT_CLASSNAME}
                            {...register('name')}
                        />
                        {errors.name && (
                            <span className="text-red-500">
                                Tên nhóm không được để trống và không quá 50 ký
                                tự
                            </span>
                        )}
                    </div>

                    {/* Mô tả nhóm */}
                    <div>
                        <label htmlFor="description">Mô tả nhóm</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Mô tả"
                            className={INPUT_CLASSNAME}
                            {...register('description')}
                        />

                        {errors.description && (
                            <span className="text-red-500">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    {/* Ảnh đại diện */}
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
                            className="hidden rounded-md border p-2"
                            onChange={handleChangeImage}
                        />
                    </div>

                    {/* Loại nhóm */}
                    <label htmlFor="type">Loại nhóm</label>
                    <select
                        id="type"
                        className={INPUT_CLASSNAME}
                        {...register('type')}
                    >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                    </select>

                    {/* Thêm thành viên */}
                    <label>Thêm thành viên</label>
                    <div className="flex flex-col">
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
                    >
                        {isSubmitting ? 'Đang tạo nhóm...' : 'Tạo nhóm'}
                    </Button>
                </form>
            </div>
        </>
    );
};
export default CreateGroupPage;
