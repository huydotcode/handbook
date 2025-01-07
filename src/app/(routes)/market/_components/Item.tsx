'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { formatMoney } from '@/utils/formatMoney';
import { Button } from '@/components/ui/Button';

interface Props {
    data: IItem;
}

const Item: React.FC<Props> = ({ data: item }) => {
    const { data: session } = useSession();
    if (!session) return null;

    return (
        <Button
            variant={'custom'}
            className="relative flex w-full cursor-pointer flex-col items-start justify-start border hover:bg-hover-1 dark:border-none dark:hover:bg-dark-hover-1"
            key={item._id}
            href={`/market/item/${item._id}`}
        >
            <div className="relative flex max-h-[30vh] min-h-[150px] w-full items-center">
                <Image
                    className={'object-contain'}
                    src={item.images[0].url || ''}
                    alt={item.name || ''}
                    fill={true}
                    quality={100}
                />
            </div>

            <div className={'mb-8 flex flex-col'}>
                <span className="mt-1 text-xs">{item.name}</span>

                <span className="text-xs text-secondary-1">
                    {item.location}
                </span>
            </div>

            <div className="flex w-full items-center justify-between">
                <span className="text-start text-xs">{item.seller.name}</span>

                <span className="text-end text-base font-medium">
                    {formatMoney(item.price)}
                </span>
            </div>
        </Button>
    );
};

export default Item;
