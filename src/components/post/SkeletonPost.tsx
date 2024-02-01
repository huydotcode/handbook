'use client';
import { FC } from 'react';

interface Props {
    refInView?: any;
    className?: string;
}

const SkeletonPost: FC<Props> = ({ className, refInView }) => {
    return (
        <div className={'no-scrollbar w-full sm:w-screen' + className}>
            <div
                className="relative my-4 rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-200"
                ref={refInView}
            >
                <div className="flex items-center  ">
                    <div className="h-10 w-10 animate-skeleton rounded-full bg-light-100 dark:bg-dark-500"></div>

                    <div className="ml-2">
                        <div className="h-[10px] w-[88px] animate-skeleton rounded-[5px] bg-light-100  dark:bg-dark-500"></div>
                        <p className="mt-2 h-[10px] w-[100px] animate-skeleton rounded-[5px] bg-light-100  dark:bg-dark-500"></p>
                    </div>
                </div>

                <main className="flex items-center justify-between bg-transparent px-4 pb-[16px] pt-[174px]">
                    <div className="h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-light-100  dark:bg-dark-500"></div>
                    <div className="h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-light-100  dark:bg-dark-500"></div>
                    <div className="h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-light-100  dark:bg-dark-500"></div>
                </main>
            </div>
        </div>
    );
};

export default SkeletonPost;
