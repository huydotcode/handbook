'use client';
import { Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { createGroup } from '@/lib/actions/group.action';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {}

interface ICreateGroup {
    name: string;
    description: string;
}

const CreateGroup: React.FC<Props> = ({}) => {
    const { handleSubmit, register } = useForm<ICreateGroup>();

    const [showModalCreateGroup, setShowModalCreateGroup] =
        useState<boolean>(false);

    const handleOpen = () => {
        setShowModalCreateGroup(true);
    };

    const handleClose = () => {
        setShowModalCreateGroup(false);
    };

    const onSubmit = async (data: ICreateGroup) => {
        const { name, description } = data;

        const newGroup = await createGroup({ name, description });

        if (!newGroup.success) {
            toast.error(newGroup.msg);
            handleClose();
            return;
        }

        if (newGroup.data) {
            toast.success('Tạo nhóm thành công');
            handleClose();
        }
    };

    return (
        <>
            <div className="flex justify-center">
                <Button
                    className="w-full"
                    onClick={handleOpen}
                    size={'small'}
                    variant={'event'}
                >
                    Tạo nhóm mới
                </Button>
            </div>

            <Modal
                title="Tạo nhóm mới"
                show={showModalCreateGroup}
                handleClose={handleClose}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4"
                    autoComplete="off"
                >
                    <label htmlFor="name">
                        <h2>Tên nhóm</h2>
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Tên nhóm"
                        className="rounded-md border border-gray-300 p-2"
                        {...register('name', { required: true })}
                    />
                    <input
                        id="description"
                        type="text"
                        placeholder="Mô tả"
                        autoComplete="off"
                        className="rounded-md border border-gray-300 p-2"
                        {...register('description', { required: true })}
                    />
                    <Button variant="contained">Tạo nhóm</Button>
                </form>
            </Modal>
        </>
    );
};
export default CreateGroup;
