import { Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import queryKey from '@/lib/queryKey';
import ProfileService from '@/lib/services/profile.service';
import logger from '@/utils/logger';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    profile: IProfile;
    show: boolean;
    handleClose: () => void;
}

type FormInfo = {
    work: string;
    location: string;
    dateOfBirth: Date;
    education: string;
};

const ModalEditInfo: React.FC<Props> = ({ profile, show, handleClose }) => {
    const { data: locations } = useQuery<ILocation[]>({
        queryKey: queryKey.locations,
        queryFn: async () => {
            const locations = await ProfileService.getLocations();
            return locations;
        },
    });

    const path = usePathname();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInfo>({
        defaultValues: {
            dateOfBirth: profile.dateOfBirth,
            education: profile.education,
            location: profile.location,
            work: profile.work,
        },
    });

    const changeInfo: SubmitHandler<FormInfo> = async (data) => {
        if (isSubmitting) return;

        try {
            await ProfileService.updateInfo({
                ...data,
                profileId: profile._id,
                path,
            });

            toast.success('Cập nhật thành công!');

            handleClose();
        } catch (error) {
            logger({
                message: 'Error edit info' + error,
                type: 'error',
            });
            toast.error('Đã có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    return (
        <Modal
            className="w-[500px]"
            show={show}
            handleClose={handleClose}
            title="Chỉnh sửa thông tin"
        >
            <>
                <form onSubmit={handleSubmit(changeInfo)}>
                    {/* Work */}
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="work">
                            Nơi làm việc
                        </label>

                        <Input
                            id="work"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Nhập nơi làm việc..."
                            {...register('work', {
                                maxLength: 50,
                                required: false,
                            })}
                        />

                        {errors.work && (
                            <p className="text-xs text-warning">
                                Trường này tối đa 50 kí tự
                            </p>
                        )}
                    </div>

                    {/* Education */}
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="education">
                            Từng học tại
                        </label>

                        <Input
                            id="education"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Nhập nơi từng học..."
                            {...register('education', {
                                maxLength: 50,
                                required: false,
                            })}
                        />

                        {errors.education && (
                            <p className="text-xs text-warning">
                                Trường này tối đa 50 kí tự
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="location">
                            Nơi bạn ở
                        </label>

                        <select
                            className="mt-2 w-full resize-none rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
                            id="location"
                            {...register('location')}
                        >
                            {locations &&
                                locations.map((item) => (
                                    <option
                                        key={item.slug}
                                        value={item.nameWithType}
                                    >
                                        {item.nameWithType}
                                    </option>
                                ))}
                        </select>

                        {errors.location && (
                            <p className="text-xs text-warning">
                                Trường này tối đa 50 kí tự
                            </p>
                        )}
                    </div>

                    {/* Birthday */}
                    <div className="mb-2">
                        <label className="text-sm" htmlFor="dateOfBirth">
                            Ngày sinh
                        </label>

                        <input
                            id="dateOfBirth"
                            className="mt-2 w-full resize-none rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
                            autoComplete="off"
                            placeholder="Bạn đến từ..."
                            type="date"
                            {...register('dateOfBirth', {
                                validate: (v) => new Date(v) < new Date(),
                                required: false,
                            })}
                        />

                        {errors.dateOfBirth && (
                            <p className="text-xs text-warning">
                                Ngày không hợp lệ
                            </p>
                        )}
                    </div>

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

                <Button
                    className={`mt-2 w-full ${!isSubmitting && ''}`}
                    size={'sm'}
                    onClick={handleClose}
                    variant={'secondary'}
                >
                    Hủy bỏ
                </Button>
            </>
        </Modal>
    );
};

export default ModalEditInfo;
