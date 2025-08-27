'use client';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/formatMoney';
import React from 'react';
import EditItem from './EditItem';
import Image, { ErrorImage } from '@/components/ui/image';

interface Props {
    className?: string;
    data: IItem;
    isManage?: boolean;
}

const Item: React.FC<Props> = ({
    className = '',
    data: item,
    isManage = false,
}) => {
    return (
        <>
            <div>
                <Button
                    variant={'ghost'}
                    className={cn(
                        'relative flex h-[400px] w-[300px] cursor-pointer flex-col items-start justify-start border bg-secondary-1 shadow-sm hover:bg-hover-1 dark:border-none dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1 md:max-w-full',
                        className
                    )}
                    key={item._id}
                    href={`/market/item/${item._id}`}
                >
                    <div className="relative flex h-3/4 w-full items-center overflow-hidden rounded-xl shadow-md">
                        {item?.images[0] ? (
                            <Image
                                className={'object-cover'}
                                src={item?.images[0]?.url}
                                alt={item.name || ''}
                                fill={true}
                                quality={100}
                            />
                        ) : (
                            <ErrorImage />
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex h-1/4 w-full flex-1 flex-col justify-between p-4 pb-2">
                        <div className={'flex w-full flex-col'}>
                            <p className="text-md mt-1 whitespace-pre-wrap">
                                {item.name}
                            </p>

                            <span className="text-xs text-secondary-1">
                                {item.location.name}
                            </span>
                        </div>

                        <div className={'mt-2 flex w-full justify-end'}>
                            <span className="text-end text-base font-medium">
                                {formatMoney(item.price)}
                            </span>
                        </div>
                    </div>
                </Button>

                {isManage && <EditItem data={item} />}
            </div>
        </>
    );
};

export default Item;
