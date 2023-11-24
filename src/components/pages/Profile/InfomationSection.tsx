'use client';
import { sanitize } from 'isomorphic-dompurify';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { TextareaAutosize } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

interface Friend {
    id: string;
    image: string;
    name: string;
}

interface Props {
    friends: Friend[];
    profile: IProfile;
}

const InfomationSection: React.FC<Props> = ({ profile, friends }) => {
    const { data: session } = useSession();
    const [bio, setBio] = useState<string>(profile.bio);
    const [showChangeBio, setShowChangeBio] = useState<boolean>(false);
    const [valueBioInput, setValueBioInput] = useState<string>('');
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const canEdit = useMemo(() => {
        return session?.user.id == profile.userId;
    }, [session?.user.id, profile.userId]);

    const changeBio = async () => {
        if (valueBioInput.trim().length === 0) {
            setShowChangeBio(false);
            setValueBioInput('');
            return;
        }

        setIsChanging(true);

        try {
            const response = await fetch(`/api/profile/${profile.userId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    newBio: valueBioInput,
                }),
            });

            if (response.ok) {
                setBio(valueBioInput);
            }
        } catch (error) {
            toast.error('Có lỗi đã xảy ra!');
        } finally {
            setIsChanging(false);
            setShowChangeBio(false);
            setValueBioInput('');
        }
    };

    const editBioComponent = () => {
        if (!canEdit) return <></>;

        return (
            <>
                {showChangeBio && (
                    <TextareaAutosize
                        className="w-full p-2 resize-none bg-light-100 dark:bg-[rgba(255,255,255,.1)] focus:border-none focus:outline-none rounded-xl"
                        spellCheck={false}
                        placeholder="Nhập tiểu sử"
                        value={valueBioInput}
                        onChange={(e) => setValueBioInput(e.target.value)}
                    />
                )}

                {showChangeBio && (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={changeBio}
                        disabled={isChanging}
                    >
                        {isChanging ? 'Đang thay đổi...' : 'Thay đổi'}
                    </Button>
                )}

                {bio.length > 0 ? (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={() => setShowChangeBio((prev) => !prev)}
                    >
                        {showChangeBio ? 'Tắt chỉnh sửa' : 'Sửa tiểu sử'}
                    </Button>
                ) : (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={() => setShowChangeBio((prev) => !prev)}
                    >
                        {showChangeBio ? 'Tắt chỉnh sửa' : 'Thêm tiểu sử'}
                    </Button>
                )}
            </>
        );
    };

    return (
        <div className="w-[36%] md:w-full md:grid grid-flow-row grid-cols-1">
            <section className="relative my-3 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <h5 className="text-xl font-bold">Giới thiệu</h5>
                {!showChangeBio && (
                    <div
                        className="mt-1 text-sm"
                        dangerouslySetInnerHTML={{
                            __html: sanitize(bio.replace(/\n/g, '<br/>')),
                        }}
                    />
                )}

                {/* <EditBio /> */}

                {editBioComponent()}

                {/* {showChangeBio && (
                    <TextareaAutosize
                        className="w-full p-2 resize-none bg-light-100 focus:border-none focus:outline-none rounded-xl"
                        spellCheck={false}
                        placeholder="Nhập tiểu sử"
                        value={valueBioInput}
                        onChange={(e) => setValueBioInput(e.target.value)}
                    />
                )}

                {showChangeBio && (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={changeBio}
                        disabled={isChanging}
                    >
                        {isChanging ? 'Đang thay đổi...' : 'Thay đổi'}
                    </Button>
                )}

                {bio.length > 0 ? (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={() => setShowChangeBio((prev) => !prev)}
                    >
                        {showChangeBio ? 'Tắt chỉnh sửa' : 'Sửa tiểu sử'}
                    </Button>
                ) : (
                    <Button
                        className="w-full mt-2"
                        variant={'event'}
                        size={'small'}
                        onClick={() => setShowChangeBio((prev) => !prev)}
                    >
                        {showChangeBio ? 'Tắt chỉnh sửa' : 'Thêm tiểu sử'}
                    </Button>
                )} */}
            </section>

            <section className="relative my-3 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <h5 className="text-xl font-bold">Ảnh</h5>
                <div>
                    <div className="grid grid-cols-5 gap-2 mt-2"></div>
                    {friends.length === 0 && (
                        <p className="text-sm text-secondary">
                            Không có ảnh nào
                        </p>
                    )}
                </div>
            </section>

            <section className="relative my-3 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <h5 className="text-xl font-bold">Bạn bè</h5>
                <div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                        {friends.slice(0, 5).map((friend: Friend) => {
                            return (
                                <>
                                    <Link
                                        key={friend.id}
                                        className="flex items-center flex-col rounded-md m-1 min-w-[50px] p-2 shadow-md"
                                        href={`/profile/${friend.id}`}
                                    >
                                        <Image
                                            className="rounded-md"
                                            src={friend.image}
                                            alt={friend.name}
                                            width={48}
                                            height={48}
                                        />
                                        <h5 className="mt-1 text-xs">
                                            {friend.name}
                                        </h5>
                                    </Link>
                                </>
                            );
                        })}
                    </div>
                    {friends.length === 0 && (
                        <p className="text-sm text-secondary">
                            Không có bạn bè
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};
export default InfomationSection;
