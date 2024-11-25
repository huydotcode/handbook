import { Container } from '@/components/layout';
import ItemService from '@/lib/services/item.service';
import React from 'react';
import Item from './_components/Item';

interface Props {}

const MarketPage: React.FC<Props> = async () => {
    const items = await ItemService.getItems();

    return (
        <div className={'h-full w-full bg-secondary-1 pl-2 pt-2'}>
            <h1 className={'text-xl font-bold'}>
                Trang hiện tại chưa khả dụng
            </h1>
        </div>
    );
};

export default MarketPage;
