'use client';
import { Button } from '@/components';
import { changeBioAction } from '@/lib/actions/profile.action';
import { cn } from '@/lib/utils';
import { TextareaAutosize } from '@mui/material';
import DOMPurify from 'dompurify';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdSchool } from 'react-icons/io';
import { MdWork } from 'react-icons/md';

interface Props {
    profile: IProfile;
}

type FormValue = {
    bio: string;
};

const MOCK_DATA = {
    work: 'Công ty công nghệ hàng đầu Việt Nam',
    school: 'Đại học Công nghiệp TPHCM',
    lives: 'Long An',
    relationship: 'Độc thân',
    joined: 'Tham gia từ 2021',
};

const AboutSection: React.FC<Props> = ({ profile }) => {
    const bio = profile.bio;
    const path = usePathname();
    const isAboutPage = useMemo(() => {
        return path.includes('about');
    }, [path]);

    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValue>();

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
                            className="mt-2 w-full resize-none rounded-xl bg-light-100 p-2 focus:border-none focus:outline-none dark:bg-[rgba(255,255,255,.1)]"
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
                            className={`mt-2 w-full ${
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
                        className="mt-2 w-full"
                        variant={'event'}
                        size={'small'}
                        onClick={() => setShowChangeBio((prev) => !prev)}
                    >
                        {showChangeBio ? 'Tắt chỉnh sửa' : 'Sửa tiểu sử'}
                    </Button>
                ) : (
                    <Button
                        className="mt-2 w-full"
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
        <section
            className={cn(
                'relative my-3 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-200',
                isAboutPage && 'flex'
            )}
        >
            <article className={cn('p-2', isAboutPage && 'w-[30%] border-r')}>
                <h5 className="text-xl font-bold">Giới thiệu</h5>

                {DOMPurify.sanitize && (
                    <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(bio),
                        }}
                    />
                )}

                {editBioComponent()}
            </article>

            {isAboutPage && (
                <article className="flex-1 p-2">
                    <ul>
                        <li className="flex items-center p-2 text-sm">
                            <MdWork className="mr-2 text-gray-500" />
                            Làm việc tại {MOCK_DATA.work}
                        </li>

                        <li className="flex items-center px-2 py-4 text-sm">
                            <IoMdSchool className="mr-2 text-gray-500" />
                            Học tại {MOCK_DATA.school}
                        </li>

                        <li className="flex items-center p-2 text-sm">
                            <FaLocationDot className="mr-2 text-gray-500" />
                            Sống tại {MOCK_DATA.lives}
                        </li>

                        <li className="flex items-center p-2 text-sm">
                            <FaHeart className="mr-2 text-gray-500" />
                            {MOCK_DATA.relationship}
                        </li>
                    </ul>
                </article>
            )}
        </section>
    );
};
export default AboutSection;
