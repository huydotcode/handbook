'use client';
import { Button } from '@/components/ui';
import { updateGroupsCoverPhoto } from '@/lib/actions/admin/group.action';
import React, { FormEventHandler } from 'react';
import toast from 'react-hot-toast';

interface Props {}

const UpdateGroup: React.FC<Props> = ({}) => {
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        try {
            updateGroupsCoverPhoto();
        } catch (error) {
            toast.error('Không thể cập nhật ảnh bìa cho nhóm.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Button variant={'primary'}>Update</Button>
        </form>
    );
};
export default UpdateGroup;
