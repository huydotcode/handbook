'use client';
import { Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Fade, Modal as ModalMui } from '@mui/material';
import React from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
    className?: string;
    children: React.ReactNode;
    title?: string;
    show: boolean;
    width?: string;
    handleClose: () => void;
}

const Modal: React.FC<Props> = ({
    className,
    title,
    show,
    children,
    width = '50vw',
    handleClose,
}) => {
    const renderHeader = () => {
        return (
            <div className="relative flex h-12 items-center border-b-2">
                <div className="w-full text-center text-xl font-extrabold">
                    {title}
                </div>
                <Button
                    variant={'secondary'}
                    size={'sm'}
                    className="absolute right-2 text-2xl"
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
                <div
                    className={cn(
                        'fixed left-1/2 top-1/2 flex max-h-[90vh] max-w-screen translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border-t-2 bg-secondary-1 p-6 shadow-md dark:border-none dark:bg-dark-primary-1 dark:shadow-none md:top-0 md:h-screen md:max-h-none md:w-screen md:max-w-none md:translate-y-0 md:rounded-none',
                        `w-[${width}]`,
                        className
                    )}
                >
                    {title && renderHeader()}

                    <div className="mt-3 flex flex-col overflow-auto">
                        {children}
                    </div>
                </div>
            </Fade>
        </ModalMui>
    );
};

export default Modal;
