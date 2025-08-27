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
import GroupService from '@/lib/services/group.service';
import { uploadImageWithFile } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
}

const Avatar: React.FC<Props> = ({ group }) => {
    const path = usePathname();
    const { data: session } = useSession();
    const [hover, setHover] = useState(false);
    const canChangeAvatar = session?.user?.id === group.creator._id;
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

            const avatar = await uploadImageWithFile({
                file: file,
            });

            if (!avatar?._id) {
                toast.error(
                    'Có lỗi xảy ra khi tải ảnh lên, vui lòng thử lại sau'
                );
                return;
            }

            await GroupService.updateAvatar({
                avatarId: avatar._id,
                groupId: group._id,
                path,
            });

            toast.success('Thay đổi ảnh đại diện thành công');
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
                src={group?.avatar.url || ''}
                alt={group?.name || ''}
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
                            handleChange={(files) => {
                                if (files.length > 0) {
                                    setFile(files[0]);
                                }
                            }}
                            onlyImage
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
