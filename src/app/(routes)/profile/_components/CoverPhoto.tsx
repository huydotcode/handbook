import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import FileUploader from '@/components/shared/FileUploader';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { getUrlByImageId } from '@/lib/actions/image.action';
import toast from 'react-hot-toast';
import { updateAvatar, updateCoverPhoto } from '@/lib/actions/profile.action';
import { usePathname } from 'next/navigation';

interface Props {
    profile: IProfile;
}

const CoverPhoto: React.FC<Props> = ({ profile }) => {
    const { data: session } = useSession();
    const canChangeCoverPhoto = session?.user.id === profile.user._id;
    const [openModal, setOpenModal] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [hover, setHover] = useState(false);
    const path = usePathname();

    const handleChangeCoverPhoto = async () => {
        setOpenModal(false);
        toast.loading('Đang tải ảnh lên...', {
            id: 'uplodate-cover-photo',
            duration: 3000,
        });

        try {
            const images = await uploadImagesWithFiles({
                files,
            });

            const coverPhotoId = images[0];
            const coverPhotoUrl = await getUrlByImageId({
                imageId: coverPhotoId,
            });

            if (!coverPhotoUrl) {
                toast.error('Có lỗi xảy ra');
                return;
            }

            await updateCoverPhoto({
                coverPhoto: coverPhotoUrl,
                userId: profile.user._id,
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
                    backgroundImage: `url("${profile.coverPhoto || '/assets/img/cover-page.jpg'}`,
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
                                handleChange={(files) => setFiles(files)}
                            />

                            <DialogFooter>
                                <div className={'flex justify-end gap-2'}>
                                    <Button
                                        className={'min-w-[100px]'}
                                        variant={'primary'}
                                        onClick={handleChangeCoverPhoto}
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
        </>
    );
};

export default CoverPhoto;
