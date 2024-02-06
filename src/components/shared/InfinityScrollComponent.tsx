'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
    className?: string;
    fetchMore: () => void;
    hasMore: boolean;
    Loader: React.FC;
    pageSize: number;
    children: React.ReactNode;
    endMessage?: string;
    type: 'post' | 'comment';
    loading: boolean;
}

const InfinityScrollComponent: React.FC<Props> = ({
    loading,
    Loader,
    fetchMore,
    pageSize,
    className,
    children,
    endMessage,
    type,
    hasMore,
}) => {
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const { ref: bottomRef, inView } = useInView({
        threshold: 0,
    });

    const renderSkeletons = () => {
        return Array.from({ length: pageSize }).map((_, index) => (
            <Loader key={index} />
        ));
    };

    useEffect(() => {
        if (inView && hasMore) {
            fetchMore();
        }
    }, [inView]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
    }, []);

    return (
        <>
            <div
                className={cn(
                    type === 'post' &&
                        'no-scrollbar w-[600px] max-w-[100vw] transition-all duration-300 ease-in-out xl:w-[500px]',
                    className
                )}
            >
                {firstRender && loading && renderSkeletons()}

                {children}

                {!firstRender && loading && renderSkeletons()}

                {hasMore && (
                    <div className="min-h-[100px] w-full" ref={bottomRef} />
                )}

                {!hasMore && endMessage && (
                    <div className="text-center">
                        <p className="pb-10 text-gray-500 dark:text-gray-400">
                            {endMessage}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
export default InfinityScrollComponent;
