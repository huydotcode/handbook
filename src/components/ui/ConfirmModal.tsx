'use client';
import { Modal } from '@mui/material';
import React, { FormEventHandler } from 'react';

import Icons from './Icons';
import { Button } from '@/components/ui/Button';

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

    const handleConfirm = (e: React.FormEvent<Element>) => {
        handleClose();
        onConfirm(e);
    };

    return (
        <Modal open={open} disableAutoFocus>
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-white dark:bg-dark-secondary-1 md:min-w-[80vw]">
                <div className="rounded-xl px-6 py-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <Button
                            className="rounded-xl p-2"
                            onClick={handleClose}
                        >
                            <Icons.Close className={'h-6 w-6'} />
                        </Button>
                    </div>
                    <p className="mt-4">{message}</p>
                    <div className="mt-4 flex justify-end">
                        <Button
                            className="mr-2 rounded-md px-4 py-2"
                            variant={'warning'}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </Button>

                        <Button
                            className="rounded-md px-6 py-2"
                            variant={'secondary'}
                            onClick={onClose}
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
