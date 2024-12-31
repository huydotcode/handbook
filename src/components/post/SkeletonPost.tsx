'use client';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface Props {
    refInView?: any;
    className?: string;
}

const SkeletonPost: FC<Props> = ({ className, refInView }) => {
    return (
        <div className={cn('no-scrollbar mb-4 w-full sm:w-screen', className)}>
            <div
                className="relative my-4 overflow-hidden rounded-xl bg-white px-4 py-2 shadow-md dark:bg-dark-secondary-1"
                ref={refInView}
            >
                <div className="flex items-center">
                    <div className=" h-10 w-10 animate-skeleton rounded-full bg-skeleton"></div>

                    <div className="ml-2">
                        <div className=" h-[10px] w-[88px] animate-skeleton rounded-[5px] bg-skeleton"></div>
                        <p className=" mt-2 h-[10px] w-[100px] animate-skeleton rounded-[5px] bg-skeleton"></p>
                    </div>
                </div>

                <main className="flex items-center justify-between  px-4 pb-[16px] pt-[174px]">
                    <div className=" h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-skeleton"></div>
                    <div className=" h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-skeleton"></div>
                    <div className=" h-[10px] w-[66px] animate-skeleton rounded-[5px] bg-skeleton"></div>
                </main>
            </div>
        </div>
    );
};

export default SkeletonPost;
