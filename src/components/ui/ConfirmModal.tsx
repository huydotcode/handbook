'use client';
import { Modal } from '@mui/material';
import React, { FormEventHandler } from 'react';
import { Button } from '@/components/ui';
import Icons from './Icons';

interface Props {
    open: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    onConfirm: FormEventHandler;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

const ConfirmModal: React.FC<Props> = ({
    cancelText,
    confirmText,
    message,
    onClose,
    onConfirm,
    open,
    title,
    setShow,
}) => {
    const handleClose = () => setShow(false);

    return (
        <Modal open={open} disableAutoFocus>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="rounded-xl bg-white px-6 py-4 shadow-xl dark:bg-dark-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <Button onClick={handleClose}>
                            <Icons.Close />
                        </Button>
                    </div>
                    <p className="mt-2">{message}</p>
                    <div className="mt-4 flex justify-end">
                        <form onSubmit={onConfirm}>
                            <Button
                                variant={'warning'}
                                type="submit"
                                className="mr-2 "
                                size={'small'}
                            >
                                {confirmText}
                            </Button>
                        </form>
                        <Button
                            variant={'secondary'}
                            onClick={onClose}
                            className="text-secondary"
                            size={'small'}
                        >
                            {cancelText}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default ConfirmModal;
