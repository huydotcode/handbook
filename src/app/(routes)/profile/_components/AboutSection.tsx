'use client';
import { Button, Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import ModalEditBio from './ModalEditBio';
import ModalEditInfo from './ModalEditInfo';

interface Props {
    profile: IProfile;
}

const AboutSection: React.FC<Props> = ({ profile }) => {
    const bio = profile.bio;
    const path = usePathname();

    const isAboutPage = path.includes('about');

    const [showModal, setShowModal] = useState({
        bio: false,
        info: false,
    });

    const { data: session } = useSession();
    const canEdit = session?.user.id === profile.user._id;

    const renderInfo = (info: Date | string): string => {
        if (!isNaN(Date.parse(info.toString()))) {
            const date = new Date(info);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } else if (typeof info === 'string') {
            return info.trim().length === 0 ? 'Trống' : info;
        }
        return '';
    };

    const toggleModal = (type: keyof typeof showModal) => {
        setShowModal((prev) => ({ ...prev, [type]: !prev[type] }));
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

                {canEdit && (
                    <Button
                        className="mt-2 w-full"
                        variant="secondary"
                        size="small"
                        onClick={() => toggleModal('bio')}
                    >
                        {bio.length > 0 ? 'Sửa tiểu sử' : 'Thêm tiểu sử'}
                    </Button>
                )}

                <ModalEditBio
                    show={showModal.bio}
                    bio={bio}
                    handleClose={() => toggleModal('bio')}
                />
            </article>

            {isAboutPage && (
                <article className="flex-1 p-2">
                    <ul>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Work className="mr-2" />
                            Làm việc tại {renderInfo(profile.work)}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.School className="mr-2" />
                            Học tại {renderInfo(profile.education)}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Location className="mr-2" />
                            Sống tại {renderInfo(profile.location)}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Birthday className="mr-2" />
                            Sinh nhật ngày: {renderInfo(profile.dateOfBirth)}
                        </li>
                        <li className="flex items-center p-2 text-sm">
                            <Icons.Location className="mr-2" />
                            Tham gia vào {renderInfo(profile.createdAt)}
                        </li>
                        {canEdit && (
                            <li className="flex items-center p-2 text-sm">
                                <Button
                                    variant="secondary"
                                    onClick={() => toggleModal('info')}
                                >
                                    Chỉnh sửa thông tin
                                </Button>
                            </li>
                        )}
                        <ModalEditInfo
                            profile={profile}
                            show={showModal.info}
                            handleClose={() => toggleModal('info')}
                        />
                    </ul>
                </article>
            )}
        </section>
    );
};

export default AboutSection;
