'use client';
import { Modal } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import Button from './Button';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    images: any[];
    startIndex?: number;
}

const SlideShow: React.FC<Props> = ({ show, setShow, images, startIndex }) => {
    if (!show) return <></>;

    return (
        <Modal open={show} onClose={() => setShow(false)} disableAutoFocus>
            <>
                <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-between overflow-hidden">
                    <Button
                        className="absolute left-[50%] top-2 z-50 translate-x-[-50%] rounded-md p-2  "
                        variant={'custom'}
                        size={'medium'}
                        onClick={() => setShow(false)}
                    >
                        Thoát
                    </Button>

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
