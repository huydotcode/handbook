'use client';
import Image from 'next/image';
import { FC, useState } from 'react';
import SlideShow from '../ui/SlideShow';

interface Props {
    images: IMedia[];
}

const PhotoGrid: FC<Props> = ({ images }) => {
    const [showSlide, setShowSlide] = useState<boolean>(false);

    return (
        <>
            <div className="relative mt-3 h-[300px]">
                <div>
                    <div
                        className="h-[300px] w-full cursor-pointer rounded-md bg-cover bg-center bg-no-repeat transition-all hover:opacity-80"
                        style={{ backgroundImage: `url(${images[0].url})` }}
                        onClick={() => setShowSlide((prev) => !prev)}
                    ></div>
                </div>

                {images.length > 1 && (
                    <>
                        <div className="absolute bottom-0 right-0 flex flex-col items-center justify-center overflow-hidden rounded-md border shadow-md dark:border-white">
                            <div className="relative flex h-full items-center justify-center transition-all">
                                <div className="relative h-[80px] w-[80px]">
                                    <Image
                                        className=" object-cover"
                                        src={images[0].url || ''}
                                        alt=""
                                        quality={100}
                                        fill
                                    />
                                </div>

                                <div
                                    className="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-[rgba(0,0,0,0.2)] text-white "
                                    onClick={() =>
                                        setShowSlide((prev) => !prev)
                                    }
                                >
                                    <p className="text-2xl font-bold drop-shadow-xl">
                                        +{images.length - 1}
                                    </p>
                                    <h5 className="text-sm hover:underline">
                                        Xem thêm
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <SlideShow
                show={showSlide}
                setShow={setShowSlide}
                images={images}
            />
        </>
    );
};

export default PhotoGrid;
