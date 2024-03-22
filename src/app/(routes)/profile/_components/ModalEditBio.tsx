import { Button, Modal } from '@/components/ui';
import { ProfileService } from '@/lib/services';
import { TextareaAutosize } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    show: boolean;
    handleClose: () => void;
    bio: string;
}

type FormBio = {
    bio: string;
};

const ModalEditBio: React.FC<Props> = ({ show, bio, handleClose }) => {
    const path = usePathname();
    const {
        register: registerBio,
        handleSubmit: handleSubmitBio,
        formState: { errors, isSubmitting },
    } = useForm<FormBio>();

    const { data: session } = useSession();

    const changeBio: SubmitHandler<FormBio> = async (data) => {
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
            console.log('error change bio', error);
            toast.error('Không thể thay đổi tiểu sử! Đã có lỗi xảy ra');
        } finally {
            handleClose();
        }
    };

    return (
        <Modal
            className="w-[400px]"
            title={bio.length > 0 ? 'Sửa tiểu sử' : 'Thêm tiểu sử'}
            show={show}
            handleClose={handleClose}
        >
            <form onSubmit={handleSubmitBio(changeBio)}>
                <TextareaAutosize
                    className=" mt-2 w-full resize-none rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
                    spellCheck={false}
                    autoComplete="off"
                    placeholder="Nhập tiểu sử"
                    {...registerBio('bio', {
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
    );
};
export default ModalEditBio;
