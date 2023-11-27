'use client';
import { FC, useState } from 'react';
import SlideShow from '../ui/SlideShow';
import Image from 'next/image';

interface Props {
    images: any;
}

const PhotoGrid: FC<Props> = ({ images }) => {
    const [showSlide, setShowSlide] = useState<boolean>(false);

    return (
        <>
            <div className="relative mt-3 h-[300px]">
                <div>
                    <div
                        className="w-full h-[300px] bg-cover rounded-md bg-no-repeat bg-center cursor-pointer hover:opacity-80 transition-all"
                        style={{ backgroundImage: `url(${images[0].url})` }}
                        onClick={() => setShowSlide((prev) => !prev)}
                    ></div>
                </div>

                {images.length > 1 && (
                    <>
                        <div className="flex items-center justify-center flex-col absolute bottom-0 right-0  rounded-l-md overflow-hidden">
                            <div className="relative flex items-center justify-center transition-all h-full">
                                <div className="relative w-[80px] h-[80px]">
                                    <Image
                                        className=" object-cover"
                                        src={images[1].url || ''}
                                        alt=""
                                        quality={100}
                                        fill
                                    />
                                </div>

                                <div
                                    className="flex items-center justify-center flex-col absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] cursor-pointer"
                                    onClick={() =>
                                        setShowSlide((prev) => !prev)
                                    }
                                >
                                    <p className="text-white text-2xl">
                                        +{images.length - 1}
                                    </p>
                                    <h5 className="text-white text-sm hover:underline">
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
