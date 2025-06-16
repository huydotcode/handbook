import { Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ProfileService from '@/lib/services/profile.service';
import logger from '@/utils/logger';
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

            toast.success('Thay đổi tiểu sử thành công!');
        } catch (error) {
            logger({
                message: 'error change bio' + error,
                type: 'error',
            });
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
                <Input
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
                    size={'sm'}
                    type="submit"
                    variant={'primary'}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang thay đổi...' : 'Thay đổi'}
                </Button>
            </form>
        </Modal>
    );
};
export default ModalEditBio;
