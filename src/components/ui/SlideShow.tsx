'use client';
import { Modal } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import Button from './Button';
import React, { useEffect } from 'react';
import Icons from './Icons';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    images: any[];
    startIndex?: number;
}

const SlideShow: React.FC<Props> = ({ show, setShow, images, startIndex }) => {
    if (!show) return <></>;

    // Nhấn esc để thoát
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShow(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Modal open={show} onClose={() => setShow(false)} disableAutoFocus>
            <>
                <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-between overflow-hidden">
                    <div className="absolute right-0 top-0 z-50 flex h-16 w-screen items-center justify-end bg-black bg-opacity-30 px-4">
                        <Button
                            className="rounded-full"
                            variant={'secondary'}
                            onClick={() => setShow(false)}
                        >
                            <Icons.Close size={24} />
                        </Button>
                    </div>

                    <Swiper
                        zoom={true}
                        initialSlide={startIndex || 0}
                        pagination={true}
                        cssMode={true}
                        navigation={true}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className="h-screen w-screen"
                    >
                        <>
                            {images.map((image, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div
                                            className="h-full w-full bg-contain bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${image})`,
                                            }}
                                        ></div>
                                    </SwiperSlide>
                                );
                            })}
                        </>
                    </Swiper>
                </div>
            </>
        </Modal>
    );
};

export default SlideShow;
