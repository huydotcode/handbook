'use client';
import { Button, Icons, Modal } from '@/components/ui';
import { ProfileService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { TextareaAutosize } from '@mui/material';
import DOMPurify from 'dompurify';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

    const [showModalEditBio, setShowModalEditBio] = useState<boolean>(false);

    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValue>();

    const canEdit = useMemo(() => {
        return session?.user.id == profile.userId;
    }, [session?.user.id, profile.userId]);

    const changeBio: SubmitHandler<FieldValues> = async (data) => {
        const newBio = data.bio;

        if (!session?.user.id) {
            toast.error('Vui lòng đăng nhập!');
            return;
        }

        try {
            await ProfileService.updateBio({
                newBio: newBio,
                path: path,
                userId: session.user.id,
            });
        } catch (error) {
            toast.error('Không thể thay đổi tiểu sử! Đã có lỗi xảy ra');
        } finally {
            setShowModalEditBio(false);
        }
    };

    const handleCloseModal = () => setShowModalEditBio(false);

    const editBioComponent = () => {
        if (!canEdit) return <></>;

        return (
            <>
                <Modal
                    title={bio.length > 0 ? 'Sửa tiểu sử' : 'Thêm tiểu sử'}
                    show={showModalEditBio}
                    handleClose={handleCloseModal}
                >
                    <form onSubmit={handleSubmit(changeBio)}>
                        <TextareaAutosize
                            className=" mt-2 w-full resize-none rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Nhập tiểu sử"
                            {...register('bio', {
                                maxLength: 300,
                            })}
                        />

                        {errors.bio && (
                            <p className="text-xs">Tiểu sử tối đa 300 kí tự</p>
                        )}

                        <Button
                            className={`mt-2 w-full ${!isSubmitting && ''}`}
                            size={'small'}
                            type="submit"
                            variant={'warning'}
                        >
                            {isSubmitting ? 'Đang thay đổi...' : 'Thay đổi'}
                        </Button>
                    </form>
                </Modal>

                {bio.length > 0 ? (
                    <Button
                        className="mt-2 w-full"
                        variant={'secondary'}
                        size={'small'}
                        onClick={() => {
                            setShowModalEditBio((prev) => !prev);
                        }}
                    >
                        Sửa tiểu sử
                    </Button>
                ) : (
                    <Button
                        className="mt-2 w-full"
                        variant={'secondary'}
                        size={'small'}
                        onClick={() => {
                            setShowModalEditBio((prev) => !prev);
                        }}
                    >
                        Thêm tiểu sử
                    </Button>
                )}
            </>
        );
    };

    return (
        <section
            className={cn(
                'relative rounded-xl bg-secondary-1 px-4 py-2 shadow-md dark:bg-dark-secondary-1',
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
                            <Icons.Work className="mr-2 " />
                            Làm việc tại {MOCK_DATA.work}
                        </li>

                        <li className="flex items-center px-2 py-4 text-sm">
                            <Icons.School className="mr-2 " />
                            Học tại {MOCK_DATA.school}
                        </li>

                        <li className="flex items-center p-2 text-sm">
                            <Icons.Location className="mr-2 " />
                            Sống tại {MOCK_DATA.lives}
                        </li>

                        <li className="flex items-center p-2 text-sm">
                            <Icons.Heart2 className="mr-2 " />
                            {MOCK_DATA.relationship}
                        </li>
                    </ul>
                </article>
            )}
        </section>
    );
};
export default AboutSection;
