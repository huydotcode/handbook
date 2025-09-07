'use client';
import { Button } from '@/components/ui/Button';
import Image, { ErrorImage } from '@/components/ui/image';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/formatMoney';
import React from 'react';
import EditItem from './EditItem';

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
        <div className="relative">
            <Button
                variant={'ghost'}
                className={cn(
                    'relative flex h-[400px] cursor-pointer flex-col items-start justify-start border bg-secondary-1 px-4 py-2 shadow-sm hover:bg-hover-1 dark:border-none dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1',
                    className
                )}
                key={item._id}
                href={`/market/item/${item._id}`}
            >
                <div className="relative flex h-3/4 w-full items-center overflow-hidden rounded-md">
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

                <div className="flex h-1/4 w-full flex-1 flex-col justify-between">
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
    );
};

export default Item;
