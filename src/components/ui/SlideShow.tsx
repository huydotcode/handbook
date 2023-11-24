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
}

const SlideShow: React.FC<Props> = ({ show, setShow, images }) => {
    if (!show) return <></>;

    return (
        <Modal open={show} onClose={() => setShow(false)} disableAutoFocus>
            <>
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-between overflow-hidden bg-black">
                    <Button
                        className="absolute top-2 left-[50%] translate-x-[-50%] z-50 text-white bg-[rgba(0,0,0,0.2)] p-2 rounded-md hover:bg-[(rgba(0,0,0,0.8))]"
                        variant={'custom'}
                        size={'medium'}
                        onClick={() => setShow(false)}
                    >
                        Thoát
                    </Button>

                    <Swiper
                        pagination={true}
                        cssMode={true}
                        navigation={true}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className="w-screen h-screen"
                    >
                        <>
                            {images.map((image, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div
                                            className="w-full h-full bg-contain bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${image.url})`,
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
