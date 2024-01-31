'use client';
import { FC } from 'react';

interface Props {
    refInView?: any;
    className?: string;
}

const SkeletonPost: FC<Props> = ({ className, refInView }) => {
    return (
        <div className={'w-full sm:w-screen no-scrollbar' + className}>
            <div
                className="relative my-4 px-4 py-2 bg-white rounded-xl shadow-md dark:bg-dark-200"
                ref={refInView}
            >
                <div className="flex items-center  ">
                    <div className="w-10 h-10 rounded-full bg-light-100 animate-skeleton dark:bg-dark-500"></div>

                    <div className="ml-2">
                        <div className="w-[88px] h-[10px] rounded-[5px] bg-light-100 animate-skeleton  dark:bg-dark-500"></div>
                        <p className="mt-2 w-[100px] h-[10px] rounded-[5px] bg-light-100 animate-skeleton  dark:bg-dark-500"></p>
                    </div>
                </div>

                <main className="flex items-center justify-between px-4 pt-[174px] pb-[16px] bg-transparent">
                    <div className="w-[66px] h-[10px] rounded-[5px] bg-light-100 animate-skeleton  dark:bg-dark-500"></div>
                    <div className="w-[66px] h-[10px] rounded-[5px] bg-light-100 animate-skeleton  dark:bg-dark-500"></div>
                    <div className="w-[66px] h-[10px] rounded-[5px] bg-light-100 animate-skeleton  dark:bg-dark-500"></div>
                </main>
            </div>
        </div>
    );
};

export default SkeletonPost;
