import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FileUploader from '@/components/shared/FileUploader';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import toast from 'react-hot-toast';
import { updateAvatar } from '@/lib/actions/profile.action';
import { usePathname } from 'next/navigation';
import { getUrlByImageId } from '@/lib/actions/image.action';
import { useSession } from 'next-auth/react';

interface Props {
    user: IUser;
}

const Avatar: React.FC<Props> = ({ user }) => {
    const path = usePathname();
    const { data: session } = useSession();
    const [hover, setHover] = useState(false);
    const canChangeAvatar = session?.user?.id === user._id;
    const [openModal, setOpenModal] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleChangeAvatar = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-avatar',
            duration: 3000,
        });

        try {
            const images = await uploadImagesWithFiles({
                files,
            });

            const avatarId = images[0];
            const avatarUrl = await getUrlByImageId({ imageId: avatarId });

            if (!avatarUrl) {
                toast.error('Có lỗi xảy ra');
                return;
            }

            await updateAvatar({
                avatar: avatarUrl,
                userId: user._id,
                path,
            });
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
                            handleChange={(files) => setFiles(files)}
                        />

                        <DialogFooter>
                            <div className={'flex justify-end gap-2'}>
                                <Button
                                    className={'min-w-[100px]'}
                                    variant={'primary'}
                                    onClick={handleChangeAvatar}
                                    disabled={files.length === 0}
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
