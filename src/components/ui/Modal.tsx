import React from 'react';
import { Fade, Modal as ModalMui } from '@mui/material';
import { Button } from '..';
import { CgClose } from 'react-icons/cg';
import { IShowModal } from '../post/ActionPost';

interface Props {
    children: React.ReactNode;
    title?: string;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<IShowModal>>;
}

const Modal: React.FC<Props> = ({ title, show, children, setShow }) => {
    const handleClose = () =>
        setShow((prev) => ({ ...prev, editModal: false, deleteModal: false }));

    const renderHeader = () => {
        return (
            <div className="flex items-center h-12 border-b-2 dark:border-gray-500">
                <div className="w-full text-xl font-extrabold text-center">
                    {title}
                </div>
                <Button
                    className="text-2xl"
                    variant={'custom'}
                    size={'none'}
                    onClick={handleClose}
                >
                    <CgClose />
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
                <div className="fixed flex flex-col top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-xl p-6 max-w-[800px] min-w-[50vw] bg-white shadow-md border-t-2 md:w-screen  md:rounded-none md:h-screen md:max-h-none md:top-0 md:translate-y-0 xl:max-w-none xl:w-[60vw] dark:bg-dark-200 dark:shadow-none dark:border-none">
                    {title && renderHeader()}

                    <div className="flex flex-col mt-3">{children}</div>
                </div>
            </Fade>
        </ModalMui>
    );
};

export default Modal;
