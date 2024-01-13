'use client';
import { sanitize } from 'isomorphic-dompurify';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import {
    changeBioAction,
    getProfilePicturesAction,
} from '@/lib/actions/profile.action';
import { TextareaAutosize } from '@mui/material';
import { usePathname } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { SlideShow } from '@/components/ui';
import Avatar from '@/components/Avatar';

interface Props {
    friends: IFriend[];
    profile: IProfile;
}

type FormValue = {
    bio: string;
};

const InfomationSection: React.FC<Props> = ({ profile, friends }) => {
    const bio = profile.bio;
    const path = usePathname();
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValue>();

    const [showSlide, setShowSlide] = useState<boolean>(false);
    const [indexPicture, setIndexPicture] = useState<number>(0);

    //! PICTURE
    const [pictures, setPictures] = useState<string[]>([]);

    const [showChangeBio, setShowChangeBio] = useState<boolean>(false);

    const canEdit = useMemo(() => {
        return session?.user.id == profile.userId;
    }, [session?.user.id, profile.userId]);

    const changeBio: SubmitHandler<FieldValues> = async (data) => {
        const newBio = data.bio;

        if (!session?.user.id) {
            toast.error('Vui lòng đăng nhập!');
            return;
        }

        if (!path) {
            toast.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
            return;
        }

        try {
            await changeBioAction({
                newBio: newBio,
                path: path,
                userId: session.user.id,
            });
        } catch (error) {
            toast.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
        } finally {
            setShowChangeBio(false);
        }
    };

    const editBioComponent = () => {
        if (!canEdit) return <></>;

        return (
            <>
                <form onSubmit={handleSubmit(changeBio)}>
                    {showChangeBio && (
                        <TextareaAutosize
                            className="w-full mt-2 p-2 resize-none bg-light-100 dark:bg-[rgba(255,255,255,.1)] focus:border-none focus:outline-none rounded-xl"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Nhập tiểu sử"
                            {...register('bio', {
                                maxLength: 300,
                            })}
                        />
                    )}

                    {errors.bio && (
                        <p className="text-xs text-red-500">
                            Tiểu sử tối đa 300 kí tự
                        </p>
                    )}

                    {showChangeBio && (
                        <Button
                            className={`w-full mt-2 ${
                                !isSubmitting && 'bg-primary'
                            }`}
                            variant={'event'}
                            size={'small'}
                            type="submit"
                        >
                            {isSubmitting ? 'Đang thay đổi...' : 'Thay đổi'}
                        </Button>
                    )}
                </form>

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

    useEffect(() => {
        (async () => {
            const pictures = await getProfilePicturesAction({
                userId: profile.userId,
            });

            setPictures(pictures);
        })();
    }, [profile.userId]);

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

                {editBioComponent()}
            </section>

            <section className="relative my-3 py-2 px-4 bg-white rounded-xl shadow-md dark:bg-dark-200">
                <h5 className="text-xl font-bold">Ảnh</h5>
                <div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {pictures
                            .slice(0, 5)
                            .map((picture: string, index: number) => {
                                return (
                                    <div
                                        className="relative w-full min-h-[200px] rounded-md shadow-md hover:cursor-pointer"
                                        key={picture}
                                        onClick={() => {
                                            setShowSlide(true);
                                            setIndexPicture(index);
                                        }}
                                    >
                                        <Image
                                            key={picture}
                                            className="rounded-md"
                                            src={picture}
                                            alt={picture}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 768px"
                                        />
                                    </div>
                                );
                            })}
                    </div>
                    {pictures.length === 0 && (
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
                        {friends.slice(0, 5).map((friend: IFriend) => {
                            const name = friend.name
                                .split(' ')
                                .filter((s) => s != '')[
                                friend.name.split(' ').filter((s) => s != '')
                                    .length - 1
                            ];

                            return (
                                <>
                                    <div className="flex flex-col items-center justify-center hover:bg-light-100 p-2">
                                        <Avatar
                                            width={42}
                                            height={42}
                                            imgSrc={friend.image}
                                            userUrl={friend._id}
                                        />

                                        <span>{name}</span>
                                    </div>
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

            <SlideShow
                images={pictures}
                show={showSlide}
                setShow={setShowSlide}
                startIndex={indexPicture}
            />
        </div>
    );
};
export default InfomationSection;
