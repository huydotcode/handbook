import ItemService from '@/lib/services/item.service';
import Image from 'next/image';
import React from 'react';
import SwiperImagesItem from '@/app/(routes)/market/_components/SwiperImagesItem';
import { formatMoney } from '@/utils/formatMoney';
import { Button, Icons } from '@/components/ui';
import { getAuthSession } from '@/lib/auth';
import Item from '@/app/(routes)/market/_components/Item';

interface Props {
    params: {
        itemId: string;
    };
}

export default async function ItemPage({ params }: Props) {
    const session = await getAuthSession();

    if (!session) return null;

    const item: IItem = await ItemService.getItemById({ id: params.itemId });
    const itemsOther = await ItemService.getItemsBySeller({
        seller: item.seller._id,
    });
    const isOwner = session?.user?.id === item.seller._id;

    return (
        <div className={'m-2 flex h-full w-full p-2'}>
            <div
                className={
                    'flex h-[calc(100vh-80px)] w-full justify-between lg:flex-col'
                }
            >
                {/* Left */}
                <div
                    className={
                        'h-full min-w-[500px] max-w-[70vw] rounded-xl border p-2'
                    }
                >
                    <SwiperImagesItem images={item.images} />
                </div>

                {/* Right */}
                <div className={'ml-4 h-full flex-1'}>
                    <h1 className={'text-xl font-bold'}>{item.name}</h1>
                    <p className={'mt-2 text-sm'}>{item.category.name}</p>

                    <p className="mt-2 text-xl font-bold text-primary-1 dark:text-dark-primary-1">
                        {formatMoney(item.price)}
                    </p>

                    <span className={'mt-2 flex items-center'}>
                        <Icons.Location className={'h-4 w-4'} />
                        <p className={'ml-2 text-sm'}>{item.location}</p>
                    </span>

                    <span className={'mt-2 flex items-center'}>
                        <Icons.Time className={'h-4 w-4'} />
                        <p className={'ml-2 text-sm'}>
                            Cập nhật: {new Date(item.updatedAt).toDateString()}
                        </p>
                    </span>

                    <h5 className={'mt-2 text-lg font-bold'}>Mô tả</h5>
                    <p className={'text-sm text-secondary-1'}>
                        {item.description}
                    </p>

                    <div className="mt-2 flex items-center">
                        {!isOwner && (
                            <Button variant={'primary'}>Nhắn tin</Button>
                        )}
                    </div>

                    <div className="mt-2 rounded-xl border px-4 py-2">
                        <h5 className={'mt-2 text-lg font-bold'}>
                            Thông tin người bán
                        </h5>
                        <div className="flex items-center">
                            <Image
                                src={item.seller.avatar}
                                alt={item.seller.name}
                                width={50}
                                height={50}
                                className={'rounded-full'}
                            />

                            <p className={'ml-2 text-sm text-secondary-1'}>
                                {item.seller.name}
                            </p>
                        </div>
                        <h5 className={'mt-2 text-lg font-bold'}>
                            Mặt hàng khác
                        </h5>

                        <div
                            className={
                                'grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1'
                            }
                        >
                            {itemsOther
                                .filter((i: IItem) => i._id !== item._id)
                                .map((item: IItem) => (
                                    <Item data={item} key={item._id} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
