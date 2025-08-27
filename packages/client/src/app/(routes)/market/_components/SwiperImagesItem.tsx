'use client';
import { useCallback, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';

interface Props {
    images: IMedia[];
}

const SwiperImagesItem: React.FC<Props> = ({ images }) => {
    const swiperRef = useRef<SwiperType>(null);

    const handleNext = useCallback(() => {
        if (swiperRef.current) {
            // Kiểm tra nếu slide cuối thì quay lại
            if (swiperRef.current.isEnd) {
                swiperRef.current.slideTo(0);
                return;
            }

            swiperRef.current.slideNext();
        }
    }, []);

    const handlePrev = useCallback(() => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    }, []);

    return (
        <Swiper
            zoom={true}
            initialSlide={0}
            pagination={true}
            cssMode={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
            }}
            className={'h-full'}
        >
            <>
                {images.map((image, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className={'relative h-full w-full'}>
                                {images.length > 1 && (
                                    <div
                                        slot="prevButton"
                                        className={
                                            'absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full hover:bg-hover-1 hover:dark:bg-dark-secondary-1'
                                        }
                                    >
                                        <Button
                                            variant={'custom'}
                                            onClick={handlePrev}
                                        >
                                            <Icons.ArrowBack
                                                className={'h-8 w-8'}
                                            />
                                        </Button>
                                    </div>
                                )}

                                <Image
                                    className={'object-contain'}
                                    src={image.url}
                                    alt={image.publicId}
                                    fill={true}
                                />

                                {images.length > 1 && (
                                    <div
                                        slot="nextButton"
                                        className={
                                            'absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full hover:bg-hover-1 hover:dark:bg-dark-secondary-1'
                                        }
                                    >
                                        <Button
                                            variant={'custom'}
                                            onClick={handleNext}
                                        >
                                            <Icons.ArrowForward
                                                className={'h-8 w-8'}
                                            />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </>
        </Swiper>
    );
};

export default SwiperImagesItem;
