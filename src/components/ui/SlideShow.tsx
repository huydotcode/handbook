'use client';
import { Modal } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { downloadImage } from '@/utils/downloadFile';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';

import Icons from './Icons';
import { Button } from '@/components/ui/Button';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    images: IMedia[];
    startIndex?: number;
}

const SlideShow: React.FC<Props> = ({ show, setShow, images, startIndex }) => {
    const [swiperInstance, setSwiperInstance] = useState<any>();

    const download = () => {
        const image = images[swiperInstance.activeIndex];
        if (!image) {
            toast.error('Không thể tải ảnh');
            return;
        }

        downloadImage(image);
    };

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
    }, [setShow]);

    if (!show) return <></>;

    return (
        <Modal open={show} onClose={() => setShow(false)} disableAutoFocus>
            <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-between overflow-hidden">
                <div className="absolute right-0 top-0 z-50 flex h-16 w-screen items-center justify-end gap-2 bg-black bg-opacity-30 px-4">
                    <Button
                        className="rounded-full"
                        variant={'secondary'}
                        onClick={download}
                    >
                        <Icons.Download size={24} />
                    </Button>

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
                    onSwiper={(swiper) => setSwiperInstance(swiper)}
                >
                    {images.map((image, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div
                                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${image.url})`,
                                    }}
                                ></div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </Modal>
    );
};

export default SlideShow;
