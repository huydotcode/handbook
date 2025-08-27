import FileUploader from '@/components/shared/FileUploader';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import ProfileService from '@/lib/services/profile.service';
import { uploadImageWithFile } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    user: IUser;
}

const Avatar: React.FC<Props> = ({ user }) => {
    const path = usePathname();
    const { data: session, update } = useSession();
    const [hover, setHover] = useState(false);
    const canChangeAvatar = session?.user?.id === user._id;
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleChangeAvatar = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-avatar',
            duration: 3000,
        });

        try {
            if (!file) {
                toast.error('Vui lòng chọn ảnh để tải lên');
                return;
            }

            const image = await uploadImageWithFile({
                file,
            });

            await ProfileService.updateAvatar({
                avatar: image.url,
                userId: user._id,
                path,
            });

            toast.success('Cập nhật ảnh đại diện thành công', {
                id: 'uplodate-avatar',
            });

            // Update session data
            if (session?.user) {
                update({
                    ...session,
                    user: {
                        ...session.user,
                        image: image.url,
                    },
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div
            className="relative top-[-30px] mr-4 h-[164px] w-[164px] overflow-hidden rounded-full border-8 object-cover dark:border-dark-secondary-2 md:h-[120px] md:w-[120px]"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Image
                className={cn(
                    'rounded-full transition-all duration-200',
                    hover && canChangeAvatar && 'opacity-80'
                )}
                src={user?.avatar || ''}
                alt={user?.name || ''}
                fill
            />

            {canChangeAvatar && (
                <Dialog
                    open={openModal}
                    onOpenChange={(isOpen) => setOpenModal(isOpen)}
                >
                    <DialogTrigger asChild={true}>
                        {hover && (
                            <div className="absolute bottom-0 left-0 right-0 rounded-b-full bg-dark-secondary-1  bg-opacity-90 p-2">
                                <Button
                                    variant={'custom'}
                                    className="w-full text-sm text-white"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Thay đổi
                                </Button>
                            </div>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
                        </DialogHeader>

                        <FileUploader
                            single
                            onlyImage
                            handleChange={(files) => {
                                console.log('Handle file change:', files);
                                if (files.length > 0) {
                                    setFile(files[0]);
                                } else {
                                    setFile(null);
                                }
                            }}
                        />

                        <DialogFooter>
                            <div className={'flex justify-end gap-2'}>
                                <Button
                                    className={'min-w-[100px]'}
                                    variant={'primary'}
                                    onClick={handleChangeAvatar}
                                    disabled={!file}
                                >
                                    Lưu
                                </Button>

                                <Button
                                    variant={'secondary'}
                                    onClick={() => setOpenModal(false)}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Avatar;
