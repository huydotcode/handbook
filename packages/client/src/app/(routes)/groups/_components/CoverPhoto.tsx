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
import ImageService from '@/lib/services/image.service';
import { uploadImageWithFile } from '@/lib/uploadImage';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    group: IGroup;
}

const CoverPhoto: React.FC<Props> = ({ group }) => {
    const { data: session } = useSession();
    const canChangeCoverPhoto = session?.user.id === group.creator._id;
    const [openModal, setOpenModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const path = usePathname();

    const handleChangeCoverPhoto = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-cover-photo',
            duration: 3000,
        });

        try {
            if (!file) {
                toast.error('Vui lòng chọn ảnh để tải lên');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn tệp hình ảnh');
                return;
            }

            const images = await uploadImageWithFile({
                file,
            });

            const coverPhotoId = images._id;
            const coverPhotoUrl =
                await ImageService.getUrlByImageId(coverPhotoId);

            if (!coverPhotoUrl) {
                toast.error('Có lỗi xảy ra');
                return;
            }

            await GroupService.updateCoverPhoto({
                groupId: group._id,
                coverPhoto: coverPhotoUrl,
                path,
            });
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <>
            <div
                className="relative h-[40vh] min-h-[500px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${group.coverPhoto || '/assets/img/cover-page.jpg'}`,
                }}
            >
                {canChangeCoverPhoto && (
                    <Dialog
                        open={openModal}
                        onOpenChange={(isOpen) => setOpenModal(isOpen)}
                    >
                        <DialogTrigger asChild={true}>
                            <Button
                                className="absolute bottom-0 right-0 m-2 text-sm"
                                variant={'secondary'}
                                onClick={() => setOpenModal(true)}
                            >
                                Thay đổi ảnh bìa
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thay đổi ảnh bìa</DialogTitle>
                            </DialogHeader>

                            <FileUploader
                                single
                                handleChange={(files) => {
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
                                        onClick={handleChangeCoverPhoto}
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
        </>
    );
};

export default CoverPhoto;
