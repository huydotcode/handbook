'use client';
import { Button, Icons } from '@/components/ui';
import { Fade, Modal as ModalMui } from '@mui/material';
import React from 'react';

interface Props {
    children: React.ReactNode;
    title?: string;
    show: boolean;
    handleClose: () => void;
}

const Modal: React.FC<Props> = ({ title, show, children, handleClose }) => {
    const renderHeader = () => {
        return (
            <div className="flex h-12 items-center border-b-2 dark:border-gray-500">
                <div className="w-full text-center text-xl font-extrabold">
                    {title}
                </div>
                <Button
                    className="text-2xl"
                    variant={'custom'}
                    size={'none'}
                    onClick={handleClose}
                >
                    <Icons.Close />
                </Button>
            </div>
        );
    };

    return (
        <ModalMui
            open={show}
            keepMounted
            disableAutoFocus
            onClose={handleClose}
        >
            <Fade in={show}>
                <div className="fixed left-1/2 top-1/2 flex min-w-[50vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border-t-2 bg-white p-6 shadow-md dark:border-none  dark:bg-dark-200 dark:shadow-none xl:w-[60vw] xl:max-w-none md:top-0 md:h-screen md:max-h-none md:w-screen md:translate-y-0 md:rounded-none">
                    {title && renderHeader()}

                    <div className="mt-3 flex flex-col">{children}</div>
                </div>
            </Fade>
        </ModalMui>
    );
};

export default Modal;
